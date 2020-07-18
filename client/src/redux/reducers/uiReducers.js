import {
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS,
  STOP_LOADING,
} from "../actions/types";

const intialState = {
  loading: false,
  errors: null,
};

export default function (state = intialState, action) {
  const { payload, type } = action;
  switch (type) {
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null,
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
