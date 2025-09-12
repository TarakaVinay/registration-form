import pool from "../config/db.js";
import {
  getRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistration,
  removeRegistration,
} from "../models/registrationmodel.js";

const handleRegistrationResponse = (res, status, message, data = null) => {
  res.status(status).json({ message, data });
};

// Get all registrations
export const getAllRegistrations = async (req, res, next) => {
  try {
    const registrations = await getRegistrations();
    handleRegistrationResponse(res, 200, "Fetched successfully", registrations);
  } catch (err) {
    next(err);
  }
};

// Get single registration
export const getRegistration = async (req, res, next) => {
  try {
    const registration = await getRegistrationById(req.params.id);
    if (!registration) return handleRegistrationResponse(res, 404, "Not found");
    handleRegistrationResponse(res, 200, "Fetched successfully", registration);
  } catch (err) {
    next(err);
  }
};

// Add registration
export const addRegistration = async (req, res) => {
  try {
    const { first_name, last_name, phone, email } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const resume_name = req.file.filename; // ✅ this is the uploaded file's name

    const registration = await createRegistration(
      first_name,
      last_name,
      phone,
      email,
      resume_name
    );

    res.json({
      message: "Registration created successfully",
      data: registration,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update registration
export const editRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, email } = req.body;
    const resume_name = req.file ? req.file.filename : undefined;

    const updated = await updateRegistration(id, first_name, last_name, phone, email, resume_name);
    if (!updated) return handleRegistrationResponse(res, 404, "Not found");
    handleRegistrationResponse(res, 200, "Updated successfully", updated);
  } catch (err) {
    next(err);
  }
};

// Delete registration
export const removeRegistrationController = async (req, res, next) => {
  try {
    const deleted = await removeRegistration(req.params.id);
    if (!deleted) return handleRegistrationResponse(res, 404, "Not found");
    handleRegistrationResponse(res, 200, "Deleted successfully", deleted);
  } catch (err) {
    next(err);
  }
};
