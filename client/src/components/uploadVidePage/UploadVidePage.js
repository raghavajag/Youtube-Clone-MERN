import React, { useState } from "react";
import Dropzone from "react-dropzone";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { lightBlue, lightGreen, red } from "@material-ui/core/colors";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { connect } from "react-redux";
import { useEffect } from "react";
import { Typography, CircularProgress } from "@material-ui/core";
function UploadVidePage({
  user: {
    credentials: { _id },
  },
  history,
}) {
  const matches = useMediaQuery("(min-width:800px)");
  const mediaMatch = useMediaQuery("(min-width:1300px)");

  const useStyles = makeStyles((theme) => ({
    paper: {
      margin: "auto",
      width: matches ? "60%" : "100%",
      padding: "1em",
      display: "flex",
      flexDirection: "column",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      padding: "1em",
      "& label.Mui-focused": {
        color: red[500],
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: theme.palette.secondary.main,
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "lightgray",
        },
        "&:hover fieldset": {
          borderColor: "lightgray",
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.secondary.main,
        },
      },
    },

    select: {
      border: "none",
      padding: "0.5em",
      "&:focus": {
        outlineWidth: "0",
      },
      "&:hover": {
        backgroundColor: "rgb(244, 244, 244)",
      },
    },
    thumbnail: {
      margin: "auto",
    },
    video: {
      margin: mediaMatch ? null : "auto",
      width: mediaMatch ? "50%" : null,
    },
    mainVideo: {
      width: "100%",
    },
    mediaContainer: {
      display: "flex",
      flexDirection: mediaMatch ? "row" : "column",
    },
    button: {
      fontSize: "1.1em",
      width: "100%",
      marginTop: "1em",
      "&:hover": {
        background: lightBlue[50],
      },
    },
    drop: {
      display: "flex",
      marginBottom: "1em",
    },
  }));
  const classes = useStyles();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const { title, description } = formData;
  const [privacy, setPrivacy] = useState(0);
  const [catagories, setCatagories] = useState("Web Developement");
  const [videoName, setVideoName] = useState(null);
  const [thumbName, setThumbName] = useState(null);
  const [dropped, setDropped] = useState(false);
  const [droppedImage, setDroppedImage] = useState(false);

  const Private = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" },
  ];
  const Catagory = [
    { value: 0, label: "Game Design" },
    { value: 1, label: "Web Developement" },
    { value: 2, label: "Music" },
  ];
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onDropVideo = (files) => {
    console.log(files);
    if (files[0].type !== "video/mp4") {
      return alert("Please select a mp4 format video");
    }
    setDropped(true);
    let formData = new FormData();
    console.log("Its Video");
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);
    axios.post("api/video/video", formData, config).then((res) => {
      setVideoName(res.data.name);
      setDropped(false);
    });
  };
  const onDropImage = (files) => {
    if (files[0].type !== "image/jpeg") {
      return alert("Please select a png or jpeg file");
    }
    setDroppedImage(true);
    console.log("Its a Image");
    let formData = new FormData();
    formData.append("image", files[0]);
    axios.post("api/video/thumb", formData).then((res) => {
      setThumbName(res.data.name);
      setDroppedImage(false);
    });
  };
  useEffect(() => {
    console.log(videoName);
    console.log(thumbName);
  }, [videoName, thumbName]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!videoName || !thumbName) {
      return alert("Please Select Video or Thumbnail");
    }
    console.log(formData);
    console.log(catagories);
    console.log(privacy);
    const videoData = {
      ...formData,
      privacy,
      catagories,
      videoName,
      thumbName,
    };
    console.log(videoData);
    axios.post("/api/video/upload", videoData).then((res) => {
      if (res.data.success) {
        alert("video Uploaded Successfully");
        history.push("/");
      } else {
        alert("Failed to upload video");
      }
    });
  };
  const handleChangePrivacy = (e) => {
    const priv = Private.filter(
      (priv) => priv.label === e.currentTarget.value
    )[0];
    setPrivacy(priv.value);
  };
  const handleChangeCatagory = (e) => {
    setCatagories(e.currentTarget.value);
  };
  return (
    <Paper className={classes.paper}>
      <form
        onSubmit={(e) => onSubmit(e)}
        className={classes.form}
        id="video-form"
      >
        <div className={classes.drop}>
          <Dropzone onDrop={(acceptedFiles) => onDropVideo(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div className={classes.videoUpload} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Button
                    style={{ marginRight: "1em", width: "100%" }}
                    size="small"
                    color="primary"
                    variant="contained"
                  >
                    Video
                  </Button>
                </div>
              </section>
            )}
          </Dropzone>
          <Dropzone onDrop={(acceptedFiles) => onDropImage(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div className={classes.videoUpload} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Button
                    style={{ marginLeft: "1em" }}
                    size="small"
                    color="primary"
                    variant="contained"
                  >
                    Thumbnail
                  </Button>
                </div>
              </section>
            )}
          </Dropzone>
        </div>

        <TextField
          required
          onChange={(e) => onChange(e)}
          name="title"
          className={classes.textField}
          id="outlined-basic"
          label="Title"
          variant="outlined"
        />
        <TextField
          required
          onChange={(e) => onChange(e)}
          name="description"
          multiline
          rows="4"
          className={classes.textField}
          id="outlined-basic"
          label="Description"
          variant="outlined"
        />
        <div style={{ marginTop: " 1em", display: "flex" }}>
          <select
            className={classes.select}
            name=""
            id=""
            onChange={(e) => handleChangePrivacy(e)}
          >
            {Private.map((item, index) => (
              <option key={index} value={item.label}>
                {item.label}
              </option>
            ))}
          </select>
          <select
            style={{ marginLeft: "1em" }}
            className={classes.select}
            name=""
            id=""
            onChange={(e) => handleChangeCatagory(e)}
          >
            {Catagory.map((item, index) => (
              <option key={index} value={item.label}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <Button
          className={classes.button}
          color="secondary"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <div className={classes.mediaContainer}>
          {videoName && videoName !== "" && (
            <div className={classes.video}>
              <Typography variant="h5">Preview Video</Typography>

              <video
                className={classes.mainVideo}
                width="400"
                controls
                src={`https://floating-springs-68584.herokuapp.com/api/video/video/${videoName}`}
              ></video>
            </div>
          )}
          {thumbName && thumbName !== "" && (
            <div className={classes.thumbnail}>
              <Typography variant="h5">Thumbnail ~</Typography>
              <img
                style={{
                  objectFit: "cover",
                  width: "100%",
                }}
                src={`https://floating-springs-68584.herokuapp.com/api/video/image/${thumbName}`}
                alt="haha"
              />
            </div>
          )}
        </div>
      </form>
    </Paper>
  );
}
const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps, {})(UploadVidePage);
