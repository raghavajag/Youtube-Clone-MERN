import React, { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Avatar,
  useMediaQuery,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { deepOrange } from "@material-ui/core/colors";

// Components
import Description from "./Description";
import SideBar from "../VideoSideBar/SideBar";
function DetailVideoPage({ match }) {
  dayjs.extend(relativeTime);
  const [videoDetail, setVideoDetail] = useState(null);
  const [recomVideo, setRecomVideo] = useState(null);
  const id = match.params.videoId;
  const videoVariable = {
    videoId: id,
  };
  useEffect(() => {
    axios.post("/api/video/data", videoVariable).then((res) => {
      setVideoDetail(res.data);
      const catagory = res.data.catagory;
      const variable = {
        catagory,
      };
      axios.post("/api/video/catagory", variable).then((res) => {
        setRecomVideo(res.data);
      });
    });
  }, []);
  console.log(videoDetail);
  console.log(recomVideo);
  const matches = useMediaQuery("(max-width:1300px)");
  const matchMedia = useMediaQuery("(min-width:750px)");

  const useStyles = makeStyles((theme) => ({
    wrapper: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr 1fr",
      gridAutoRows: "minmax(100px, auto)",
      gridGap: "1em",
      justifyItems: "stretch",
      alignItems: "stretch",
    },
    mainVideo: {
      gridColumn: matches ? "1/4" : "1/3",
      gridRow: matches ? "1" : "auto",
      margin: matchMedia ? "2em" : "none",
    },
    recomVideo: {
      gridRow: matches ? "auto" : "1/4",
      gridColumn: matches ? "1/4" : null,
      margin: matchMedia ? "2em" : "none",
      width: "100%",
    },
    comment: {
      gridColumn: matches ? "1/4" : "1/3",
      gridRow: matches ? "auto" : "2",
      background: "green",
      margin: matchMedia ? "2em" : "none",
    },
    innerVideo: {
      width: "100%",
      maxHeight: matches ? "auto" : "400px",
    },
    avatar: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    subscribe: {
      background: "#F0F0F0",
      display: "flex",
      justifyContent: "space-between",
    },
  }));
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      {videoDetail === null || recomVideo === null ? (
        <div className={classes.mainVideo}>
          <CircularProgress
            style={{ margin: "auto", display: "inherit" }}
            size={120}
            thickness={2}
            color="secondary"
          />
        </div>
      ) : (
        <>
          <div className={classes.mainVideo}>
            <video
              controls
              className={classes.innerVideo}
              src={`http://localhost:5000/api/video/video/${videoDetail.filePath}`}
            ></video>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>{videoDetail.title}</span>
              <hr />
            </div>
            <div display="flex">
              {" "}
              <span> {videoDetail.views} views</span>
              <span style={{ marginLeft: "0.5em" }}>
                ~{dayjs(videoDetail.createdAt).from(dayjs(), true)} ago
              </span>
              <div className={classes.subscribe}>
                <Avatar className={classes.avatar}>
                  {videoDetail.writer.handle[0].toUpperCase()}
                </Avatar>
                <Button color="secondary">Subscribe</Button>
              </div>
              <Description description={videoDetail.description} />
            </div>
          </div>
          <div className={classes.recomVideo}>
            <SideBar videos={recomVideo} />
          </div>
        </>
      )}

      <div className={classes.comment}>COmments on Video</div>
    </div>
  );
}

export default DetailVideoPage;
