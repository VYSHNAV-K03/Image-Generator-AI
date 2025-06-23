const express = require("express");
const User = require("../models/userModel");
const { authMiddleware } = require("../middleware/authMiddleware");
const Generated = require("../models/Generated");
const upload = require("../config/multerConfig");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { userId, prompt, article } = req.body;
    const imagePath = req.file.path;

    const newEntry = new Generated({
      userId,
      prompt,
      article,
      image: imagePath, // Save path only
    });

    await newEntry.save();
    res.status(200).json({ message: "Uploaded successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

router.get("/all-uploads", async (req, res) => {
  try {
    const allPosts = await Generated.find()
      .populate("userId")
      .sort({ createdAt: -1 }); // Latest first
    res.json(allPosts);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
});

// DELETE /api/user/delete-upload/:id
router.delete("/delete-upload/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Generated.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const imagePath = path.join("uploads", post.image);

    // Delete the image file
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete the post document
    await Generated.findByIdAndDelete(id);

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
