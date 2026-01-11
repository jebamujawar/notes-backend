const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  color: { type: String, default: "#ffffff" },
}, { timestamps: true }); // automatically adds createdAt and updatedAt

module.exports = mongoose.model("Note", NoteSchema);
