import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { lightBlue, blue } from "@material-ui/core/colors";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { connect } from "react-redux";
import { Typography } from "@material-ui/core";
import { LinearProgress } from "@material-ui/core";
import { useSelector } from "react-redux";

function UpdateVideo({ match, history }) {
  const userId = useSelector((state) => state.user.credentials._id);
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
        color: blue[500],
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: theme.palette.primary.main,
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "lightgray",
        },
        "&:hover fieldset": {
          borderColor: "lightgray",
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.primary.main,
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
      marginLeft: "0.5em",
    },
    mainVideo: {
      width: "100%",
    },
    mediaContainer: {
      display: "flex",
      flexDirection: mediaMatch ? "row" : "column",
      width: "100%",
    },
    button: {
      fontSize: "1.1em",
      width: "100%",
      marginTop: "1em",
      "&:hover": {
        background: lightBlue,
      },
    },
    drop: {
      display: "flex",
      margin: "1em auto",
      // flexDirection: "row",
    },
    progress: {
      position: "absolute",
    },
    thumbnail: {
      margin: "auto",
      width: "100%",
      padding: matches ? "1em" : "none",
    },
    video: {
      margin: mediaMatch ? null : "auto",
      width: "100%",
      padding: matches ? "1em" : "none",
    },
  }));
  const classes = useStyles();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const videoName = match.params.videoName;
  const { title, description } = formData;
  const [privacy, setPrivacy] = useState(0);
  const [catagory, setCatagories] = useState("Web Developement");
  const [thumbName, setThumbName] = useState(null);
  const [oldThumb, setOldThumb] = useState(null);
  const [droppedImage, setDroppedImage] = useState(false);
  useEffect(() => {
    axios.get(`/api/video/data/${videoName}`).then((res) => {
      console.log(res.data);
      setFormData({
        ...formData,
        title: res.data.title,
        description: res.data.description,
      });
      setCatagories(res.data.catagory);
      setPrivacy(res.data.privacy);
      setOldThumb(res.data.thumbName);
    });
  }, [videoName]);
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
  const onDropImage = (files) => {
    if (files[0].type !== "image/jpeg" && files[0].type !== "image/png") {
      return alert("Please select a png or jpeg file");
    }
    setDroppedImage(true);
    console.log("Its a Image");
    let formData = new FormData();
    formData.append("image", files[0]);
    axios.post("/api/video/thumb", formData).then((res) => {
      setThumbName(res.data.name);
      setDroppedImage(false);
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!thumbName) {
      return alert("Please Select a Thumbnail");
    }
    console.log(formData);
    console.log(catagory);
    console.log(privacy);
    const videoData = {
      ...formData,
      privacy,
      catagory,
      thumbName,
      writer: userId,
      oldThumb,
    };
    console.log(videoData);
    axios.post("/api/video/upload", videoData).then((res) => {
      if (res.data.success) {
        console.log(res.data);
        alert("Video Updated Successfully");
        axios.delete(`/api/video/thumb/${oldThumb}`).then((res) => {
          console.log(res.data);
        });
        return history.push("/");
      } else {
        console.log(res.data);
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
        <TextField
          required
          onChange={(e) => onChange(e)}
          name="title"
          value={title}
          className={classes.textField}
          id="outlined-basic"
          label="Title"
          variant="outlined"
        />
        <TextField
          required
          onChange={(e) => onChange(e)}
          name="description"
          value={description}
          multiline
          rows="4"
          className={classes.textField}
          id="outlined-basic"
          label="Description"
          variant="outlined"
        />
        <div className={classes.drop}>
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
                  {droppedImage && (
                    <LinearProgress
                      size={30}
                      color="secondary"
                      style={{
                        width: "77px",
                        marginTop: "6px",
                        marginLeft: "1em",
                      }}
                      className={classes.progress}
                    />
                  )}
                </div>
              </section>
            )}
          </Dropzone>
          <select
            style={{ marginLeft: matches ? "1em" : "none" }}
            className={classes.select}
            onChange={(e) => handleChangePrivacy(e)}
          >
            {Private.map((item, index) => (
              <option key={index} value={item.label}>
                {item.label}
              </option>
            ))}
          </select>
          <select
            style={{ marginLeft: !matches ? "1em" : "none" }}
            className={classes.select}
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
          color="primary"
          type="submit"
          variant="contained"
          fullWidth
        >
          Submit
        </Button>
        <div className={classes.mediaContainer}>
          {/* {videoName && videoName !== "" && (
            <div className={classes.video}>
              <Typography variant="h5">Preview Video</Typography>

              <video
                className={classes.mainVideo}
                width="400"
                controls
                src={`https://floating-springs-68584.herokuapp.com/api/video/video/${videoName}`}
              ></video>
            </div>
          )} */}
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

export default UpdateVideo;
