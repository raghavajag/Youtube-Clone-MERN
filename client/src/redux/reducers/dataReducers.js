const intialState = {};

export default function (state = intialState, action) {
  const { payload, type } = action;
  switch (type) {
    default:
      return state;
  }
}
