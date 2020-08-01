const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Profile = require("../models/Profile");

// Image Upload
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const crypto = require("crypto");
const config = require("config");
const mongoURI = config.get("mongoURI");
const path = require("path");

const conn = mongoose.createConnection(
  mongoURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => console.log(`Grid-Storage For Image Done.`)
);

let gfs;
conn.once("open", function () {
  // Init Stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
});
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "images",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage }).single("image");

router.get("/user", auth, async (req, res) => {
  let profile = await Profile.findOne({ user: req.user.id });
  if (!profile) {
    return res.status(200).json({ success: false, msg: "No Profile Found" });
  }
  return res.status(200).json({ success: true, profile: profile });
});
// @route   /image
// @desc    Upload ProfileImage
// @access  Private
router.post("/image", auth, async (req, res) => {
  const id = req.user.id;
  const user = await User.findOne({ _id: id });
  if (
    user.profileImage ===
    "https://floating-springs-68584.herokuapp.com/api/profile/image/profile.png"
  ) {
    console.log("Image Upadted");
  } else {
    const profileImage = user.profileImage.toString();
    console.log(profileImage);
    gfs.remove({ filename: profileImage, root: "images" }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
      console.log("file removed");
    });
  }
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ success: false });
    }
    console.log(`Uploaded FileName ${res.req.file.filename}`);
    const profileImage = res.req.file.filename;
    const profile = await User.findOneAndUpdate(
      { _id: req.user.id },
      { profileImage: profileImage },
      { new: true }
    ).select("-password");
    return res.json({ profileImage: profile.profileImage });
  });
});
// @route   Get /image/:profileImage
// @desc    Display Profile Image
// @access  Public
router.get("/image/:profileImage", (req, res) => {
  gfs.files.findOne({ filename: req.params.profileImage }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

// @route   POST/
// @desc    Create or Update user Profile
// @access  Private
router.post(
  "/",
  auth,

  async (req, res) => {
    let user = await User.findOne({ _id: req.user.id });
    if (user) {
      const {
        website,
        bio,
        fieldofintrest,
        description,
        location,
        instagram,
        twitter,
        facebook,
        linkedin,
        githubusername,
      } = req.body;
      console.log(
        website,
        bio,
        fieldofintrest,
        description,
        location,
        instagram,
        twitter,
        facebook,
        linkedin,
        githubusername
      );
      const profileFields = {};
      profileFields.user = req.user.id;
      if (website) profileFields.website = website;
      if (bio) profileFields.bio = bio;
      if (location) profileFields.location = location;
      if (fieldofintrest) profileFields.fieldofintrest = fieldofintrest;
      if (description) profileFields.description = description;

      // Build Social Object
      profileFields.social = {};
      if (twitter) profileFields.twitter = twitter;
      if (facebook) profileFields.facebook = facebook;
      if (linkedin) profileFields.linkedin = linkedin;
      if (instagram) profileFields.instagram = instagram;
      if (githubusername) profileFields.githubusername = githubusername;
      try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
          profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          );
          //  If Profile exists, then update profile
          console.log(profile);
          return res.json(profile);
        }
        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json({ success: true, profile: profile });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server Error" });
      }
    } else {
      return res.status(400).json({ msg: "Server Error" });
    }
  }
);

// @route   Delete /
// @desc    Delete Profile && User
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    // Remove user profile
    await Profile.findOneAndDelete({ user: req.user.id });
    // Remove User
    // await User.findOneAndRemove({ _id: req.user.id });
    return res.json({ msg: "Profile Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

// @route  GET /
// @desc   Get User Profiles
// @access Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["handle"]);
    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
});
router.get("/image/all", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(400).json({ err: "No Files Exits" });
    }
    return res.json(files);
  });
});
router.delete("/del/all", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ err: "No Files Exists" });
    } else {
      files.map((file) => {
        gfs.remove({ _id: file._id, root: "images" }, (err, gridStore) => {
          if (err) {
            return res.status(404).json({ err: err });
          } else {
            return true;
          }
        });
      });
    }
  });
});

module.exports = router;
