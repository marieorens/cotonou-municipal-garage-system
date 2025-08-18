-- Create test accounts for admin, agent, and finance roles
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES 
  (
    'aaaaaaaa-bbbb-cccc-dddd-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'admin@cotonou.bj',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
  ),
  (
    'aaaaaaaa-bbbb-cccc-dddd-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'agent@cotonou.bj',
    crypt('Agent123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
  ),
  (
    'aaaaaaaa-bbbb-cccc-dddd-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'finance@cotonou.bj',
    crypt('Finance123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    false,
    'authenticated'
  );

-- Create corresponding profiles
INSERT INTO public.profiles (id, name, email, role, is_active, created_by) VALUES
  ('aaaaaaaa-bbbb-cccc-dddd-111111111111', 'Administrateur Principal', 'admin@cotonou.bj', 'admin', true, 'aaaaaaaa-bbbb-cccc-dddd-111111111111'),
  ('aaaaaaaa-bbbb-cccc-dddd-222222222222', 'Agent de Saisie', 'agent@cotonou.bj', 'agent', true, 'aaaaaaaa-bbbb-cccc-dddd-111111111111'),
  ('aaaaaaaa-bbbb-cccc-dddd-333333333333', 'Responsable Financier', 'finance@cotonou.bj', 'finance', true, 'aaaaaaaa-bbbb-cccc-dddd-111111111111');

-- Add sample owners
INSERT INTO public.owners (id, first_name, last_name, phone, email, address, id_number, id_type) VALUES
  (gen_random_uuid(), 'Jean', 'Dupont', '+229 97 12 34 56', 'jean.dupont@email.com', 'Quartier Akpakpa, Rue 123', 'CNI123456789', 'cni'),
  (gen_random_uuid(), 'Marie', 'Koffi', '+229 96 98 76 54', 'marie.koffi@email.com', 'Quartier Cadjehoun, Avenue de la Paix', 'CNI987654321', 'cni'),
  (gen_random_uuid(), 'Paul', 'Ayité', '+229 95 44 33 22', 'paul.ayite@email.com', 'Quartier Fidjrossè, Boulevard Saint-Michel', 'CNI555444333', 'cni');

-- Add sample vehicles with owners
WITH owners_data AS (
  SELECT id, first_name, last_name FROM public.owners ORDER BY created_at LIMIT 3
)
INSERT INTO public.vehicles (
  license_plate, make, model, color, year, type, status, impound_date, location, estimated_value, description, owner_id
) 
SELECT 
  plate,
  make,
  model,
  color,
  year,
  'car',
  'impounded',
  impound_date,
  location,
  value,
  description,
  owner_id
FROM (
  SELECT 
    'AA-123-BC' as plate,
    'Toyota' as make,
    'Corolla' as model,
    'Blanc' as color,
    2018 as year,
    (now() - interval '7 days') as impound_date,
    'Zone A - Emplacement 15' as location,
    2500000 as value,
    'Véhicule stationné en zone interdite' as description,
    (SELECT id FROM owners_data ORDER BY first_name LIMIT 1) as owner_id
  UNION ALL
  SELECT 
    'BB-456-DE',
    'Honda',
    'Civic',
    'Rouge',
    2020,
    (now() - interval '12 days'),
    'Zone B - Emplacement 8',
    3200000,
    'Stationnement gênant sur voie publique',
    (SELECT id FROM owners_data ORDER BY first_name OFFSET 1 LIMIT 1)
  UNION ALL
  SELECT 
    'CC-789-FG',
    'Nissan',
    'Almera',
    'Noir',
    2019,
    (now() - interval '5 days'),
    'Zone C - Emplacement 22',
    2800000,
    'Véhicule abandonné sur la voie publique',
    (SELECT id FROM owners_data ORDER BY first_name OFFSET 2 LIMIT 1)
) vehicle_data;