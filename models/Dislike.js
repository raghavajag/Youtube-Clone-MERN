const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DislikeSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: "comment",
  },
  videoId: {
    type: Schema.Types.ObjectId,
    ref: "video",
  },
});

module.exports = Dislike = mongoose.model("dislike", DislikeSchema);
