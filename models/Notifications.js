const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  receipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("notification", NotificationSchema);
