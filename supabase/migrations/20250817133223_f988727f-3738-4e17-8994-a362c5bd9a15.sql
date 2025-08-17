-- Fix security warnings by setting proper search_path for functions
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN 'RECT-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD(nextval('receipt_number_seq')::TEXT, 6, '0');
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_payment_receipt()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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