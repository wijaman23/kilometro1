const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    athleteName: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", AchievementSchema);
