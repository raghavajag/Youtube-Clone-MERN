import React, { useEffect } from "react";
import axios from "axios";

// MUI
import { makeStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// components
import VideoCard from "./Card";
import { useState } from "react";
const useStyles = makeStyles({});

function LandingPage({ history }) {
  const [videos, setVideo] = useState(null);
  useEffect(() => {
    axios.get("api/video").then((res) => {
      if (res.data.length) {
        setVideo(res.data);
      }
    });
  }, []);
  console.log(videos);
  const classes = useStyles();

  return videos !== null && videos.length ? (
    videos.map((video) => (
      <VideoCard
        key={video._id}
        title={video.title}
        writer={video.writer.handle}
        views={video.views}
        createdAt={video.createdAt}
        catagory={video.catagory}
        description={video.description}
        duration={video.duration}
        videoPath={video.filePath}
        thumbnail={video.thumbnail}
        id={video._id}
      />
    ))
  ) : videos && !videos.length ? (
    <span>No Videos</span>
  ) : null;
}

export default LandingPage;
