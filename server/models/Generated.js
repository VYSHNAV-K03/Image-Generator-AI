const mongoose = require("mongoose");

// Schema
const GeneratedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prompt: String,
  image: String,
  article: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Generated = mongoose.model("Generated", GeneratedSchema);

module.exports = Generated;
