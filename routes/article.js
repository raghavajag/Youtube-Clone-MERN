const express = require("express");
const router = express.Router();
const Article = require("../models/Articles");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const { title, description, markdown } = req.body;
  let article = new Article({
    user: req.user.id,
    title,
    description,
    markdown,
  });
  try {
    article = await article.save();
    return res.json(article);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const article = await Article.find().populate("user", ["name"]);
    res.json(article);
  } catch (error) {
    console.log(error.message);
    return res.json({ msg: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const article = await Article.findOne({ _id }).populate("user", ["name"]);
    if (article) {
      res.json(article);
    } else {
      return res.status(400).json({ msg: "Article Not Found" });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({ msg: "Server Error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    await Article.findOneAndDelete({ _id });
    res.json({ msg: "Article Deleted" });
  } catch (error) {
    console.log(error.message);
    return res.json({ msg: "Server Error" });
  }
});
module.exports = router;
