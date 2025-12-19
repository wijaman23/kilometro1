// middlewares/uploadAchievementImage.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "kilometro1/logros",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto" },
    ],
  },
});

module.exports = multer({ storage });
