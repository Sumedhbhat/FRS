import { useState } from "react";
import { Button, Fade, Grid, Modal, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../../Redux/functions/userFunctions";

const DeleteConfirm = ({ deleteConfirm, setDeleteConfirm, user_id }) => {
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(deleteUser(user_id));
    setDeleteConfirm(false);
  };
  return (
    <Modal
      closeAfterTransition
      open={deleteConfirm}
      onClose={() => setDeleteConfirm(false)}
    >
      <Fade in={deleteConfirm}>
        <Stack spacing={3} className={"addModalStack"}>
          <Typography variant='h4' align='center'>
            Are you sure you wish to delete the face?
          </Typography>
          <Grid columnGap={4} container justifyContent='center'>
            <Button variant='contained' onClick={handleDelete} size='large'>
              Delete
            </Button>
            <Button
              variant='contained'
              color='error'
              size='large'
              onClick={() => setDeleteConfirm(false)}
            >
              Cancel
            </Button>
          </Grid>
        </Stack>
      </Fade>
    </Modal>
  );
};

export default DeleteConfirm;
