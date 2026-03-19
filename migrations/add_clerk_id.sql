-- Migration: Add clerk_user_id to track data ownership

-- 1. clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255) AFTER email;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS ga_property_id VARCHAR(255) AFTER website_url;

-- 2. uptime_logs
ALTER TABLE uptime_logs ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255) AFTER client_id;

-- 3. performance_metrics
ALTER TABLE performance_metrics ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255) AFTER client_id;

-- 4. activity_logs
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255) AFTER user_email;

-- 5. modification_requests
ALTER TABLE modification_requests ADD COLUMN IF NOT EXISTS clerk_user_id VARCHAR(255) AFTER user_email;
