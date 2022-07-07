import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  InputBase,
  TextField,
  Typography,
  Button,
  InputAdornment,
  InputProps,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../Redux/reducers/admin";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

import validator from "validator";
const axios = require("axios");

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const isLoading = useSelector((state) => state.admin.loading);
  const isLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const loginError = useSelector((state) => state.admin.error);
  const [errors, setErrors] = useState(null);
  const [password, setPassword] = useState(true);

  //UseEffects
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      navigate("/admin");
    }
  }, [isLoggedIn, isLoading]);

  useEffect(() => {
    if (errors) {
      if (!errors.username && !errors.password) {
        console.log("In login useEffect");
        dispatch(adminLogin(values));
      }
    }
  }, [values, errors]);

  const handlePassword = () => {
    setPassword((prev) => !prev);
  };

  const handleSubmit = () => {
    setErrors({});
    if (validator.isEmpty(values.username)) {
      setErrors((prev) => ({ ...prev, username: "Invalid email" }));
    }
    if (validator.isEmpty(values.password)) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        spacing: 3,
      }}
    >
      <Typography variant='h3' align='center' component='b' sx={{ mt: 3 }}>
        Login
      </Typography>
      <Box sx={{ width: "600px", mt: 3 }}>
        <TextField
          value={values.username}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, username: e.target.value }))
          }
          label='Username or Email'
          error={errors && errors.username && errors.username.length > 0}
          helperText={errors && errors.username}
          fullWidth
          variant='outlined'
        />
      </Box>
      <Box sx={{ width: "600px", mt: 3 }}>
        <TextField
          value={values.password}
          type={password ? "password" : "text"}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, password: e.target.value }))
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position='end' sx={{ cursor: "pointer" }}>
                {password ? (
                  <AiOutlineEye size={25} onClick={handlePassword} />
                ) : (
                  <AiOutlineEyeInvisible size={25} onClick={handlePassword} />
                )}
              </InputAdornment>
            ),
          }}
          label='Password'
          error={errors && errors.password && errors.password.length > 0}
          helperText={errors && errors.password}
          fullWidth
          variant='outlined'
        />
      </Box>
      <Button
        variant='contained'
        size='large'
        sx={{ mt: 3 }}
        onClick={handleSubmit}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;
