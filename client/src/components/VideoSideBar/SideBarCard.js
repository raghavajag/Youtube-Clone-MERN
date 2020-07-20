import React from "react";
import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core";
import { Link } from "react-router-dom";
function SideBarCard({ title, user, catagory, thumbnail, id }) {
  const matches = useMediaQuery("(max-width:1300px)");
  const useStyles = makeStyles((theme) => ({
    cardContent: {
      display: "flex",
      width: "50%",
    },
    main: {
      width: matches ? "auto" : "100%",
      display: "flex",
      marginBottom: "2em",
      height: matches ? "200px" : "auto",
      justifyContent: matches ? "space-between" : "none",
    },
    media: {
      width: matches ? "auto" : "60%",
    },
  }));
  const classes = useStyles();
  return (
    <Card className={classes.main}>
      <div className={classes.cardContent}>
        <CardContent style={{ display: "flex", flexDirection: "column" }}>
          <span>{title}</span>
          <Typography
            style={{ textDecoration: "none", color: "rgba(0, 0, 255, 0.6)" }}
            component={Link}
            to={`user/${user}`}
          >
            {user}
          </Typography>
          <span style={{ marginTop: "2em" }}>{catagory}</span>
        </CardContent>
      </div>
      <div className={classes.media}>
        <a href={`/video/${id}`}>
          <img
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            src={`http://localhost:5000/${thumbnail}`}
            alt="something"
          />
        </a>
      </div>
    </Card>
  );
}

export default SideBarCard;
