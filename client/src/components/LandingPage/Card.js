import React, { useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// MUI
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  media: {
    width: "100%",
    objectFit: "cover",
  },
  root: {
    width: "100%",
    marginBottom: "2em",
  },
}));

function VideoCard({
  title,
  writer,
  views,
  createdAt,
  catagory,
  duration,
  thumbnail,
  id,
}) {
  const classes = useStyles();
  const theme = useTheme();
  dayjs.extend(relativeTime);
  const date = dayjs(createdAt).from(dayjs(), true);
  return (
    <Card className={classes.root}>
      <a href={`/video/${id}`}>
        <img
          className={classes.media}
          src={`http://localhost:5000/${thumbnail}`}
          alt="something"
        />
      </a>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>{title}</span>
            <hr />
            <Typography
              color="secondary"
              style={{ textDecoration: "none" }}
              component={Link}
              to={`user/${writer}`}
            >
              {writer}
            </Typography>
          </div>
          <div style={{ display: "flex" }}>
            <Typography variant="caption" color="textSecondary">
              {views} views
            </Typography>
            <Typography
              style={{ marginLeft: "0.5em" }}
              variant="caption"
              color="textSecondary"
            >
              ~{date} ago
            </Typography>
          </div>
          <div>
            <Typography variant="caption" color="textSecondary">
              Length: {parseFloat(duration).toFixed(1)} sec
            </Typography>
          </div>
          <span style={{ marginTop: "0.5em" }}>{catagory}</span>
        </CardContent>
      </div>
    </Card>
  );
}

export default VideoCard;
