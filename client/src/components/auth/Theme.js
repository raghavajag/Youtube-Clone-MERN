export const registerTheme = (theme) => ({
  main: {
    width: "auto",
    display: "block",
    margin: "100px auto 0 auto",
    maxWidth: "1200px",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(3)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    marginTop: theme.spacing(1),
    position: "relative",
  },
  noAccountHeader: {
    width: "100%",
  },
  signUpLink: {
    textDecoration: "none",
    // width:'100%'
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  progress: {
    position: "absolute",
  },
});

export const loginTheme = (theme) => ({
  main: {
    width: "auto",
    margin: "100px auto 0 auto",
    maxWidth: "1200px",
    display: "block",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(3)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    marginTop: theme.spacing(3),
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    left: "85%",
    top: "11%",
  },
  noAccountHeader: {
    width: "100%",
  },
  signUpLink: {
    textDecoration: "none",
    // width:'100%'
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  progress: {
    position: "absolute",
  },
});
