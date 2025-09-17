DROP TABLE IF EXISTS registration;

CREATE TABLE registration (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  hall_ticket VARCHAR(50) NOT NULL UNIQUE,
  sem1 JSONB,
  sem2 JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
