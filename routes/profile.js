const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const Profile = require("../models/Profile");

// @route   POST api/profile
// @desc    Create or Update user Profile
// @access  Private

router.post(
  "/",
  auth,
  [check("skills", "skills is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      const { website, bio, githubusername, skills } = req.body;
      console.log(req.body);
      const profileFields = {};
      profileFields.user = req.user.id;
      if (website) profileFields.website = website;
      if (bio) profileFields.bio = bio;
      if (githubusername) profileFields.githubusername = githubusername;
      if (skills) {
        profileFields.skills = skills.split(",").map((skill) => skill.trim());
      }
      try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
          //  If Profile exists, then update profile
          console.log(profile);
          profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          );
          return res.json(profile);
        }
        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json({ profile });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server Error" });
      }
    } else {
      return res.status(400).json({ msg: "Server Error" });
    }
  }
);

router.delete("/", auth, async (req, res) => {
  try {
    // Remove user profile
    await Profile.findOneAndDelete({ user: req.user.id });
    // Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    return res.json({ msg: "User Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name"]);
    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
