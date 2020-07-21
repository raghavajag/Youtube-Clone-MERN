import React from "react";
import { Typography } from "@material-ui/core";

import { connect } from "react-redux";

function Profile({
  user: {
    credentials: { handle, email, data },
    loading,
  },
}) {
  return (
    !loading && <Typography variant="h2">{handle.toUpperCase()}</Typography>
  );
}
const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps)(Profile);
