import React from "react";
import { Link } from "react-router-dom";

// MUI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

// Icons
import Notification from "@material-ui/icons/NotificationImportant";
import HomeIcon from "@material-ui/icons/Home";
import LogOutIcon from "@material-ui/icons/KeyboardReturn";
import Video from "@material-ui/icons/VideoCall";

import MyButton from "../../utils/MyButton";
import { logout } from "../../redux/actions/auth";
import { connect } from "react-redux";
function Navbar({ authenticated, loading, logout }) {
  const useStyles = makeStyles((theme) => ({
    navColor: {
      height: "4em",
      background: "linear-gradient(to right, #00B4DB, #0083B0)",
      color: "#fff",
    },
    darkNav: {
      background: "#ffa726",
      color: "#fff",
      // opacity: ".8",
      // padding: ".5rem 2rem",
    },
  }));
  const classes = useStyles();
  const authMarkup = (
    <AppBar className={classes.navColor}>
      <Toolbar className="nav-container">
        <Link to="/">
          <MyButton tip="Home">
            <HomeIcon />
          </MyButton>
        </Link>
        <MyButton tip="Notifications">
          <Notification />
        </MyButton>
        <MyButton onClick={logout} tip="Logout">
          <LogOutIcon />
        </MyButton>
        <Link to="/video/upload">
          <MyButton tip="Upload">
            <Video />
          </MyButton>
        </Link>
      </Toolbar>
    </AppBar>
  );
  const unAuthMarkup = (
    <AppBar className={classes.navColor}>
      <Toolbar className="nav-container">
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/register">
          Register
        </Button>
      </Toolbar>
    </AppBar>
  );
  return authenticated && !loading ? authMarkup : unAuthMarkup;
}
const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  loading: state.UI.loading,
});
export default connect(mapStateToProps, { logout })(Navbar);
