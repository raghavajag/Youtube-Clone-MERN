import { combineReducers } from "redux";
import data from "./dataReducers";
import UI from "./uiReducers";
import user from "./userReducers";

export default combineReducers({
  user,
  UI,
  data,
});
