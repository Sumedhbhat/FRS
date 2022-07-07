import React from "react";
import {
  Grid,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

const CardPage = () => {
  return (
    <>
      <Card>
        <CardMedia
          alt='avatar'
          component='img'
          src='https://mdbcdn.b-cdn.net/img/new/avatars/2.webp'
          height='200'
        />
        <CardContent>
          <Typography align='center'>Suresh</Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default CardPage;
