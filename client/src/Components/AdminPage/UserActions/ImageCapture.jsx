import { useState, useEffect, useRef, useCallback } from "react";
import {
  Modal,
  Button,
  Stack,
  Box,
  Fade,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  resetImage,
  addImageCamera,
  recognizeImage,
} from "../../../Redux/reducers/image";
import Webcam from "react-webcam";

const ImageCapture = ({ modifyTakePic, setModifyTakePic, setModify }) => {
  const dispatch = useDispatch();
  const webcamRef = useRef(null);
  const user_id = useSelector((state) => state.user.user.user_id);
  const imgSrc = useSelector((state) => state.image.base64img);
  const [ignore, setIgnore] = useState(false);
  const error = useSelector((state) => state.image.error);
  const resultCode = useSelector((state) => state.image.resultCode);
  const loading = useSelector((state) => state.image.loading);
  const newId = useSelector((state) => state.image.user_id);
  const [id, setId] = useState("");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(user_id);
    dispatch(addImageCamera({ image: imageSrc, user_id: user_id }));
  }, [webcamRef, imgSrc, user_id]);

  useEffect(() => {
    console.log(user_id);
    setId(user_id);
  }, [user_id]);

  useEffect(() => {
    console.log(user_id === newId);
    if (resultCode === 211 && user_id === newId && modifyTakePic === true) {
      setModifyTakePic(false);
      setModify(true);
      dispatch(resetImage());
    }
  }, [resultCode, user_id, newId]);

  const handleSubmit = () => {
    console.log("inside checkface");
    dispatch(recognizeImage());
  };

  const handleReset = () => {
    dispatch(resetImage());
    setIgnore(false);
  };

  return (
    <>
      <Modal
        open={modifyTakePic}
        onClose={() => {
          setModifyTakePic(false);
          setIgnore(false);
          dispatch(resetImage());
        }}
        className='takePicModal'
      >
        <Fade in={modifyTakePic}>
          <Stack spacing={3} className='takePicStack'>
            {!imgSrc && (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat='image/jpeg'
                />
                <Box
                  sx={{ mx: "auto", display: "flex", justifyContent: "center" }}
                >
                  <Button variant='contained' onClick={capture}>
                    Capture photo
                  </Button>
                </Box>
              </>
            )}
            {imgSrc && (
              <>
                <img src={imgSrc} />
                {error && resultCode !== 200 && <h2 align='center'>{error}</h2>}
                <Typography variant='body' align='center'>
                  {resultCode === 200 && user_id !== newId && (
                    <div>
                      Unable to proceed as the face in the image is very
                      different from previous
                    </div>
                  )}
                </Typography>
                {loading && (
                  <Box
                    sx={{
                      mx: "auto",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                <Grid container justifyContent={"center"} columnGap={4}>
                  <Button variant='contained' onClick={handleReset}>
                    Reset Image
                  </Button>
                  <Button
                    variant='contained'
                    onClick={handleSubmit}
                    sx={{
                      display: user_id !== newId ? "none" : "block",
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </>
            )}
          </Stack>
        </Fade>
      </Modal>
    </>
  );
};

export default ImageCapture;
