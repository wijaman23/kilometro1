const multer = require("multer");

// Guardamos en memoria para subir a Cloudinary directamente
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

module.exports = upload;