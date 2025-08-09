-- Remove the invalid inserts first, we'll handle initial users through auth
DELETE FROM public.profiles WHERE user_id LIKE '00000000-0000-0000-0000-%';

-- Let's fix this by creating a better approach for initial users
-- We'll create them after authentication is properly set up

-- For now, just create the settings
TRUNCATE public.settings;
INSERT INTO public.settings (key, value, description) VALUES
('fees', '{"daily_storage": 5000, "release_fee": 25000, "administrative_fee": 10000, "towing_fee": 15000}', 'Structure des frais'),
('legal_deadlines', '{"notice_period": 7, "destruction_deadline": 30}', 'Délais légaux'),
('notification_templates', '{"impound_sms": "Votre véhicule a été mis en fourrière", "impound_email": "Notification de mise en fourrière", "deadline_sms": "Délai expirant bientôt", "deadline_email": "Rappel délai"}', 'Modèles de notifications');