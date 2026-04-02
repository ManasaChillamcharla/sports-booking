-- Sample data for testing
-- Insert admin user (password: admin123)
INSERT INTO users (full_name, email, password, phone, role, enabled, created_at) VALUES
('Admin User', 'admin@example.com', '$2a$10$examplehashedpassword', '1234567890', 'ADMIN', true, NOW());

-- Insert sample grounds
INSERT INTO grounds (name, sport_type, location, description, price_per_hour, image_url, available) VALUES
('Cricket Ground A', 'CRICKET', 'Downtown', 'Well-maintained cricket ground', 50.00, 'https://example.com/cricket.jpg', true),
('Football Field B', 'FOOTBALL', 'Uptown', 'Spacious football field', 40.00, 'https://example.com/football.jpg', true);