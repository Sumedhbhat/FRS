import { useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Container,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "../../Redux/reducers/getFace";

const ResultPage = () => {
  //Variable Declaration
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const [result, setResult] = useState(params.get("userId"));
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.result.loading);
  const user = useSelector((state) => state.result.user);
  const error = useSelector((state) => state.result.error);

  //Use Effect
  useEffect(() => {
    dispatch(getUser(result));
  }, [result]);

  //Function Declaration
  return (
    <>
      <Container maxWidth='lg' sx={{ py: 3 }}>
        {loading && <CircularProgress />}
        {!loading && (
          <Stack spacing={2} justifyContent='center'>
            <Box className=''></Box>
            <h1 align='center'>Hello, {user.name}</h1>
            <h2 align='center'>Department: {user.department}</h2>
            <h2 align='center'>
              Gender:{" "}
              {user.gender === "M"
                ? "Male"
                : user.gender === "F"
                ? "F"
                : "You have preferred not to say"}
            </h2>
            <Box sx={{ mx: "auto" }}>
              <Button
                variant='contained'
                size='large'
                onClick={() => navigate("/take-picture")}
              >
                Check Another Face
              </Button>
            </Box>
          </Stack>
        )}
      </Container>
    </>
  );
};

export default ResultPage;
