const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET all notes for user
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user }).sort({ pinned: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ msg: "Server error fetching notes" });
  }
});

// CREATE note
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, color, pinned } = req.body;
    const note = new Note({ user: req.user, title, content, color, pinned: pinned || false });
    await note.save();
    res.json(note);
  } catch (error) {
    console.error("Add note error:", error);
    res.status(500).json({ msg: "Server error adding note" });
  }
});

// UPDATE note
router.put("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user }, req.body, { new: true });
    res.json(note);
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ msg: "Server error updating note" });
  }
});

// DELETE note
router.delete("/:id", auth, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.user });
    res.json({ msg: "Note deleted" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ msg: "Server error deleting note" });
  }
});

module.exports = router;
