import { useState, useEffect } from "react";
import {
  Grid,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Modal,
  Fade,
} from "@mui/material";
import validator from "validator";
import { toast } from "react-toastify";
import "../Admin.css";
import ImageCapture from "./ImageCapture";
import UploadPic from "./UploadPic";
import { camera, pic } from "../assets/picture";

const OptionAdd = ({
  modifyOptionAdd,
  setModifyOptionAdd,
  setModifyTakePic,
  setModifyUploadPic,
}) => {
  const handleSubmit = () => {};

  return (
    <>
      <Modal
        open={modifyOptionAdd}
        onClose={() => setModifyOptionAdd(false)}
        className='optionAddModal'
      >
        <Fade in={modifyOptionAdd}>
          <Stack spacing={3} className='optionModalStack'>
            <Typography variant='h4' align='center'>
              Upload image
            </Typography>
            <Grid container>
              <Grid item xs={6}>
                <Stack
                  className={"optionImage"}
                  onClick={() => {
                    setModifyOptionAdd(false);
                    setModifyTakePic(true);
                  }}
                >
                  <img style={{ padding: "20px 40px " }} src={camera} alt='' />
                  <Typography variant='h5' component='b' align='center'>
                    Take a photo
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack
                  className='optionImage'
                  onClick={() => {
                    setModifyOptionAdd(false);
                    setModifyUploadPic(true);
                  }}
                >
                  <img style={{ padding: "20px 40px" }} src={pic} alt='' />
                  <Typography variant='h5' component='b' align='center'>
                    Pic an image
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Fade>
      </Modal>
    </>
  );
};

export default OptionAdd;
