import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { BsFillLockFill } from "react-icons/bs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUp({ setLoginType }) {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [OTP, setOTP] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!clicked) {
      await axios
        .post(process.env.REACT_APP_SERVER + "/admin/createadmin", {
          email,
          password,
          name: username,
        })
        .then((res) => {
          if (res.status != 200) {
            setError(res.data.msg);
            setClicked(false);
          } else {
            setClicked(true);
          }
        })
        .catch((err) => {
          setError(err.response.data.msg);
          setClicked(false);
        });
    } else {
      await axios
        .post(process.env.REACT_APP_SERVER + "/admin/checkotp", {
          email,
          otp: OTP,
        })
        .then((res) => {
          if (res.status != 200) {
            setError(res.data.msg);
            setClicked(false);
          } else {
            sessionStorage.setItem("username", username);
            setClicked(false);
            navigate("/admin");
          }
        })
        .catch((err) => {
          setError(err.response.data.msg);
          setClicked(false);
        });
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
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
          Sign up
        </Typography>
        <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete='user-name'
                name='username'
                required
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                label='User Name'
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete='email'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label='Password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete='new-password'
              />
            </Grid>
            {clicked && (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label='OTP'
                  value={OTP}
                  onChange={(e) => setOTP(e.target.value)}
                  type='text'
                />
              </Grid>
            )}
          </Grid>

          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            {!clicked ? "Sign Up" : "Verify OTP"}
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link
                variant='body2'
                onClick={() => setLoginType((prev) => !prev)}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
