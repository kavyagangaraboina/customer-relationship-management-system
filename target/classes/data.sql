-- Initial Seed Data for Demo & Testing

-- Password for admin: admin123 (Valid BCrypt hash)
INSERT INTO users (username, email, password, full_name, role, created_at)
VALUES ('admin', 'admin@crm.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'System Admin', 'ROLE_ADMIN', CURRENT_TIMESTAMP);

-- Sample Customers
INSERT INTO customers (name, email, phone, company, address, requirements, created_at, updated_at)
VALUES 
('Sarah Jenkins', 'sarah.j@acme.com', '+1 (555) 234-5678', 'Acme Corp', '742 Evergreen Terrace, Springfield', 'Needs enterprise CRM integration with custom reporting and multi-user access controls.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Michael Scott', 'michael@dundermifflin.com', '+1 (555) 839-2001', 'Dunder Mifflin', '1725 Slough Avenue, Scranton, PA', 'Bulk paper supply management system and custom customer communication tracker.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Elena Rostova', 'elena@techpulse.io', '+1 (555) 912-3456', 'TechPulse Solutions', '100 Silicon Way, San Jose, CA', 'Requires API webhook integrations for real-time lead capture from marketing campaigns.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sample Interactions
INSERT INTO interactions (customer_id, type, interaction_date, notes, created_at)
VALUES 
(1, 'MEETING', CURRENT_TIMESTAMP, 'Initial discovery call with Sarah. Discussed enterprise requirements, user seat licenses, and timeline for deployment.', CURRENT_TIMESTAMP),
(1, 'EMAIL', CURRENT_TIMESTAMP, 'Sent formal project proposal, pricing breakdown, and architecture overview diagram.', CURRENT_TIMESTAMP),
(2, 'CALL', CURRENT_TIMESTAMP, 'Discussed custom pricing discount structure for annual subscriptions.', CURRENT_TIMESTAMP),
(3, 'NOTE', CURRENT_TIMESTAMP, 'Lead referred by TechPulse CTO. Scheduled follow-up demonstration for next Tuesday.', CURRENT_TIMESTAMP);
