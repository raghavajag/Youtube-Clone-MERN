import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

function MyButton({
  children,
  onClick,
  btnClassName,
  tipClassName,
  tip,
  style,
}) {
  return (
    <>
      <Tooltip title={tip} className={tipClassName} placeholder="top">
        <IconButton
          style={!style ? { color: "white" } : style}
          className={btnClassName}
          onClick={!onClick ? null : () => onClick()}
        >
          {children}
        </IconButton>
      </Tooltip>
    </>
  );
}

export default MyButton;
