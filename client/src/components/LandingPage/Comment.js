import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import axios from "axios";
import { useSelector } from "react-redux";
// MUI Stuff
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
function Comment({
  content,
  author,
  userImage,
  createdAt,
  id,
  commentId,
  refreshFunction,
  isReply,
}) {
  console.log(`Is Reply ${isReply}`);
  const userId = useSelector((state) => state.user.credentials._id);
  const [reply, setReply] = useState("");
  const [action, setAction] = useState(false);
  dayjs.extend(relativeTime);
  const date = dayjs(createdAt).from(dayjs(), true);
  const onChange = (e) => {
    setReply(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setReply("");
    const variable = {
      writer: userId,
      postId: id,
      responseTo: commentId,
      content: reply,
    };
    axios.post("/api/comment", variable).then((res) => {
      if (res.data.success) {
        console.log(res.data);
        setReply("");
        setAction(false);
        refreshFunction(res.data.doc);
      } else {
        alert("Filed to save reply");
      }
    });
  };
  return (
    <Card
      style={{
        boxShadow: "none",
        borderLeft: isReply && "4px solid #e0dede",
        borderBottom: !isReply && "2px solid #888888",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <Avatar
              src={`http://localhost:5000/api/profile/image/${userImage}`}
            />
          </div>
          <div>{author}</div>
          <div>~{date} ago</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ marginLeft: "2.5em" }}>
            <Typography variant="h6" component="h6">
              {content}
            </Typography>
          </div>
          <div>
            <Button
              onClick={() => setAction(!action)}
              size="small"
              color="primary"
              style={{
                height: "100%",
              }}
            >
              Reply
            </Button>
          </div>
        </div>
        {action && (
          <form onSubmit={(e) => onSubmit(e)}>
            <div
              style={{
                marginLeft: "2.5em",
                marginTop: "1em",
                display: "flex",
              }}
            >
              <div style={{ width: "100%" }}>
                <TextField
                  value={reply}
                  onChange={(e) => onChange(e)}
                  fullWidth
                  placeholder="Reply"
                />
              </div>
              <div>
                <Button variant="contained" size="small" type="submit">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}

export default Comment;
