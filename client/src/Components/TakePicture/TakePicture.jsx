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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addImage,
  resetImage,
  recognizeUser,
  reset,
  getUser,
} from "../../Redux/reducers/recognizeReducer";
import { AnimatePresence, motion } from "framer-motion";
import { MdExpandMore } from "react-icons/md";
import "./TakePicture.css";

const TakePicture = () => {
  // Initialize state and variables
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const imgSrc = useSelector((state) => state.recognize.image);
  const loading = useSelector((state) => state.recognize.loading);
  const error = useSelector((state) => state.recognize.error);
  const result = useSelector((state) => state.recognize.result);
  const users = useSelector((state) => state.recognize.users);
  const imgpath = useSelector((state) => state.recognize.imgpath);

  //Capturing Image
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    dispatch(addImage(imageSrc));
    dispatch(recognizeUser(imageSrc));
  }, [webcamRef, imgSrc]);

  //Use Effect

  //Button functions
  const handleReset = () => {
    dispatch(reset());
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
              <img
                src={
                  imgpath
                    ? require(`${process.env.REACT_APP_IMAGE}/captures/${imgpath}`)
                    : imgSrc
                }
                className='takePictureImage'
              />
              {loading && <CircularProgress />}
              {error && <h1>{error}</h1>}
              <div>
                {result &&
                  users &&
                  !loading &&
                  users.map((user) => (
                    <Accordion key={user.user_id}>
                      <AccordionSummary expandIcon={<MdExpandMore />}>
                        <Typography variant='body1'>{user.name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant='body1'>
                          Department: {user.department}
                        </Typography>
                        <Typography variant='body1'>
                          City: {user.city}
                        </Typography>
                        <Typography variant='body1'>
                          Gender:{" "}
                          {user.gender === "M"
                            ? "Male"
                            : user.gender === "F"
                            ? "Female"
                            : "You have preferred not to say"}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
              </div>
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
