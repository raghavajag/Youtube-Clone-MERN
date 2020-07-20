import React from "react";
import SideBarCard from "./SideBarCard";

function SideBar({ videos }) {
  return videos.map((video) => (
    <SideBarCard
      title={video.title}
      user={video.writer.handle}
      catagory={video.catagory}
      thumbnail={video.thumbnail}
      id={video._id}
    />
  ));
}

export default SideBar;
