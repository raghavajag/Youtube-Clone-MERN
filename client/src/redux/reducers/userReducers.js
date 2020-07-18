import {
  LOADING_USER,
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
} from "../actions/types";
const intialState = {
  loading: false,
  authenticated: false,
  credentials: {},
  notifications: [],
};

export default function (state = intialState, action) {
  const { payload, type } = action;
  switch (type) {
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...payload,
      };
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return {
        ...state,
        authenticated: false,
      };
    default:
      return state;
  }
}
