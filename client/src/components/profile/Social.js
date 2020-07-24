import React, { useState, useEffect } from "react";
import { Button, div, makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// Icons
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedinIcon from "@material-ui/icons/LinkedIn";
import GithubIcon from "@material-ui/icons/GitHub";

import IconButton from "@material-ui/core/IconButton";
function Social({
  githubusername: gitUser,
  facebook: facebookUser,
  linkedin: linkddinUser,
  instagram: instaUser,
  twitter: twitterUser,
  setFormData,
  formData,
}) {
  const useStyles = makeStyles((theme) => ({
    social: {
      display: "flex",
      flexDirection: "row",
      padding: "0.5em",
      marginBottom: "1em",
      width: "100%",
    },
    input: {
      width: "100%",
    },
    iconButton: {
      color: "rgba(255, 0, 0, 0.9)",
    },
  }));
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSocial({ ...social });
  };
  const [social, setSocial] = useState({
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    githubusername: "",
  });
  const { twitter, facebook, instagram, linkedin, githubusername } = social;
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setSocial({
        instagram: !instaUser ? "" : instaUser,
        twitter: !twitterUser ? "" : twitterUser,
        facebook: !facebookUser ? "" : facebookUser,
        linkedin: !linkddinUser ? "" : linkddinUser,
        githubusername: !gitUser ? "" : gitUser,
      });
    }
    return () => (mounted = false);
  }, [gitUser, twitterUser, instaUser, linkddinUser, facebookUser]);
  const onSubmit = () => {
    setFormData({
      ...formData,
      twitter,
      instagram,
      facebook,
      linkedin,
      githubusername,
    });
    setOpen(false);
  };
  const onChange = (e) => {
    setSocial({
      ...social,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
      >
        Social Info
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Social Info</DialogTitle>
        <DialogContent>
          <div className={classes.social}>
            <div>
              <IconButton className={classes.iconButton}>
                <GithubIcon />
              </IconButton>
            </div>
            <TextField
              name="githubusername"
              value={githubusername}
              onChange={(e) => onChange(e)}
              className={classes.input}
            />
          </div>
          <div className={classes.social}>
            <div>
              <IconButton className={classes.iconButton}>
                <TwitterIcon />
              </IconButton>
            </div>
            <TextField
              name="twitter"
              value={twitter}
              onChange={(e) => onChange(e)}
              className={classes.input}
            />
          </div>
          <div className={classes.social}>
            <div>
              <IconButton className={classes.iconButton}>
                <InstagramIcon />
              </IconButton>
            </div>
            <TextField
              name="instagram"
              value={instagram}
              onChange={(e) => onChange(e)}
              className={classes.input}
            />
          </div>
          <div className={classes.social}>
            <div>
              <IconButton className={classes.iconButton}>
                <LinkedinIcon />
              </IconButton>
            </div>
            <TextField
              name="linkedin"
              value={linkedin}
              onChange={(e) => onChange(e)}
              className={classes.input}
            />
          </div>
          <div className={classes.social}>
            <div>
              <IconButton className={classes.iconButton}>
                <FacebookIcon />
              </IconButton>
            </div>
            <TextField
              name="facebook"
              value={facebook}
              onChange={(e) => onChange(e)}
              className={classes.input}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => onSubmit()} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Social;
