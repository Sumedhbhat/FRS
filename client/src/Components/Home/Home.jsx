import { useState, useEffect } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "column",
          spacing: 3,
        }}
      >
        <Typography variant='h2' align='center'>
          Welcome to Face Recognition System
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Button
            variant='contained'
            size='large'
            sx={{ mb: "20px" }}
            onClick={() => navigate("/login")}
          >
            Login as Admin
          </Button>
          <Button
            variant='contained'
            size='large'
            onClick={() => navigate("/take-picture")}
          >
            Start using the System
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Home;
