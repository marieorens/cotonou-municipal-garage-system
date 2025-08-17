-- Disable signup function and update profiles for admin-only creation
-- Update existing profiles table to have better user management
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add created_by field to track who created the user
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Update handle_new_user function to NOT auto-create profiles
-- Only admin should create profiles manually
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Do not auto-create profile, admin will create manually
  RETURN NEW;
END;
$function$;

-- Create enhanced payments table for KKIAPAY integration
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  owner_id UUID NOT NULL REFERENCES public.owners(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XOF',
  
  -- KKIAPAY specific fields
  kkiapay_transaction_id TEXT UNIQUE,
  kkiapay_token TEXT,
  payment_method TEXT, -- mobile_money, credit_card, etc.
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Fee breakdown
  storage_fees DECIMAL(10,2) DEFAULT 0,
  administrative_fees DECIMAL(10,2) DEFAULT 0,
  penalty_fees DECIMAL(10,2) DEFAULT 0,
  days_impounded INTEGER DEFAULT 0,
  
  -- Receipt and tracking
  receipt_number TEXT UNIQUE,
  receipt_url TEXT,
  receipt_generated_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on payment_transactions
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for payment_transactions
CREATE POLICY "Anyone can view their vehicle payments" ON public.payment_transactions
  FOR SELECT USING (true); -- Public access for vehicle owners to check payments

CREATE POLICY "Finance and admin can manage payments" ON public.payment_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'finance')
    )
  );

-- Create receipt generation sequence
CREATE SEQUENCE IF NOT EXISTS receipt_number_seq START 1000;

-- Function to generate receipt number
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN 'RECT-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD(nextval('receipt_number_seq')::TEXT, 6, '0');
END;
$function$;

-- Trigger to auto-generate receipt number and update timestamp
CREATE OR REPLACE FUNCTION public.handle_payment_receipt()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Generate receipt number when payment is completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    NEW.receipt_number = public.generate_receipt_number();
    NEW.receipt_generated_at = now();
  END IF;
  
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE TRIGGER payment_receipt_trigger
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_payment_receipt();

-- Update updated_at trigger
CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Admin can create users policy
CREATE POLICY "Admin can create profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles creator
      WHERE creator.id = auth.uid() 
      AND creator.role = 'admin'
    )
  );

-- Admin can update any profile
CREATE POLICY "Admin can update any profile" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );