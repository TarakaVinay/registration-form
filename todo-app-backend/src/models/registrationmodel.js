import pool from "../config/db.js";

// ✅ Get all registrations
export const getRegistrations = async () => {
  const result = await pool.query("SELECT * FROM registration ORDER BY id ASC");
  return result.rows;
};

// ✅ Get registration by ID
export const getRegistrationById = async (id) => {
  const result = await pool.query("SELECT * FROM registration WHERE id = $1", [id]);
  return result.rows[0];
};

// ✅ Get registration by hall_ticket
export const getRegistrationByHallTicket = async (hall_ticket) => {
  const result = await pool.query(
    "SELECT * FROM registration WHERE hall_ticket = $1",
    [hall_ticket]
  );
  return result.rows[0];
};

// ✅ Create registration (JSONB insert)
export const createRegistration = async (
  first_name,
  last_name,
  hall_ticket,
  sem1_marks,
  sem2_marks
) => {
  const result = await pool.query(
    `INSERT INTO registration 
      (first_name, last_name, hall_ticket, sem1_marks, sem2_marks)
     VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)
     RETURNING *`,
    [
      first_name,
      last_name,
      hall_ticket,
      JSON.stringify(sem1_marks), // store as JSONB
      JSON.stringify(sem2_marks),
    ]
  );
  return result.rows[0];
};

// ✅ Update registration (JSONB update)
export const updateRegistration = async (
  id,
  first_name,
  last_name,
  hall_ticket,
  sem1_marks,
  sem2_marks
) => {
  const result = await pool.query(
    `UPDATE registration SET
       first_name = $1,
       last_name = $2,
       hall_ticket = $3,
       sem1_marks = $4::jsonb,
       sem2_marks = $5::jsonb
     WHERE id = $6
     RETURNING *`,
    [
      first_name,
      last_name,
      hall_ticket,
      JSON.stringify(sem1_marks),
      JSON.stringify(sem2_marks),
      id,
    ]
  );
  return result.rows[0];
};

// ✅ Delete registration
export const removeRegistration = async (id) => {
  const result = await pool.query(
    "DELETE FROM registration WHERE id=$1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
