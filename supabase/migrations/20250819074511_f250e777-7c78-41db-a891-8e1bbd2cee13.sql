-- Insert default test users into profiles table
-- These UUIDs should be used when creating the auth users

INSERT INTO public.profiles (id, email, name, role, is_active, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@test.com', 'Administrateur Test', 'admin', true, now(), now()),
  ('00000000-0000-0000-0000-000000000002', 'agent@test.com', 'Agent de Saisie Test', 'agent', true, now(), now()),
  ('00000000-0000-0000-0000-000000000003', 'finance@test.com', 'Responsable Financier Test', 'finance', true, now(), now())
ON CONFLICT (id) DO NOTHING;