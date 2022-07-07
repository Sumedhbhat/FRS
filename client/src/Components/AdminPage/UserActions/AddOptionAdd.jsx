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
import { camera, pic } from "../assets/picture";
import AddImageCapture from "./AddImageCapture";
import AddUploadPic from "./AddUploadPic";
import AddModal from "./AddModal";

const AddOptionAdd = ({
  optionAdd,
  setOptionAdd,
  setTakePic,
  setUploadPic,
}) => {
  const handleSubmit = () => {};
  return (
    <>
      <Modal
        open={optionAdd}
        onClose={() => setOptionAdd(false)}
        className='optionAddModal'
      >
        <Fade in={optionAdd}>
          <Stack spacing={3} className='optionModalStack'>
            <Typography variant='h4' align='center'>
              Upload image
            </Typography>
            <Grid container>
              <Grid item xs={6}>
                <Stack
                  className={"optionImage"}
                  onClick={() => {
                    setOptionAdd(false);
                    setTakePic(true);
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
                    setOptionAdd(false);
                    setUploadPic(true);
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

export default AddOptionAdd;
