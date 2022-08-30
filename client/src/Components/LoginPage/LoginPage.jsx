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
import SignUp from "./SignUp";
import SignIn from "./Signin";
const axios = require("axios");

const LoginPage = () => {
  const [loginType, setLoginType] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (loginType) {
    return <SignUp setLoginType={setLoginType} />;
  } else {
    return <SignIn setLoginType={setLoginType} />;
  }
};

export default LoginPage;
