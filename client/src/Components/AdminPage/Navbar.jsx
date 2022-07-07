import { useState, useEffect } from "react";
import { Grid, Typography, Box, Container, Stack, Button } from "@mui/material";
import { IoMdAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { logOut } from "../../Redux/reducers/admin";

const Navbar = ({ setOptionAdd }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAdd = () => {
    setOptionAdd(true);
  };
  return (
    <>
      {/* <OptionAdd optionAdd={optionAdd} /> */}
      <Box sx={{ px: 3 }}>
        <Grid container spacing={2} justifyContent='center' alignItems='center'>
          <Grid item xs={12} sm={5} md={7.5} lg={8}>
            <Typography variant='h4'>Admin Page</Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sm={4}
            md={2}
            lg={2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              variant='contained'
              color='primary'
              startIcon={<IoMdAddCircle />}
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAdd}
              fullWidth
            >
              Add
            </Button>
          </Grid>
          <Grid item xs sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant='outlined'
              color='primary'
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(logOut())}
              fullWidth
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Navbar;
