const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");


// GET COMMENTS
router.get("/", async (req, res) => {

  try {

    const comments = await Comment.find()
      .sort({ createdAt: -1 });

    res.json(comments);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to load comments"
    });

  }

});


// ADD COMMENT
router.post("/", async (req, res) => {

  try {

    const { name, message, rating } = req.body;

    // Validation
    if (!name || !message) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    const newComment = new Comment({
      name,
      message,
      rating
    });

    const savedComment =
      await newComment.save();

    res.status(201).json(savedComment);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to add comment"
    });

  }

});

module.exports = router;