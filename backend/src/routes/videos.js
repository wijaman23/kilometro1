const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  getVideos,
  createVideo,
  deleteVideo,
  updateVideo,
} = require("../controllers/videoController");

router.get("/", auth(), getVideos);
router.post("/", auth(["admin"]), createVideo);
router.delete("/:id", auth(["admin"]), deleteVideo);
router.put("/:id", auth(["admin"]), updateVideo);

module.exports = router;
