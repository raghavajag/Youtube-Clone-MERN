const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Notifications = require("../models/Notifications");

// @route  GET api/auth
// #desc   Give User Profile
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    let UserData = {};
    const user = await User.findById(req.user.id).select("-password");
    const notification = await Notifications.find({
      receipient: req.user.id,
    });
    UserData.credentials = user;
    UserData.notifications = notification;
    res.json(UserData);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Server Error");
  }
});

// @route   POST api/auth
// @desc    Login User
// @access  Public

router.post(
  "/",
  [
    check("email", "Please enter a valid email"),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Creadentials" }] });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Creadentials" }] });
      }
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "1d" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);
module.exports = router;
