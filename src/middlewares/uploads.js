//src/middlewares/uploads.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../services/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "study-hub/resources",
    resource_type: "raw",

    public_id: (req, file) => {
      const name = file.originalname.replace(/\.[^/.]+$/, "");
      return `${Date.now()}-${name}.pdf`;
    },
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf"||file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

module.exports = upload;
