const express = require("express");
const router = express.Router();
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const fs = require("fs");
const Video = require("../models/Videos");
const auth = require("../middleware/auth");
const config = require("config");
const mongoURI = config.get("mongoURI");

const conn = mongoose.createConnection(
  mongoURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => console.log(`MongoDb Grid Connected`)
);
let gfs;
let filename = "";
conn.once("open", function () {
  // Init Stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});
// Init Cloud Stroage
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const videoName = `video-${
          buf.toString("hex") + path.extname(file.originalname)
        }`;
        const fileInfo = {
          filename: videoName,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const imageStorage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const thumbName = `thumbnail-${
          buf.toString("hex") + path.extname(file.originalname)
        }`;
        const fileInfo = {
          filename: thumbName,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const uploadVideo = multer({ storage }).single("file");
const uploadThumb = multer({ storage: imageStorage }).single("image");

// @route   POST: /uploadfiles
// @desc    Upload Videos
// @access  Private
router.post("/video", (req, res) => {
  uploadVideo(req, res, (err) => {
    if (err) {
      return res.json({
        success: false,
        err,
        upload: "video",
      });
    } else {
      console.log(`Video Name ${res.req.file.filename}`);
      return res.status(200).json({ name: res.req.file.filename });
    }
  });
});

// @route   POST :/thumbnail
// @desc    Upload Thumbnail
// @access  Private
router.post("/thumb", (req, res) => {
  uploadThumb(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err, upload: "thumbnail" });
    } else {
      console.log(`Thumbnail Name ${res.req.file.filename}`);
      return res.status(200).json({ name: res.req.file.filename });
    }
  });
});

// @route   POST: /upload
// @desc    Upload Info with video & thumbnail details
// @access  Private
router.post("/upload", auth, async (req, res) => {
  const {
    writer,
    title,
    description,
    privacy,
    videoName,
    catagory,
    thumbName,
  } = req.body;
  const video = new Video({
    writer,
    title,
    description,
    privacy,
    videoName,
    catagory,
    thumbName,
  });
  const videoInfo = {};
  if (writer) videoInfo.writer = writer;
  if (title) videoInfo.title = title;
  if (description) videoInfo.description = description;
  if (privacy) videoInfo.privacy = privacy;
  if (videoName) videoInfo.videoName = videoName;
  if (catagory) videoInfo.catagory = catagory;
  if (thumbName) videoInfo.thumbName = thumbName;

  try {
    let video = await Video.findOne({ videoName });
    if (video) {
      // Update
      video = await Video.findOneAndUpdate(
        { videoName },
        { $set: videoInfo },
        { new: true }
      );
      return res.json(video);
    }
    // Create
    video = new Video(videoInfo);
    await video.save();
    res.json({ video });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   /GET
// @desc    Get Video Info
// @access  Public

router.get("/", async (req, res) => {
  const video = await Video.find().populate("writer", "handle");
  if (!video.length) {
    return res.json({ success: false, msg: "No Video Found" });
  }
  return res.status(200).json(video);
});

// @route   Delete /:videoname
// @desc    Delete a Video with Video Info and thumbnail
// @access  Private
// TODO: Make route Private
router.delete("/:videoname", auth, (req, res) => {
  const filename = req.params.videoname;

  Video.findOneAndRemove(
    { $and: [{ filePath: filename }, { writer: req.user.id }] },
    (err, file) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      if (!file) {
        return res.json({ msg: "Unauthorised or file not" });
      }
      gfs.remove({ filename: filename, root: "uploads" }, (err, gridStore) => {
        if (err) {
          return res.status(404).json({ err: err });
        }
      });
      if (fs.existsSync(file.thumbnail)) {
        fs.unlinkSync(file.thumbnail);
      }

      return res.json({ success: true });
    }
  );
});

// Return an individual file only if it is an image
router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0)
      return res.status(404).json({ err: "No file exists" });
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({ err: "Not an image" });
    }
  });
});

// @route  GET /video/:videoname
// @desc   Stream Video
router.get("/video/:videoname", (req, res) => {
  gfs.files.findOne({ filename: req.params.videoname }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file Exists",
      });
    }
    // Check if Mp4
    if (file.contentType === "video/mp4") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not A Video",
      });
    }
  });
});
// @route  GET /files
// @desc   Database Files
router.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ err: "No Files Exists" });
    }
    return res.json(files);
  });
});

// @route  GET /data/:videoname
// @desc   Get Video Data
router.post("/data", async (req, res) => {
  const video = await Video.findOneAndUpdate(
    { _id: req.body.videoId },
    { $inc: { views: 1 } }
  ).populate("writer", "handle");
  if (!video) {
    return res.status(400).json({ msg: "Video Not Found" });
  }
  return res.status(200).json(video);
});

router.post("/catagory", async (req, res) => {
  const catagory = req.body.catagory;
  const video = await Video.find({ catagory }).populate("writer", "handle");
  if (!video.length) {
    return res.json({ success: false, msg: "No Videos Found" });
  }
  return res.status(200).json(video);
});
// @route <DELETE> /files/:id
// @desc  Delete File
router.delete("/del/all", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ err: "No Files Exists" });
    } else {
      files.map((file) => {
        gfs.remove({ _id: file._id, root: "uploads" }, (err, gridStore) => {
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
