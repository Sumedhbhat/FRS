import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import {
  Button,
  Container,
  Stack,
  Grid,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addImage,
  resetImage,
  recognizeUser,
  reset,
  getUser,
} from "../../Redux/reducers/recognizeReducer";
import { AnimatePresence, motion } from "framer-motion";
import "./TakePicture.css";

const TakePicture = () => {
  // Initialize state and variables
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const imgSrc = useSelector((state) => state.recognize.image);
  const loading = useSelector((state) => state.recognize.loading);
  const error = useSelector((state) => state.recognize.error);
  const userId = useSelector((state) => state.recognize.userId);
  const result = useSelector((state) => state.recognize.result);
  const user = useSelector((state) => state.recognize.user);

  //Capturing Image
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    dispatch(addImage(imageSrc));
    dispatch(recognizeUser(imageSrc));
  }, [webcamRef, imgSrc]);

  //Use Effect

  useEffect(() => {
    if (result) {
      dispatch(getUser(userId));
    }
  }, [result]);
  // useEffect(() => {
  //   if (userId && result) {
  //     navigate("/result/?userId=" + userId);
  //     dispatch(reset());
  //   }
  // }, [userId, error, loading]);

  //Button functions
  const handleReset = () => {
    dispatch(reset());
  };

  const handleSubmit = () => {
    dispatch(recognizeUser(imgSrc));
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant='h3'>Face Recognition</Typography>
      </Box>
      <>
        <Stack spacing={3} py={2} className='takePictureStack'>
          {!imgSrc && (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                className='takePictureWebcam'
              />
              <Button
                variant='contained'
                onClick={capture}
                size='large'
                component={motion.div}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Capture photo
              </Button>
              <Typography variant='body1' color='warning'>
                Please make sure your camera is turned on and you are in front
                of the camera
              </Typography>
            </>
          )}
          {imgSrc && (
            <>
              <img src={imgSrc} className='takePictureImage' />
              {loading && <CircularProgress />}
              {error && <h1>{error}</h1>}
              {result && user && !loading && (
                <Box>
                  <h1>Hello, {user && user.name}</h1>
                  <h2>Department, {user.department}</h2>
                  <h2>City, {user.city}</h2>
                  <h2>
                    Gender,{" "}
                    {user.gender === "M"
                      ? "Male"
                      : user.gender === "F"
                      ? "F"
                      : "You have preferred not to say"}
                  </h2>
                </Box>
              )}
              <Grid container columnGap={5} justifyContent='center'>
                {!loading && (
                  <Button
                    variant='contained'
                    size='large'
                    component={motion.div}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleReset}
                  >
                    {error !== null ? "Try Again" : "Check Another Face"}
                  </Button>
                )}
                {/* <Button
                variant='contained'
                onClick={handleSubmit}
                sx={{ display: result && !loading ? "none" : "flex" }}
              >
                Check Face
              </Button> */}
              </Grid>
            </>
          )}
        </Stack>
      </>
    </>
  );
};

export default TakePicture;
