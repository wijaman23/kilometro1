const multer = require("multer");

// Usamos memoria para subir directo a Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB
  },
});

module.exports = upload;