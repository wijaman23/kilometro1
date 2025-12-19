//Achievement.js
const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    athleteName: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", achievementSchema);
