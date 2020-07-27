const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  },
  responseTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("comment", CommentSchema);
