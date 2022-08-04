import { Button, Stack, Grid, Typography } from "@mui/material";
import { useState } from "react";
import FileBase64 from "react-file-base64";

const MultipleImages = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const getFile = (files) => {
    const newFile = [];
    if (files.length > 5) {
      setFile(null);
      setError("You can only upload 5 images at once");
    } else {
      setError(null);
      files.map((f) => {
        newFile.push(f.base64);
      });
      setFile(newFile);
    }
    console.log(newFile);
  };
  return (
    <Stack mt={2} spacing={3} justifyContent='center'>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <FileBase64
          multiple={true}
          onDone={(file) => {
            getFile(file);
          }}
        />
      </div>
      <Grid container justifyContent='center'>
        {file &&
          file.map((f, i) => {
            return (
              <img
                key={i}
                src={f}
                style={{ maxWidth: "450px", margin: "20px" }}
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
          justifyContent: "center",
        }}
      >
        <Button size='large' variant='contained' color='primary'>
          Upload
        </Button>
      </div>
    </Stack>
  );
};

export default MultipleImages;
