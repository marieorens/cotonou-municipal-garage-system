-- Ensure auth trigger exists to create profiles on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Attach updated_at triggers
DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS vehicles_set_updated_at ON public.vehicles;
CREATE TRIGGER vehicles_set_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS owners_set_updated_at ON public.owners;
CREATE TRIGGER owners_set_updated_at
BEFORE UPDATE ON public.owners
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS procedures_set_updated_at ON public.procedures;
CREATE TRIGGER procedures_set_updated_at
BEFORE UPDATE ON public.procedures
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS payments_set_updated_at ON public.payments;
CREATE TRIGGER payments_set_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS settings_set_updated_at ON public.settings;
CREATE TRIGGER settings_set_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();