import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import {
  Grid,
  Box,
  Typography,
  Button,
  Container,
  Stack,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import * as tf from "@tensorflow/tfjs";
import { MdExpandMore } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  addImage,
  resetImage,
  recognizeUser,
  reset,
  recognizeUser2,
} from "../../Redux/reducers/recognizeReducer";

const TakePicture2 = () => {
  const dispatch = useDispatch();
  const webcamRef = useRef(null);
  const blazeface = require("@tensorflow-models/blazeface");
  const [faceDetected, setFaceDetected] = useState(false);
  const loading = useSelector((state) => state.recognize.loading);
  const error = useSelector((state) => state.recognize.error);
  const result = useSelector((state) => state.recognize.result);
  const users = useSelector((state) => state.recognize.users);
  const [prev, setPrev] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [detectionStatus, setDetectionStatus] = useState(false);
  const [time, setTime] = useState(0);
  const [time2, setTime2] = useState(0);

  const runFacedetection = async () => {
    const model = await blazeface.load();
    console.log("FaceDetection Model is Loaded..");
    setInterval(() => {
      detect(model);
    }, 1000);
  };

  const returnTensors = false;

  useEffect(() => {
    runFacedetection();
  }, []);

  useEffect(() => {
    if (allUsers === null && users !== null && users.length > 0) {
      setAllUsers(users);
    } else if (
      allUsers !== null &&
      users !== null &&
      users.length > 0 &&
      // allUsers.length <= users.length
      allUsers.slice(-1)[0].user_id != users.slice(-1)[0].user_id
    ) {
      setAllUsers((prev) => prev.concat(users));
    }
    // console.log(allUsers);
  }, [users]);

  useEffect(() => {
    if (faceDetected) {
      setTime(3);
      setDetectionStatus(true);
      var set = () => {
        setTime((prev) => prev - 1);
      };
      let interval = setInterval(set, 1000);
      setTimeout(() => {
        clearInterval(interval);
        const imageSrc = webcamRef.current.getScreenshot();
        dispatch(recognizeUser2(imageSrc));
        let set2 = () => {
          setTime2((prev) => prev - 1);
        };
        let interval2 = setInterval(set2, 1000);
        if (loading == false) {
          setTime2(5);
          setTime(3);
          setTimeout(() => {
            setDetectionStatus(true);
            clearInterval(interval2);
            setFaceDetected(false);
          }, 5000);
        }
      }, 4000);
    }
  }, [faceDetected, webcamRef]);

  const detect = async (model) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      //Set video height and width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      //Set canvas height and width
      // canvasRef.current.width = videoWidth;
      // canvasRef.current.height = videoHeight;

      // Make detections
      const prediction = await model.estimateFaces(video, returnTensors);
      // console.log(prediction.length);
      if (prediction.length > 0) {
        setFaceDetected(true);
      } else {
        setFaceDetected(false);
      }
      // const ctx = canvasRef.current.getContext("2d");
      // draw(prediction, ctx);
    }
  };
  return (
    <Stack spacing={2} py={3}>
      <Typography variant='h3'>Face Recognition</Typography>
      <Grid container spacing={2} justifyContent='center'>
        <Grid item xs={7}>
          <Stack spacing={3} display='flex' alignItems='center'>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat='image/jpeg'
              className='takePictureWebcam'
            />
            {(!faceDetected || detectionStatus) && (
              <Typography variant='body1' align='center'>
                Please position your face in the center of the camera and wait
                for the camera to detect your face
              </Typography>
            )}
            {faceDetected && !loading && detectionStatus && (
              <>
                <CircularProgress />
              </>
            )}
            {faceDetected && detectionStatus && loading && time2 > 0 && (
              <>
                <Typography variant='h6' align='center'>
                  Please wait for a moment before the next picture {time2}
                </Typography>
              </>
            )}
            {faceDetected && detectionStatus && !loading && time > 0 && (
              <>
                <Typography variant='h6' align='center'>
                  Taking a picture in {time}
                </Typography>
              </>
            )}
            {allUsers !== null && allUsers.length !== 0 && (
              <>
                <Typography variant='h6' align='center'>
                  Face liveness :{" "}
                  {allUsers[allUsers.length - 1].face_liveness_status}
                </Typography>
                <Typography variant='h6' align='center'>
                  Face liveness confidence :
                  {allUsers[allUsers.length - 1].face_liveness_confidence}
                </Typography>
              </>
            )}
          </Stack>
        </Grid>
        <Grid item xs={4} sx={{ overflowY: "scroll" }}>
          <Stack>
            <Typography variant='h4' py={2}>
              Latest recognized Users
            </Typography>
            {allUsers !== null ? (
              allUsers.map((user, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<MdExpandMore />}>
                    <Typography variant='h5'>{user.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant='body1'>
                      Department: {user.department}
                    </Typography>
                    <Typography variant='body1'>City: {user.city}</Typography>
                    <Typography variant='body1'>
                      Gender:{" "}
                      {user.gender === "M"
                        ? "Male"
                        : user.gender === "F"
                        ? "Female"
                        : "You have preferred not to say"}
                    </Typography>
                    <Typography variant='body1'>
                      Face Liveness : {user.face_liveness_status}
                    </Typography>
                    <Typography variant='body1'>
                      Face Liveness Confidence : {user.face_liveness_confidence}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography variant='h6'> No Users have been logged</Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default TakePicture2;
