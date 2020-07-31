import React, { useEffect, useState } from "react";
import axios from "axios";

// components
import VideoCard from "./Card";

function LandingPage() {
  const [videos, setVideo] = useState(null);
  useEffect(() => {
    axios.get("api/video").then((res) => {
      if (res.data.length) {
        setVideo(res.data);
      }
    });
  }, []);
  console.log(videos);

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
        videoName={video.videoName}
        thumbName={video.thumbName}
        id={video._id}
      />
    ))
  ) : videos && !videos.length ? (
    <span>No Videos</span>
  ) : null;
}

export default LandingPage;
