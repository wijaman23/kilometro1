// models/Comment.js
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    news: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    isDisabled: {
      type: Boolean,
      default: false, // 👈 admin puede desactivar
    },

    editedAt: {
      type: Date,
    },

    deletedAt: {
      type: Date, // 👈 si el usuario borra → queda rastro
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
