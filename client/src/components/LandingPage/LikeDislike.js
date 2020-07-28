import React, { useEffect, useState } from "react";
import MyButton from "../../utils/MyButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import axios from "axios";
function LikeDislike(props) {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);

  let variable = {};
  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }
  useEffect(() => {
    axios.post("/api/like/getLikes", variable).then((response) => {
      if (response.data.success) {
        setLikes(response.data.likes.length);

        response.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction("liked");
          }
        });
      } else {
        alert("Failed to get likes");
      }
    });

    axios.post("/api/like/getDislikes", variable).then((response) => {
      if (response.data.success) {
        setDislikes(response.data.dislikes.length);

        response.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDislikeAction("disliked");
          }
        });
      } else {
        alert("Failed to get dislikes");
      }
    });
  }, [props.userId]);

  const onLike = () => {
    if (LikeAction === null) {
      axios.post("/api/like/upLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction("liked");

          if (DislikeAction !== null) {
            setDislikeAction(null);
            setDislikes(Dislikes - 1);
          }
        } else {
          alert("Failed to increase the like");
        }
      });
    } else {
      axios.post("/api/like/unLike", variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert("Failed to decrease the like");
        }
      });
    }
  };
  const onDislike = () => {
    if (DislikeAction !== null) {
      axios.post("/api/like/unDisLike", variable).then((response) => {
        if (response.data.success) {
          setDislikes(Dislikes - 1);
          setDislikeAction(null);
        } else {
          alert("Failed to decrease dislike");
        }
      });
    } else {
      axios.post("/api/like/upDisLike", variable).then((response) => {
        if (response.data.success) {
          setDislikes(Dislikes + 1);
          setDislikeAction("disliked");

          if (LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert("Failed to increase dislike");
        }
      });
    }
  };

  return (
    <>
      <span style={{ marginLeft: "1em" }}>
        {Likes}
        <MyButton
          onClick={onLike}
          style={{ color: LikeAction === "liked" ? "blue" : "#888888" }}
          tip="Like"
        >
          <ThumbUpIcon fontSize="small" />
        </MyButton>
      </span>
      <span>
        {Dislikes}
        <MyButton
          onClick={onDislike}
          style={{ color: DislikeAction === "disliked" ? "red" : "#888888" }}
          tip="Dislike"
        >
          <ThumbDownIcon fontSize="small" />
        </MyButton>
      </span>
    </>
  );
}

export default LikeDislike;
