import React, { useEffect, useState } from "react";

import SingleComment from "./SingleComment";

function ReplyComment({ commentList, id, refreshFunction, commentId }) {
  const [childCommentNum, setChildCommentNum] = useState(0);
  const [open, setOpen] = useState(false);
  console.log(commentList);
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
    setOpen(!open);
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
      {open &&
        commentList !== null &&
        commentList.map(
          (comment, index) =>
            comment.responseTo === commentId && (
              <div
                key={index}
                style={{ marginLeft: "2em", marginTop: "2em", width: "80%" }}
              >
                {console.log(comment)}
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
            )
        )}
    </div>
  );
}

export default ReplyComment;
