import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
    getAllRegistrations,
    getRegistration,
    addRegistration,
    editRegistration,
    removeRegistrationController,
} from "../controllers/registrationcontroller.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF or Word documents are allowed"), false);
    }
};

export const upload = multer({ storage, fileFilter });

router.get("/", getAllRegistrations);
router.get("/:id", getRegistration);
router.post("/", upload.single("resume"), addRegistration);
router.put("/:id", upload.single("resume"), editRegistration);
router.delete("/:id", removeRegistrationController);

export default router;
