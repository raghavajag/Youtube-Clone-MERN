import React, { useEffect, useState } from "react";

import SingleComment from "./SingleComment";
import Collapse from "@material-ui/core/Collapse";

function ReplyComment({ commentList, id, refreshFunction, commentId }) {
  const [childCommentNum, setChildCommentNum] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let commentNumber = 0;
    commentList.map((comment) => {
      if (comment.responseTo === commentId) {
        commentNumber++;
      }
    });
    setChildCommentNum(commentNumber);
  }, [commentList, commentId]);
  const handleChange = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div>
      {childCommentNum > 0 && (
        <p
          style={{
            fontSize: "14px",
            margin: "0px",
            color: "gray",
            cursor: "pointer",
          }}
          onClick={() => handleChange()}
        >
          View {childCommentNum} more comments
        </p>
      )}
      {commentList !== null &&
        commentList.map(
          (comment, index) =>
            comment.responseTo === commentId && (
              <Collapse key={index} in={open}>
                <div
                  style={{ marginLeft: "2em", marginTop: "2em", width: "80%" }}
                >
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
                </div>
              </Collapse>
            )
        )}
    </div>
  );
}

export default ReplyComment;
