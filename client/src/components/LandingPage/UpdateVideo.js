import React, { useEffect } from "react";
import axios from "axios";
function UpdateVideo({ match }) {
  const videoName = match.params.videoName;
  console.log(videoName)
  console.log(videoName)
  useEffect(() => {
    axios.get(`http://localhost:5000/api/video/info/${videoName}`).then((res) => {
      console.log(res.data);
    });
  }, []);
  return <div>Update Video Page</div>;
}

export default UpdateVideo;
