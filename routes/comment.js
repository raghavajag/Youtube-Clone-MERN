const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

router.post("/", async (req, res) => {
  const comment = new Comment(req.body);
  if (!comment) {
    return res
      .status(400)
      .json({ success: false, err: "Error While Saving Comment" });
  }
  await comment.save();
  Comment.find({ _id: comment.id })
    .populate("writer", "-password")
    .exec((err, doc) => {
      if (err) {
        return res.status(200).json(err);
      }
      return res.status(200).json({ success: true, doc });
    });
});

router.get("/:postId", (req, res) => {
  Comment.find({ postId: req.params.postId })
    .populate("writer", "-password")
    .exec((err, doc) => {
      if (err) {
        return res.status(400).json(err);
      }
      return res.status(200).json({ success: true, comment: doc });
    });
});
module.exports = router;
