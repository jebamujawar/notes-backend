const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/authMiddlewre");
const router = express.Router();

// CREATE NOTE
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, color } = req.body;
    const note = new Note({ user: req.user, title, content, color });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET NOTES (with optional search)
router.get("/", auth, async (req, res) => {
  try {
    const search = req.query.search || "";
    const notes = await Note.find({
      user: req.user,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ]
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// UPDATE NOTE
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content, color } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title, content, color },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE NOTE
router.delete("/:id", auth, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.user });
    res.json({ msg: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
