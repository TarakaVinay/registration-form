import {
  getRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistration,
  removeRegistration,
  getRegistrationByHallTicket,
} from "../models/registrationmodel.js";

const parseIntSafe = (value) =>
  value !== undefined && value !== "" ? parseInt(value) : null;

// ✅ Get all registrations
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await getRegistrations();
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
};

// ✅ Get registration by ID
export const getRegistrationByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await getRegistrationById(id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.status(200).json(registration);
  } catch (error) {
    console.error("Error fetching registration:", error);
    res.status(500).json({ message: "Failed to fetch registration" });
  }
};

// ✅ Get registration by hall_ticket (for marks memo)
export const getRegistrationByHallticketController = async (req, res) => {
  try {
    const { hall_ticket } = req.params;
    const registration = await getRegistrationByHallTicket(hall_ticket);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.status(200).json(registration);
  } catch (error) {
    console.error("Error fetching registration by hall_ticket:", error);
    res.status(500).json({ message: "Failed to fetch registration" });
  }
};

// ✅ Add new registration (Fix payload parsing)
export const addRegistration = async (req, res) => {
  try {
    const { first_name, last_name, hall_ticket, sem1, sem2 } = req.body;

    console.log("📩 Received Registration Data:", req.body);

    // Read values safely from sem1 & sem2 object
    const sem1_marks = {
      m1: parseIntSafe(sem1?.M1),
      english: parseIntSafe(sem1?.English),
      chemistry: parseIntSafe(sem1?.Chemistry),
      bee: parseIntSafe(sem1?.BEE),
    };

    const sem2_marks = {
      m2: parseIntSafe(sem2?.M2),
      physics: parseIntSafe(sem2?.Physics),
      eg: parseIntSafe(sem2?.EG),
      cpp: parseIntSafe(sem2?.Cpp),
    };

    const newReg = await createRegistration(
      first_name,
      last_name,
      hall_ticket,
      sem1_marks,
      sem2_marks
    );

    res
      .status(201)
      .json({ message: "Registration created successfully", data: newReg });
  } catch (error) {
    console.error("Error creating registration:", error);
    res.status(500).json({ message: "Failed to create registration" });
  }
};

// ✅ Update registration (Fix payload parsing)
export const editRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, hall_ticket, sem1, sem2 } = req.body;

    const sem1_marks = {
      m1: parseIntSafe(sem1?.M1),
      english: parseIntSafe(sem1?.English),
      chemistry: parseIntSafe(sem1?.Chemistry),
      bee: parseIntSafe(sem1?.BEE),
    };

    const sem2_marks = {
      m2: parseIntSafe(sem2?.M2),
      physics: parseIntSafe(sem2?.Physics),
      eg: parseIntSafe(sem2?.EG),
      cpp: parseIntSafe(sem2?.Cpp),
    };

    const updated = await updateRegistration(
      id,
      first_name,
      last_name,
      hall_ticket,
      sem1_marks,
      sem2_marks
    );

    res
      .status(200)
      .json({ message: "Registration updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating registration:", error);
    res.status(500).json({ message: "Failed to update registration" });
  }
};

// ✅ Delete registration
export const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await removeRegistration(id);
    res.status(200).json({ message: "Registration deleted", data: deleted });
  } catch (error) {
    console.error("Error deleting registration:", error);
    res.status(500).json({ message: "Failed to delete registration" });
  }
};
