import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function Education({
  fieldofintrest: userIntrest,
  description: userDescription,
  setFormData,
  formData,
}) {
  const [open, setOpen] = React.useState(false);
  const [edu, setEdu] = useState({
    fieldofintrest: "",
    description: "",
  });
  const { fieldofintrest, description } = edu;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = () => {
    setFormData({ ...formData, fieldofintrest, description });
    setOpen(false);
  };
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setEdu({
        fieldofintrest: !userIntrest ? "" : userIntrest,
        description: !userDescription ? "" : userDescription,
      });
    }
    return () => (mounted = false);
  }, [userDescription, userIntrest]);
  const onChange = (e) => {
    setEdu({ ...edu, [e.target.name]: e.target.value });
  };
  return (
    <>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        style={{ marginRight: "1em" }}
      >
        About Intrests
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          What Are You Passionate About ?
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Field Of Intrest"
            type="text"
            fullWidth
            name="fieldofintrest"
            value={fieldofintrest}
            onChange={(e) => onChange(e)}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            name="description"
            value={description}
            onChange={(e) => onChange(e)}
            fullWidth
          />
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

export default Education;
