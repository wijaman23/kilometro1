const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  embedUrl: { type: String, required: true },
  publishDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Video", VideoSchema);
