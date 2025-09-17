import express from "express";
import {
    getAllRegistrations,
    getRegistrationByIdController,
    addRegistration,
    editRegistration,
    deleteRegistration,
    getRegistrationByHallticketController, // new
} from "../controllers/registrationcontroller.js";

const router = express.Router();

// ✅ Get all students
router.get("/", getAllRegistrations);

  // ✅ Get student by hall ticket (for fetching marks)
router.get("/hallticket/:hall_ticket", getRegistrationByHallticketController);

// ✅ Get single student by ID
router.get("/:id", getRegistrationByIdController);

// ✅ Add new student
router.post("/", addRegistration);

// ✅ Update student
router.put("/:id", editRegistration);

// ✅ Delete student
router.delete("/:id", deleteRegistration);

export default router;
