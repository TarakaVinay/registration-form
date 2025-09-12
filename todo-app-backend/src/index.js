import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import registrationRoutes from "./routes/registrationRoutes.js";
import { addRegistration, editRegistration } from "./controllers/registrationcontroller.js";
import { upload } from "./middleWares/upload.js";

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ API Routes
app.use("/registration", registrationRoutes);

// ✅ Global error handler for file upload errors
app.use((err, req, res, next) => {
    if (err) {
        console.error("❌ Middleware Error:", err.message);
        return res.status(400).json({ error: err.message });
    }
    next();
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
