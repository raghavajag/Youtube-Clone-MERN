import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  makeStyles,
  Button,
  CircularProgress,
  useMediaQuery,
  FormControl,
  Grid,
  TextField,
} from "@material-ui/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import { connect } from "react-redux";

import MyButton from "../../utils/MyButton";

import EditIcon from "@material-ui/icons/Edit";
// Components
import Education from "./Education";
import Social from "./Social";

import { getUserData } from "../../redux/actions/auth";
import store from "../../store";
function Profile({
  user: {
    credentials: { handle, email, data, profileImage },
  },
}) {
  const matches = useMediaQuery("(min-width:750px)");
  const useStyles = makeStyles((theme) => ({
    main: {
      marginTop: "100px",
    },
    Paper: {
      margin: "auto",
      width: "100%",
      padding: matches ? "3em" : "none",
    },
    actions: {
      display: "flex",
      justifyContent: "center",
    },
    image: {
      borderRadius: "50%",
      width: "250px",
      height: "250px",
      objectFit: "cover",
      margin: matches ? "3em" : "0.5em",
    },
    basicData: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: matches ? "row" : "column",
    },
    mainGrid: {
      justifyContent: matches ? "space-around" : "center",
    },
    form: {
      width: "100%",
      padding: matches ? "3em" : "1em",
      display: "flex",
      flexDirection: "column",
    },
    control: {
      marginBottom: "1em",
    },
    button: {
      marginRight: "1em",
    },
    submit: {
      margin: "auto",
      marginTop: "2em",
      width: "100%",
    },
  }));
  const [loading, setLoading] = useState(true);
  const [emptyProfile, setEmptyProfile] = useState(null);
  // const [profileImage, setProfileImage] = useState(null)
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    website: "",
    fieldofintrest: "",
    description: "",
    twitter: "",
    instagram: "",
    facebook: "",
    githubusername: "",
    linkedin: "",
  });

  const {
    bio,
    location,
    website,
    fieldofintrest,
    description,
    twitter,
    instagram,
    linkedin,
    facebook,
    githubusername,
  } = formData;

  const classes = useStyles();
  dayjs.extend(relativeTime);
  useEffect(() => {
    axios.get("/api/profile/user").then((res) => {
      if (res.data.success) {
        setFormData(res.data.profile);
        setLoading(false);
      } else {
        console.log(res.data);
        setLoading(false);
      }
    });
  }, []);
  console.log(formData);
  const checkImage = (image) => {
    if (
      image ===
      "https://floating-springs-68584.herokuapp.com/api/profile/image/noimage.png"
    ) {
      return true;
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    axios.post("/api/profile", formData).then((res) => {
      console.log(res.data);
    });
  };
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleEditImage = () => {
    const fileInput = document.getElementById("inputImage");
    fileInput.click();
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    axios.post("api/profile/image", formData).then((res) => {
      console.log(res.data);
      store.dispatch(getUserData());
    });
  };

  return !loading ? (
    <div className={classes.main}>
      <Paper className={classes.Paper}>
        <Grid container className={classes.mainGrid}>
          <Grid item lg={7} md={7} sm={12} xs={12}>
            <div className={classes.basicData}>
              <div>
                <img
                  className={classes.image}
                  src={
                    checkImage(profileImage)
                      ? profileImage
                      : `https://floating-springs-68584.herokuapp.com/api/profile/image/${profileImage}`
                  }
                  alt="no-img"
                />
              </div>
              <div>
                <Typography color="primary" variant="h6" component="h5">
                  {handle}
                </Typography>
                <Typography variant="h6" component="h5">
                  {email}
                </Typography>
                <span>Joined {dayjs(data).from(dayjs(), true)} ago</span>
                <input
                  className={classes.inputImage}
                  type="file"
                  id="inputImage"
                  hidden="hidden"
                  onChange={(e) => {
                    handleImageChange(e);
                  }}
                />
                <MyButton
                  tip="Edit Profile Image"
                  onClick={handleEditImage}
                  style={{ color: "gray" }}
                >
                  <EditIcon />
                </MyButton>
              </div>
            </div>
          </Grid>
          <Grid item lg={5} md={5} sm={12} xs={12}>
            <form
              className={classes.form}
              action=""
              onSubmit={(e) => onSubmit(e)}
            >
              {emptyProfile === true && (
                <Typography
                  color="secondary"
                  style={{ marginBottom: "1em" }}
                  varinat="h6"
                >
                  No Profile Created, Create One
                </Typography>
              )}
              <FormControl className={classes.control}>
                <TextField
                  value={bio}
                  onChange={(e) => onChange(e)}
                  label="Bio"
                  variant="filled"
                  name="bio"
                />
              </FormControl>
              <FormControl className={classes.control}>
                <TextField
                  value={location}
                  onChange={(e) => onChange(e)}
                  label="Location"
                  name="location"
                  variant="filled"
                />
              </FormControl>
              <FormControl className={classes.control}>
                <TextField
                  value={website}
                  name="website"
                  onChange={(e) => onChange(e)}
                  label="Website"
                  variant="filled"
                />
              </FormControl>
              <div
                style={{
                  display: "flex",
                  justifyContent: matches ? "start" : "flex-start",
                }}
              >
                <Education
                  formData={formData}
                  setFormData={setFormData}
                  fieldofintrest={fieldofintrest}
                  description={description}
                />
                <Social
                  formData={formData}
                  setFormData={setFormData}
                  matches={matches}
                  twitter={twitter}
                  instagram={instagram}
                  facebook={facebook}
                  linkedin={linkedin}
                  githubusername={githubusername}
                />
              </div>
              <Button
                className={classes.submit}
                type="submit"
                variant="outlined"
                color="secondary"
              >
                Submit
              </Button>
            </form>
          </Grid>
          {/* <Grid>
            <div className={classes.actions}>
              <Button
                className={classes.button}
                color="secondary"
                variant="outlined"
                onClick={() => console.log(`List User Videos`)}
              >
                Your Videos
              </Button>
              <Button
                className={classes.button}
                color="secondary"
                variant="outlined"
                onClick={() => console.log(`Edit User Detail`)}
              >
                Save Details
              </Button>
            </div>
          </Grid> */}
        </Grid>
      </Paper>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "150px",
      }}
    >
      <CircularProgress color="secondary" size={120} thickness={2} />
    </div>
  );
}
const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps)(Profile);
