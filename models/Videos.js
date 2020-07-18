const mongoose = require("mongoose");
const VideoSchema = new mongoose.Schema(
  {
    write: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    privacy: {
      // 1 for public 0 for private
      type: Number,
    },
    filePath: {
      type: String,
    },
    catagory: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = Video = mongoose.model("video", VideoSchema);
