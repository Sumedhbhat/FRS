import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { BsFillLockFill } from "react-icons/bs";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    await axios
      .post(process.env.REACT_APP_SERVER + "/admin/generateresetlink", {
        email,
      })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          toast.success("Activation Link has been sent to you email");
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
          {loading && (
            <CircularProgress
              display='flex'
              sx={{ display: "flex", justifyContent: "center" }}
            />
          )}
          {error && <Typography color='error'>{error}</Typography>}
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Generate Activation Link
          </Button>
          <Button
            fullWidth
            variant='contained'
            onClick={() => navigate("/login")}
            sx={{ mt: 3, mb: 2 }}
          >
            Return to Login Screen
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
