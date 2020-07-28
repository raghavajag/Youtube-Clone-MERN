import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

import axios from "axios";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";
import { useSelector } from "react-redux";
import { Typography } from "@material-ui/core";
function Comments({
  id,
  refreshFunction,
  commentList,
  history,
  commentLength,
}) {
  const user = useSelector((state) => state.user.credentials._id);
  const userImage = useSelector((state) => state.user.credentials.profileImage);
  const authenticated = useSelector((state) => state.user.authenticated);
  const [comment, setComment] = useState("");
  const useStyles = makeStyles(() => ({
    form: { display: "flex", flexDirection: "row" },
  }));
  const classes = useStyles();
  const onSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() === "") {
      return alert("Must be something...");
    }
    if (!authenticated) {
      return history.push("/login");
    }
    const variable = {
      content: comment,
      writer: user,
      postId: id,
    };
    axios.post("/api/comment", variable).then((res) => {
      if (res.data.success) {
        console.log(res.data);
        refreshFunction(res.data.doc);
      } else {
        console.log("Comment Error");
      }
    });
    setComment("");
  };
  const onChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div>
      <br />
      <Typography component="h6">{commentLength} Comments</Typography>
      <form className={classes.form} onSubmit={(e) => onSubmit(e)}>
        <Avatar src={`http://localhost:5000/api/profile/image/${userImage}`} />
        <TextField
          name="comment"
          fullWidth
          onChange={(e) => onChange(e)}
          value={comment}
        />
        <div>
          <Button
            className={classes.button}
            size="small"
            color="primary"
            variant="contained"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
      {commentList &&
        commentList.map((comment, index) => (
          <div key={index} style={{ marginTop: "2em" }}>
            {!comment.responseTo && (
              <>
                <SingleComment
                  comment={comment}
                  id={id}
                  refreshFunction={refreshFunction}
                />
                <ReplyComment
                  commentId={comment._id}
                  commentList={commentList}
                  id={id}
                  refreshFunction={refreshFunction}
                />
              </>
            )}
          </div>
        ))}
    </div>
  );
}

export default Comments;
