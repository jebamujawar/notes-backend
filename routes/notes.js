const express = require("express");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// CREATE NOTE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, color } = req.body;
    if (!title || !content) return res.status(400).json({ msg: "Title and content required" });

    const note = new Note({ userId: req.user, title, content, color });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// GET NOTES (with optional search)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { userId: req.user };

    if (search) query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } }
    ];

    const notes = await Note.find(query).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// UPDATE NOTE
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, color } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { title, content, color, updatedAt: Date.now() },
      { new: true }
    );
    if (!note) return res.status(404).json({ msg: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// DELETE NOTE
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!note) return res.status(404).json({ msg: "Note not found" });
    res.json({ msg: "Note deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
