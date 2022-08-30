import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { BsFillLockFill } from "react-icons/bs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import validator from "validator";
import { useNavigate } from "react-router-dom";

export default function SignUp({ setLoginType }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (
      validator.isEmail(email) &&
      !validator.isEmpty(password) &&
      !validator.isEmpty(username)
    ) {
      await axios
        .post(process.env.REACT_APP_SERVER + "/admin/createadmin", {
          email,
          password,
          name: username,
        })
        .then((res) => {
          console.log(res);
          if (res.status != 200) {
            setError(res.data.msg);
          } else {
            toast(res.data.msg);
            setLoginType(false);
          }
        })
        .catch((err) => {
          setError(err.response.data.msg);
        });
    } else {
      if (!validator.isEmail(email)) setError("Please enter valid inputs");
      else if (validator.isEmpty(password))
        setError("Please enter a non empty password");
      else if (validator.isEmpty(username))
        setError("Please enter a non empty username");
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
          </Grid>
          {error && (
            <Box py={2}>
              <Typography align='center' variant='body1'>
                {" "}
                {error}
              </Typography>
            </Box>
          )}
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
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
      <ToastContainer />
    </Container>
  );
}
