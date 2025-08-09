-- Enable RLS
ALTER DATABASE postgres SET row_security = on;

-- Create users profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'agent', 'finance')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create owners table
CREATE TABLE public.owners (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  id_number TEXT NOT NULL UNIQUE,
  id_type TEXT NOT NULL CHECK (id_type IN ('cni', 'passport', 'driver_license')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  license_plate TEXT NOT NULL UNIQUE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  color TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('car', 'motorcycle', 'truck', 'other')),
  status TEXT NOT NULL CHECK (status IN ('impounded', 'claimed', 'sold', 'destroyed', 'pending_destruction')) DEFAULT 'impounded',
  impound_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  location TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  qr_code TEXT,
  owner_id UUID REFERENCES public.owners(id),
  estimated_value DECIMAL(15,2) NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create procedures table
CREATE TABLE public.procedures (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('release', 'sale', 'destruction')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  fees_calculated DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.owners(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money')),
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reference TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_id UUID NOT NULL REFERENCES public.procedures(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('impound_notice', 'deadline_warning', 'payment_reminder')),
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email')),
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')) DEFAULT 'pending'
);

-- Create settings table
CREATE TABLE public.settings (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- RLS Policies for owners (all authenticated users can access)
CREATE POLICY "Authenticated users can view owners" ON public.owners FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin and agents can insert owners" ON public.owners FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'agent'))
);
CREATE POLICY "Admin and agents can update owners" ON public.owners FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'agent'))
);

-- RLS Policies for vehicles (all authenticated users can access)
CREATE POLICY "Authenticated users can view vehicles" ON public.vehicles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin and agents can insert vehicles" ON public.vehicles FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'agent'))
);
CREATE POLICY "Admin and agents can update vehicles" ON public.vehicles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'agent'))
);

-- RLS Policies for procedures
CREATE POLICY "Authenticated users can view procedures" ON public.procedures FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin and agents can insert procedures" ON public.procedures FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'agent'))
);
CREATE POLICY "Admin and agents can update procedures" ON public.procedures FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'agent'))
);

-- RLS Policies for payments
CREATE POLICY "Authenticated users can view payments" ON public.payments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin and finance can insert payments" ON public.payments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'finance'))
);

-- RLS Policies for documents
CREATE POLICY "Authenticated users can view documents" ON public.documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin and agents can insert documents" ON public.documents FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'agent'))
);

-- RLS Policies for notifications
CREATE POLICY "Authenticated users can view notifications" ON public.notifications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin and agents can insert notifications" ON public.notifications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'agent'))
);

-- RLS Policies for settings
CREATE POLICY "Authenticated users can view settings" ON public.settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage settings" ON public.settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_owners_updated_at BEFORE UPDATE ON public.owners FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_procedures_updated_at BEFORE UPDATE ON public.procedures FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial user profiles
INSERT INTO public.profiles (user_id, name, email, role) VALUES
('00000000-0000-0000-0000-000000000001', 'Administrateur', 'admin@mairie-cotonou.bj', 'admin'),
('00000000-0000-0000-0000-000000000002', 'Agent Municipal', 'agent@mairie-cotonou.bj', 'agent'),  
('00000000-0000-0000-0000-000000000003', 'Responsable Finance', 'finance@mairie-cotonou.bj', 'finance');

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
('fees', '{"daily_storage": 5000, "release_fee": 25000, "administrative_fee": 10000, "towing_fee": 15000}', 'Structure des frais'),
('legal_deadlines', '{"notice_period": 7, "destruction_deadline": 30}', 'Délais légaux'),
('notification_templates', '{"impound_sms": "Votre véhicule a été mis en fourrière", "impound_email": "Notification de mise en fourrière", "deadline_sms": "Délai expirant bientôt", "deadline_email": "Rappel délai"}', 'Modèles de notifications');