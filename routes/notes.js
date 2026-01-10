const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL NOTES
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user })
      .sort({ pinned: -1, createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD NOTE
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, color } = req.body;

    if (!title || !content) {
      return res.status(400).json({ msg: "Title and content required" });
    }

    const note = new Note({
      user: req.user,
      title,
      content,
      color
    });

    await note.save();
    res.status(201).json(note);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE NOTE
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ msg: "Note not found" });
    }

    res.json(updatedNote);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE NOTE
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });

    if (!deleted) {
      return res.status(404).json({ msg: "Note not found" });
    }

    res.json({ msg: "Note deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
