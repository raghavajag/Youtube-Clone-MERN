import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";
import "./index.css";

// Components
import Navbar from "./components/layout/Navbar";
import Register from "./components/auth/Register";

// AuthRoute Utility Function
import AuthRoute from "./components/routing/AuthRoute";
import PrivateRoute from "./components/routing/PrivateRoute";

// Redux Stuff
import { Provider } from "react-redux";
import { CssBaseline } from "@material-ui/core";
import Login from "./components/auth/Login";
import axios from "axios";
import store from "./store";

// Redux Actions
import { SET_AUTHENTICATED } from "./redux/actions/types";
import { getUserData } from "./redux/actions/auth";
import { logout } from "./redux/actions/auth";
import Dashboard from "./components/dashboard/Dashboard";
import UploadVidePage from "./components/uploadVidePage/UploadVidePage";

const token = localStorage.getItem("x-auth-token");
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    alert("Token has expired..");
    store.dispatch(logout());
    window.location.href = "/login";
  } else {
    store.dispatch({
      type: SET_AUTHENTICATED,
    });
    axios.defaults.headers.common["x-auth-token"] = token;
    store.dispatch(getUserData());
  }
}
function App() {
  return (
    <div className="app">
      <CssBaseline />
      <Provider store={store}>
        <Router>
          <Navbar />
          <Switch>
            <>
              <div className="main">
                <AuthRoute exact path="/login" component={Login} />
                <AuthRoute exact path="/register" component={Register} />
                <Route exact path="/" component={Dashboard} />
                <PrivateRoute
                  exact
                  path="/video/upload"
                  component={UploadVidePage}
                />
              </div>
            </>
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
