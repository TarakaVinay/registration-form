import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Multer Storage Config
const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, path.join(__dirname, "../uploads"));
     },
     filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
     },
});

// ✅ File Filter (allow only pdf/doc/docx)
const fileFilter = (req, file, cb) => {
     const allowed = [".pdf", ".doc", ".docx"];
     const ext = path.extname(file.originalname).toLowerCase();
     if (!allowed.includes(ext)) {
          return cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
     }
     cb(null, true);
};

export const upload = multer({ storage, fileFilter });
