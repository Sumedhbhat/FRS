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
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { BsFillLockFill } from "react-icons/bs";
import axios from "axios";
import { CircularProgress } from "@mui/material";

export default function ForgotPassword({ setForgotPass }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!open) {
      setLoading(true);
      await axios
        .post(
          process.env.REACT_APP_SERVER + "/admin/generateotp",
          {
            email,
          },
          {
            headers: { Authorization: sessionStorage.getItem("token") },
          }
        )
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            setOpen(true);
          } else {
            setError(res.data.msg);
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(err.response.data.msg);
        });
    } else {
      setLoading(true);
      await axios
        .post(
          process.env.REACT_APP_SERVER + "/admin/resetpassword",
          {
            email,
            newPass,
            otp,
          },
          {
            headers: { Authorization: sessionStorage.getItem("token") },
          }
        )
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            setForgotPass(false);
            setOpen(false);
          } else {
            setError(res.data.msg);
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(err.response.data.msg);
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
          Forgot Password
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='email'
            autoFocus
          />
          {open && (
            <>
              <TextField
                margin='normal'
                required
                fullWidth
                name='otp'
                label='OTP'
                type='text'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                id='otp'
                autoComplete='otp'
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='New Password'
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                type='password'
                id='password'
                autoComplete='current-password'
              />
            </>
          )}
          {loading && (
            <CircularProgress display='flex' justifyContent={"center"} />
          )}
          {error && <Typography color='error'>{error}</Typography>}
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            {open ? "Set New Password" : "Generate OTP"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
