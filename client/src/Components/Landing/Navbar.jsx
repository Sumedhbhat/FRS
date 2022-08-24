import React from "react";
import { Grid, Box } from "@mui/material";
import logo from "./assets/logo5121.png";
const Navbar = () => {
  return (
    <Grid container sx={{ height: "70px" }}>
      <Grid item xs={1}>
        <Box
          sx={{ width: "100%", height: "100%" }}
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <img src={logo} alt='Logo' width={"60px"} height={"60px"} />
        </Box>
      </Grid>
      <Grid item xs={5}></Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  );
};

export default Navbar;
