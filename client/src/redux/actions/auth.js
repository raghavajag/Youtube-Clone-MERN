import {
  LOADING_UI,
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  CLEAR_ERRORS,
  SET_ERRORS,
} from "./types";
import axios from "axios";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({
    type: LOADING_UI,
  });
  axios
    .post("/api/auth", userData)
    .then((res) => {
      setAuthHeader(res.data.token);
      dispatch(getUserData());
      dispatch({
        type: CLEAR_ERRORS,
      });
      history.push("/");
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data.errors,
      });
    });
};
export const registerUser = (userData, history) => (dispatch) => {
  dispatch({
    type: LOADING_UI,
  });
  axios
    .post("/api/users", userData)
    .then((res) => {
      setAuthHeader(res.data.token);
      dispatch(getUserData());
      dispatch({
        type: CLEAR_ERRORS,
      });
      history.push("/");
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data.errors,
      });
    });
};

export const getUserData = () => (dispatch) => {
  dispatch({
    type: LOADING_USER,
  });
  axios
    .get("/api/auth")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};
export const logout = () => (dispatch) => {
  localStorage.removeItem("x-auth-token");
  delete axios.defaults.headers.common["x-auth-token"];
  dispatch({
    type: SET_UNAUTHENTICATED,
  });
};
const setAuthHeader = (authToken) => {
  const token = authToken;
  localStorage.setItem("x-auth-token", token);
  axios.defaults.headers.common["x-auth-token"] = token;
};
