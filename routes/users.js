const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route   POST api/users
// @desc    Regiter User
// @access  Public

router.post(
  "/",
  [
    check("handle", "Handle is required").not().isEmpty(),
    check("email", "Please enter a valid email"),
    check(
      "password",
      "Please enter a password with 6 or more character"
    ).isLength(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { handle, email, password } = req.body;
    try {
      let user = await User.findOne({
        $or: [{ email: email }, { handle: handle }],
      });
      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }
      user = new User({
        handle,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
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
      res.status(500).send("Serve Error");
    }
  }
);

module.exports = router;
