import React, { useState } from "react";
import Dropzone from "react-dropzone";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { lightBlue, lightGreen } from "@material-ui/core/colors";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { connect } from "react-redux";
import { useEffect } from "react";
import { Typography } from "@material-ui/core";
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
    },
    videoUpload: {
      display: "flex",
      width: "150px",
      height: "150px",
      border: "1px solid gray",
      color: "black",
      alignItems: "center",
      justifyContent: "center",
      "&:focus": {
        backgroundColor: lightGreen[100],
      },
      "&:hover": {
        backgroundColor: lightBlue[50],
        color: "#000",
        cursor: "pointer",
      },
    },
    select: {
      border: "none",
      padding: "0.5em",
      "&:focus": {
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: "8px",
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
      margin: "auto",
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
  }));
  const classes = useStyles();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const { title, description } = formData;
  const [privacy, setPrivacy] = useState(0);
  const [catagories, setCatagories] = useState("Web Developement");
  const [duration, setDuration] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [videoName, setVideoName] = useState(null);
  const [loaded, setLoaded] = useState(false);
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
  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);
    axios.post("/api/video/uploadfiles", formData, config).then((res) => {
      console.log(res);
      if (res.data.success) {
        setVideoName(res.data.cloud.fileName);
        let variable = {
          filePath: res.data.local.localFilePath,
          fileName: res.data.local.localFileName,
        };

        // Generate thumbnail with this local filepath
        axios.post("/api/video/thumbnail", variable).then((res) => {
          if (res.data.success) {
            setDuration(res.data.fileDuration);
            setThumbnail(res.data.thumbsFilePath);
            console.log(res.data.thumbsFilePath);
            setLoaded(true);
          } else {
            alert("FAILED TO UPLOAD THUMBNAIL");
          }
        });
      } else {
        alert("failed to upload file");
      }
    });
  };
  useEffect(() => {
    let mounted = true;
    if (mounted && videoName !== null) {
      setLoaded(true);
    }
  }, [videoName]);
  const onSubmit = (e) => {
    e.preventDefault();
    if (loaded) {
      console.log(formData);
      console.log(catagories);
      console.log(privacy);
      console.log(videoName);
      console.log(thumbnail);
    } else {
      return alert("Please Select a video");
    }
    const variable = {
      writer: _id,
      title: title,
      description: description,
      privacy: privacy,
      filePath: videoName,
      catagory: catagories,
      duration: duration,
      thumbnail: thumbnail,
    };
    console.log(variable);
    axios.post("/api/video/uploadVideo", variable).then((res) => {
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
        <div style={{ margin: "auto" }}>
          <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div className={classes.videoUpload} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <AddIcon />
                  <p>Drag n Drop Video</p>
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
          color="primary"
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
                width="400"
                controls
                src={`http://localhost:5000/api/video/video/${videoName}`}
              ></video>
            </div>
          )}
          {thumbnail && thumbnail !== "" && (
            <div className={classes.thumbnail}>
              <Typography variant="h5">Thumbnail ~</Typography>
              <img
                style={{
                  objectFit: "cover",
                  width: "100%",
                }}
                src={`http://localhost:5000/${thumbnail}`}
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
