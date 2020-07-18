import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { CircularProgress, Grid } from "@material-ui/core";
import { registerTheme } from "./Theme";
import { connect } from "react-redux";
import { registerUser } from "../../redux/actions/auth";

function Register({ history, registerUser, UI: { loading, errors } }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    handle: "",
  });
  const [registerError, setRegisterError] = useState(null);
  const { email, password, password2, handle } = formData;
  useEffect(() => {
    let mounted = true;
    if (errors && mounted && !loading) {
      setRegisterError(errors);
    }
    return () => (mounted = false);
  }, [errors, loading]);

  const useStyles = makeStyles(registerTheme);
  const classes = useStyles();
  const onchange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      return setRegisterError([{ msg: "Passwords Must Match !" }]);
    }
    const userData = {
      email,
      password,
      handle,
    };
    registerUser(userData, history);
  };

  return (
    <main className={classes.main}>
      <CssBaseline></CssBaseline>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} onSubmit={(e) => onSubmit(e)}>
          <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="register-email-input">Enter Email</InputLabel>
            <Input
              id="register-email-input"
              onChange={(e) => onchange(e)}
              name="email"
              value={email}
              autoComplete="email"
              autoFocus
            ></Input>
          </FormControl>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            spacing={1}
          >
            <Grid item xs={12} md={6} sm={12}>
              <FormControl required fullWidth margin="normal">
                <InputLabel htmlFor="register-password">
                  Enter Password
                </InputLabel>
                <Input
                  onChange={(e) => onchange(e)}
                  name="password"
                  value={password}
                  type="password"
                  id="register-password"
                ></Input>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <FormControl required fullWidth margin="normal">
                <InputLabel htmlFor="confirm-password-input">
                  Confirm Password
                </InputLabel>
                <Input
                  onChange={(e) => onchange(e)}
                  name="password2"
                  value={password2}
                  type="password"
                  id="confirm-password-input"
                ></Input>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12} sm={12}>
              <FormControl required fullWidth margin="normal">
                <InputLabel htmlFor="user-handle">Handle</InputLabel>
                <Input
                  onChange={(e) => onchange(e)}
                  name="handle"
                  value={handle}
                  id="user-handle"
                ></Input>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            color="primary"
            className={classes.submit}
          >
            Register{" "}
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
        </form>
        {registerError &&
          registerError.map((error) => (
            <Typography key={error.msg} className={classes.errorText}>
              {error.msg}
            </Typography>
          ))}
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Typography component="h6" className={classes.noAccountHeader}>
              Have an account?
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Button
              size="small"
              color="primary"
              className={classes.signUpLink}
              component={Link}
              to="/login"
            >
              Login !
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </main>
  );
}

const mapStateToProps = (state) => ({
  UI: state.UI,
});
export default connect(mapStateToProps, { registerUser })(Register);
