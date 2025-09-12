import pool from "../config/db.js";

export const getRegistrations = async () => {
  const result = await pool.query("SELECT * FROM registration ORDER BY id ASC");
  return result.rows;
};

export const getRegistrationById = async (id) => {
  const result = await pool.query("SELECT * FROM registration WHERE id=$1", [id]);
  return result.rows[0];
};

export const createRegistration = async (first_name, last_name, phone, email, resume_name) => {
  const result = await pool.query(
    "INSERT INTO registration (first_name, last_name, phone, email, resume_name) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [first_name, last_name, phone, email, resume_name]
  );
  return result.rows[0];
};

export const updateRegistration = async (id, first_name, last_name, phone, email, resume_name) => {
  const result = await pool.query(
    `UPDATE registration
     SET first_name=$1, last_name=$2, phone=$3, email=$4 ${resume_name ? ', resume_name=$5' : ''}
     WHERE id=$6
     RETURNING *`,
    resume_name ? [first_name, last_name, phone, email, resume_name, id] : [first_name, last_name, phone, email, id]
  );
  return result.rows[0];
};

export const removeRegistration = async (id) => {
  const result = await pool.query("DELETE FROM registration WHERE id=$1 RETURNING *", [id]);
  return result.rows[0];
};
