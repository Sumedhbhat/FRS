import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { BsFillLockFill } from "react-icons/bs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";
import { CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

export default function SignIn({ setLoginType }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forgotPass, setForgotPass] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await axios
      .post(process.env.REACT_APP_SERVER + "/admin/login", {
        email,
        password,
      })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          sessionStorage.setItem("token", res.data.token);
          navigate("/admin");
        } else {
          setError(res.data.msg);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response.data.msg);
      });
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <BsFillLockFill />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            label='Email Address'
            autoComplete='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <TextField
            margin='normal'
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label='Password'
            type='password'
            autoComplete='current-password'
          />
          {error && (
            <Typography variant='body2' color='error'>
              {error}
            </Typography>
          )}
          {loading && <CircularProgress />}
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent={"space-between"}>
            <Grid item>
              <Link variant='body2' onClick={() => navigate("/forgotPassword")}>
                Forgot Password
              </Link>
            </Grid>
            <Grid item>
              <Link
                href='#'
                variant='body2'
                onClick={() => setLoginType((prev) => !prev)}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
}
