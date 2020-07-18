const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const Posts = require("../models/Posts");
const Notifications = require("../models/Notifications");

// @route   POST api/posts
// @desc    Create a Post
// @access  Private
router.post(
  "/",
  [auth, [check("text", "Text is Required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Posts({
        text: req.body.text,
        name: user.name,
        user: req.user.id,
      });
      await newPost.save();
      return res.json(newPost);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route   GET api/posts
// @desc    Get all Posts
// @access  Private
router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/:id
// @desc    Get a post by id
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const posts = await Posts.findById(req.params.id);
    if (!posts) {
      return res.status(404).json({ msg: "No Post Found" });
    }
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Post Found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/posts/:id
// @desc    Delete a Posts
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const posts = await Posts.findById(req.params.id);
    if (!posts) {
      return res.status(404).json({ msg: "Post Not Found" });
    }
    await posts.deleteOne();
    res.json({ msg: "Post Removed" });
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Post Found" });
    }
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route  Put api/posts/like/:id
// @desc   Like a Post
// @access Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    // let receipient;
    // let postId;
    const post = await Posts.findById(req.params.id);

    // Check if post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post Already Liked" });
    }
    post.likes.unshift({ user: req.user.id });
    // Remove Notifications
    const notification = new Notifications({
      postId: post.id,
      read: false,
      receipient: post.user,
      sender: req.user.id,
      type: "like",
    });
    await notification.save();
    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
  }
});

// @route   Put api/posts/unlike/:id
// @desc    UnLike a Post
// @access  Private
router.post("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    // Remove Notifications
    const notification = Notifications.findOne({
      postId: post.id,
      sender: req.user.id,
      type: "like",
    });
    await notification.deleteOne();
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Posts.findById(req.params.id);

      if (!post) {
        return res.status(400).json({ msg: "Post Not Found" });
      } else {
        if (
          post.comments.find(
            (comment) =>
              comment.user.toString() === req.user.id.toString() &&
              comment.text === req.body.text
          )
        ) {
          return res
            .status(400)
            .json({ msg: "Cannot Comment Same Stuff...Please Avoid Spamming" });
        } else {
          const newComment = {
            text: req.body.text,
            name: user.name,
            user: req.user.id,
          };
          post.comments.unshift(newComment);
          await post.save();
          let commentId;
          post.comments.forEach((comment) => {
            if (
              comment.text === req.body.text &&
              comment.user.toString() === req.user.id.toString()
            ) {
              commentId = comment._id;
            }
          });
          // Add Notifications
          let notification = new Notifications({
            postId: post.id,
            read: false,
            receipient: post.user,
            sender: req.user.id,
            type: "comment",
            commentId,
          });

          await notification.save();
          res.json(post.comments);
        }
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Delete api/posts/comment/:id/:comment_id
// @desc    Delete a Comment
// @access  Private
router.delete("/comments/:id/:commentId", auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    // Pull Out Comments
    const comment = post.comments.find(
      (comment) => comment.id === req.params.commentId
    );
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exists" });
    }
    // Check User
    if (comment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "User not Authorized" });
    }
    // Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);

    // Remove Notifications
    const notification = Notifications.findOne({
      postId: post.id,
      sender: req.user.id,
      type: "comment",
      commentId: req.params.commentId,
    });
    await notification.deleteOne();
    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
