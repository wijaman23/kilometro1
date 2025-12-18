//models/Race.js
const mongoose = require("mongoose");

const DistanceSchema = new mongoose.Schema({
  label: {
    type: String,
    enum: ["5K", "10K", "21K", "42K", "OTROS"],
    required: true,
  },
  km: {
    type: Number,
    required: true,
  },
});

const RaceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    date: {
      type: Date,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    image: {
      type: String, // URL externa
    },

    distances: [DistanceSchema],

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Race", RaceSchema);
