import React, { useState } from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import LandingPage from "../LandingPage/LandingPage";
import { connect } from "react-redux";
function Dashboard({ authenticated, loading }) {
  const useStyles = makeStyles(() => ({
    dashboard: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      justifyItems: "center",
      gridGap: "1em",
      gridRowGap: "0px",
    },
    paper: {
      minWidth: "300px",
      height: "250px",
    },
    buttons: {
      display: "flex",
      margin: "1em",
    },
    login: {
      marginLeft: "1em",
    },
    register: {
      marginLeft: "1em",
    },
  }));
  const classes = useStyles();
  
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "150px",
        }}
      >
        <CircularProgress color="secondary" size={120} thickness={2} />
      </div>
    );
  }
  return (
    <>
      <div className={classes.dashboard}>
        <LandingPage />
      </div>
    </>
  );
}
const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  loading: state.user.loading,
});
export default connect(mapStateToProps)(Dashboard);
