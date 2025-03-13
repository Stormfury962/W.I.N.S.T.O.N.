CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- Auto-incrementing ID
    username VARCHAR(255) UNIQUE NOT NULL, -- Unique username
    email VARCHAR(255) UNIQUE NOT NULL, -- Unique email
    password_hash TEXT NOT NULL, -- Hashed password
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for account creation
    last_login TIMESTAMP, -- Track last login time
    failed_attempts INT DEFAULT 0, -- Track failed login attempts
    locked_until TIMESTAMP, -- Account lockout time
    is_admin BOOLEAN DEFAULT FALSE -- Admin flag
);