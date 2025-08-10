-- Create trigger to auto-create profiles on new auth users
create trigger if not exists on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Optional: update updated_at automatically on tables that have the column
-- Attach handle_updated_at() trigger to key tables if not already present
-- profiles
create or replace trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.handle_updated_at();

-- vehicles
create or replace trigger vehicles_set_updated_at
before update on public.vehicles
for each row execute function public.handle_updated_at();

-- owners
create or replace trigger owners_set_updated_at
before update on public.owners
for each row execute function public.handle_updated_at();

-- procedures
create or replace trigger procedures_set_updated_at
before update on public.procedures
for each row execute function public.handle_updated_at();

-- payments
create or replace trigger payments_set_updated_at
before update on public.payments
for each row execute function public.handle_updated_at();

-- settings
create or replace trigger settings_set_updated_at
before update on public.settings
for each row execute function public.handle_updated_at();