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
const ffmpeg = require("fluent-ffmpeg");
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
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage }).single("file");
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
    }
    cb(null, true);
  },
});

const localUpload = multer({ storage: localStorage }).single("file");

// @route   POST: /uploadfiles
// @desc    Upload Videos
// @access  Private
router.post("/uploadfiles", auth, (req, res) => {
  let localFilePath = "";
  let localFileName = "";
  let fileName = "";
  localUpload(req, res, (err) => {
    console.log("uploading locally");
    if (err) {
      return res.json({ success: false, err, upload: "local" });
    }
    localFilePath = res.req.file.path;
    localFileName = res.req.file.filename;
    console.log("file upload locallly SUCCESS");
  });
  upload(req, res, (err) => {
    console.log("uploadin video to cloud");
    if (err) {
      return res.json({ success: false, err, upload: "cloud" });
    }
    fileName = res.req.file.filename;
    res.json({
      local: { localFileName, localFilePath },
      cloud: { fileName },
      success: true,
    });
  });
});

// @route   POST :/thumbnail
// @desc    Create Thumbnail
// @access  Private
router.post("/thumbnail", auth, (req, res) => {
  console.log("creating thumbnail");
  let thumbsFilePath = "";
  let fileDuration = "";
  const filePath = `/${req.body.filePath}`;
  filePath.toString();
  console.log(filePath);
  ffmpeg.ffprobe(filePath, function (err, metadata) {
    if (err) {
      console.log(err);
    }
    fileDuration = metadata.format.duration;
  });

  ffmpeg(filePath)
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
      thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      console.log("Screenshots taken");
      // const targetPath = path.join(__dirname, thumbsFilePath);
      fs.unlinkSync(filePath);
      return res.json({
        success: true,
        thumbsFilePath: thumbsFilePath,
      });
    })
    .screenshots({
      count: 1,
      folder: "uploads/thumbnails",
      size: "320x240",
      // %b input basename ( filename w/o extension )
      filename: "thumbnail-%b.png",
    });
});

// @route   POST: /uploadVideo
// @desc    Upload Info with video & thumbnail details
// @access  Private
router.post("/uploadVideo", auth, async (req, res) => {
  const {
    writer,
    title,
    description,
    privacy,
    filePath,
    catagory,
    duration,
    thumbnail,
  } = req.body;
  const video = new Video({
    writer,
    title,
    description,
    privacy,
    filePath,
    catagory,
    duration,
    thumbnail,
  });
  await video.save((err, video) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ success: false, err });
    }
    return res.status(200).json({
      success: true,
      data: video,
    });
  });
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
router.delete("/:videoname", (req, res) => {
  const filename = req.params.videoname;
  gfs.remove({ filename: filename, root: "uploads" }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
  });
  Video.findOneAndRemove({ filePath: filename }, (err, file) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    if (!file) {
      return res.json({ msg: "No FIles Found" });
    }
    fs.unlinkSync(file.thumbnail);
    return res.json(file);
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
