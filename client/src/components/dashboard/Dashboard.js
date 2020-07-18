import React from "react";
import { connect } from "react-redux";
import {
  Typography,
  Button,
  Paper,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
function Dashboard({ authenticated, loading }) {
  const useStyles = makeStyles((theme) => ({
    dashboard: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      width: "80%",
      height: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
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
        <CircularProgress size={120} thickness={2} />
      </div>
    );
  }
  if (!loading && !authenticated) {
    return (
      <div className={classes.dashboard}>
        <Paper className={classes.paper}>
          <Typography variant="h4">User Not Logged In</Typography>
          <div className={classes.buttons}>
            <Button
              className={classes.login}
              component={Link}
              to="/login"
              variant="contained"
              color="secondary"
            >
              Log In
            </Button>
            <Button
              className={classes.register}
              component={Link}
              to="/register"
              color="primary"
            >
              Register
            </Button>
          </div>
        </Paper>
      </div>
    );
  } else {
    return (
      <div className={classes.dashboard}>
        <Typography variant="h4">User Logged In</Typography>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  loading: state.user.loading,
});
export default connect(mapStateToProps)(Dashboard);
