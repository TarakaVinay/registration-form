CREATE TABLE registration (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    resume_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);
