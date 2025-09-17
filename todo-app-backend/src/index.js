import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import registrationRoutes from "./routes/registrationRoutes.js";

dotenv.config();

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Parse incoming JSON + URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve uploaded files (static)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
// This will correctly work with sem1_marks & sem2_marks 
// because we already updated controllers/models to store JSONB
app.use("/registration", registrationRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Middleware Error:", err.message);
  return res.status(400).json({ error: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
