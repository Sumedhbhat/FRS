import { useState, useEffect } from "react";
import {
  Modal,
  Fade,
  Stack,
  Grid,
  InputBase,
  Button,
  Box,
  Drawer,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import {
  resetImage,
  addImageCamera,
  recognizeImage,
} from "../../../Redux/reducers/image";
import "../Admin.css";

const UploadPic = ({ modifyUploadPic, setModifyUploadPic, setModify }) => {
  const dispatch = useDispatch();

  const [ignore, setIgnore] = useState(false);
  const [selected, setSelected] = useState(false);
  const [files, setFiles] = useState();
  const image = useSelector((state) => state.image.base64img);
  const error = useSelector((state) => state.image.error);
  const resultCode = useSelector((state) => state.image.resultCode);
  const loading = useSelector((state) => state.image.loading);
  const newId = useSelector((state) => state.image.user_id);
  const user_id = useSelector((state) => state.user.user.user_id);

  useEffect(() => {
    // console.log(files);
    if (resultCode === 211 && user_id === newId && modifyUploadPic === true) {
      setModifyUploadPic(false);
      setModify(true);
      dispatch(resetImage());
    }
  }, [resultCode, user_id, newId]);

  const handleSubmit = () => {
    console.log(files);
    console.log("inside checkface");
    dispatch(recognizeImage());
  };
  const handleReset = () => {
    setFiles();
    dispatch(resetImage());
    setSelected(false);
    setIgnore(false);
  };

  const handleSelect = (e) => {
    const reader = new FileReader();
    var url = reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = (event) => {
      setSelected(true);
      // setImage(event.target.result);
      dispatch(
        addImageCamera({ image: event.target.result, user_id: user_id })
      );
    };
    setFiles(e.target.files[0]);
  };
  return (
    <Modal
      open={modifyUploadPic}
      onClose={() => {
        setModifyUploadPic(false);
        setIgnore(false);
        setFiles();
      }}
    >
      <Fade in={modifyUploadPic}>
        <Stack spacing={3} className='uploadPicStack'>
          {!image && (
            <input
              type='file'
              accept='.jpeg,.png,.jpg'
              onChange={(e) => {
                handleSelect(e);
              }}
            />
          )}
          {image && (
            <>
              <Box className='uploadPicBox'>
                <img
                  src={image}
                  alt={"uploaded file"}
                  style={{ maxWidth: "400px" }}
                />
              </Box>
              {error && resultCode !== 200 && <h2 align='center'>{error}</h2>}
              <Typography variant='body' align='center'>
                {resultCode === 200 && user_id !== newId && (
                  <div>
                    Unable to proceed as in the image is very different from the
                    previous
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
                  Reset
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
  );
};

export default UploadPic;
