import pool from "../config/db.js";

const createRegistrationTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registration (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone VARCHAR(20),
        email TEXT,
        resume_name TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Registration table created (if not exists)");
  } catch (error) {
    console.error("❌ Error creating registration table:", error);
  }
};

export default createRegistrationTable;
