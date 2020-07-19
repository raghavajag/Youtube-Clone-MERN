import React, { useEffect } from "react";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
function DetailVideoPage() {
  //   useEffect(() => {
  //     axios.get("/api/video");
  //   });
  const matches = useMediaQuery("(max-width:1100px)");

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
      gridRow: "1/5",
      maxHeight: "400px",
      background: "orange",
    },
    recomVideo: {
      gridRow: "auto",
      gridColumn: matches ? "1/4" : null,
      background: "yellow",
    },
    comment: {
      gridColumn: matches ? "1/4" : "1/3",
      gridRow: "auto",
      background: "green",
    },
  }));
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.mainVideo}>
        <video
          controls
          style={{ width: "100%" }}
          // src={`http://localhost:5000/api/video/video/1595159188535_despShort.mp4`}
        ></video>
      </div>
      <div className={classes.recomVideo}>Recommended Video</div>
      <div className={classes.comment}>COmments on Video</div>
    </div>
  );
}

export default DetailVideoPage;
