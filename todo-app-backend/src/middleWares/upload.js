// import multer from "multer";

// // Use memory storage to keep file in memory (so we can save to DB)
// const storage = multer.memoryStorage();
// export const upload = multer({ storage });
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, path.join(process.cwd(), "uploads"));
     },
     filename: (req, file, cb) => {
          cb(null, Date.now() + "-" + file.originalname);
     },
});

export const upload = multer({ storage });

