-- Migration: Add email verification fields to usuarios table
-- Date: 2025-10-27
-- Description: Adds is_verified, verification_token, and token_expiry fields for email verification

ALTER TABLE usuarios
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE AFTER activo,
ADD COLUMN verification_token VARCHAR(255) DEFAULT NULL AFTER is_verified,
ADD COLUMN token_expiry DATETIME DEFAULT NULL AFTER verification_token;

-- Optional: Add index on verification_token for faster lookups
CREATE INDEX idx_verification_token ON usuarios(verification_token);

-- Set existing users as verified (optional, depends on your requirements)
-- UPDATE usuarios SET is_verified = TRUE WHERE created_at < NOW();
