import { Button, Stack, Grid, Typography, Box ,CircularProgress} from "@mui/material";
import { useState } from "react";
import FileBase64 from "react-file-base64";
import axios from "axios";

const MultipleImages = () => {
  const [file, setFile] = useState("");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [loading,setLoading] = useState(false);
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
        .post(url, { images: file })
        .then((res) => {
          setResult(res.data);
          console.log(res.data);
          setLoading(false);
        })
        .catch((err) =>setError(err.response.data.msg));
      // setResult((prev) =>
      //   prev.map((p, index) => {
      //     return index === 3 ? [p[index][0], p[index][1].join(",")] : p[index];
      //   })
      // );
    } else {
      setResult(null);
      setError(null);
      setFile("");
    }
  };

  return (
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
        {file!=="" &&
          file.map((f, i) => {
            return (
              <img
                key={i}
                src={f}
                style={{ maxWidth: "450px", margin: "20px",objectFit:'cover' }}
              />
            );
          })}
      </Grid>
      {error && (
        <Typography variant='h5' color='error' align='center'>
          {error}
        </Typography>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Stack spacing={2}>
          {result &&<>
              <Typography  variant='h5' align='center'>
                {"Number of images uploaded"} :{result.uploaded}
              </Typography>
              <Typography  variant='h5' align='center'>
                {"Number of People Detected"} :{result.detected} 
              </Typography>
              <Typography  variant='h5' align='center'>
                {"Number of People Recognized"} :{result.recognized}
              </Typography>
              <Typography  variant='h5' align='center'>
                {"Names of People Found"} :{result.length>0?result.recognizedNames.join(' , '):"No People Found"}
              </Typography>
              </>
            }
          <Box mx={'auto'}>
          {loading && <CircularProgress />}
          </Box>
          <Box mx={"auto !important"}>
            <Button
              size='large'
              variant='contained'
              color='primary'
              onClick={handleUpload}
            >
              {result === null ? "Uploads" : "Upload Different Image"}
            </Button>
          </Box>
        </Stack>
      </div>
    </Stack>
  );
};

export default MultipleImages;
