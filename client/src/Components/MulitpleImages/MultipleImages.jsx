import {
  Button,
  Stack,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { useState } from "react";
import FileBase64 from "react-file-base64";
import axios from "axios";

const MultipleImages = () => {
  const [file, setFile] = useState("");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const getFile = (files) => {
    const newFile = [];
    if (files.length > 5) {
      setFile("");
      setError("You can only upload 5 images at once");
    } else {
      setError(null);
      files.map((f) => {
        newFile.push(f.base64);
      });
      setFile(newFile);
    }
  };

  const handleUpload = async () => {
    if (result === null) {
      console.log(process.env.REACT_APP_SERVER);
      const url = process.env.REACT_APP_SERVER + "/user/attendancerecognition";
      setLoading(true);
      await axios
        .post(
          url,
          { images: file },
          {
            headers: { Authorization: sessionStorage.getItem("token") },
          }
        )
        .then((res) => {
          setShowImage(true);
          if (res.status === 200) setResult(res.data);
          else setResult(null);
          console.log(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.response.data.msg);
          setLoading(false);
        });
    } else {
      setResult(null);
      setError(null);
      setFile("");
      setShowImage(false);
    }
  };

  return (
    <>
      <Typography variant='h4' p={3}>
        Multiple Images Recognition
      </Typography>
      <Grid container>
        <Grid item xs={showImage ? 9 : 12}>
          <Stack mt={2} spacing={3} justifyContent='center'>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <FileBase64
                value={file}
                multiple={true}
                onDone={(file) => {
                  getFile(file);
                }}
              />
            </div>
            <Grid container justifyContent='center'>
              {file !== "" &&
                file.map((f, i) => {
                  return (
                    <img
                      key={i}
                      src={f}
                      style={{
                        maxWidth: "450px",
                        margin: "20px",
                        objectFit: "cover",
                      }}
                      alt='uploaded'
                    />
                  );
                })}
            </Grid>
            {error && (
              <Typography variant='h5' color='error' align='center'>
                {error}
              </Typography>
            )}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {loading && <CircularProgress />}
              <Button
                variant='contained'
                color='primary'
                onClick={handleUpload}
              >
                {showImage ? "Reset" : "Upload"}
              </Button>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={showImage ? 2.5 : 0}>
          {showImage && (
            <Typography variant='h6' mb={3}>
              The Recognized people in the images are:
            </Typography>
          )}
          <Stack spacing={3} justifyContent='center'>
            {result !== null &&
              showImage &&
              result.recognizedPeople.map((p, i) => {
                return (
                  <Grid container key={i} justifyContent='start'>
                    <Grid item xs={2}>
                      <Avatar
                        src={
                          process.env.REACT_APP_IMAGE +
                          `/user_images/uploads/${p.img}`
                        }
                        alt={p.name}
                        mr={3}
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography variant='h6'>{p.name}</Typography>
                    </Grid>
                  </Grid>
                );
              })}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default MultipleImages;
