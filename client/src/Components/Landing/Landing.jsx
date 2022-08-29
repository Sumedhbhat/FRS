import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import background from "./assets/wave-haikei.png";
import side1 from "./assets/2.png";
import side2 from "./assets/3.jpg";
import { HiUserGroup } from "react-icons/hi";
import { BsCameraVideo } from "react-icons/bs";
import { RiAdminLine } from "react-icons/ri";
import { BiTimer } from "react-icons/bi";
import Navbar from "./Navbar";
import sample from "./assets/sample.jpeg";
import silfralogo from "./assets/silfralogo.png";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const features = [
    {
      name: "Attendance Management",
      description:
        "Check and verify the number of people in a group of images and check their verification",
      icons: <HiUserGroup size={50} />,
    },
    {
      name: "Real Time Face Detection",
      description:
        "Check if there is a user infront of the camera and if the user is registered in the system",
      icons: <BsCameraVideo size={50} />,
    },
    {
      name: "Secure",
      description:
        "All the identified users can be seen only by the admin provided with his username and password",
      icons: <RiAdminLine size={50} />,
    },
    {
      name: "Efficient and Accurate",
      description:
        "Predicts if the face is registered in the system with the most accuracy and the minimalistic time",
      icons: <BiTimer size={50} />,
    },
  ];

  return (
    <div>
      <Box sx={{}}>
        <Navbar />
        <Grid
          container
          sx={{
            background: "rgb(2,0,36)",
            background:
              "linear-gradient(288deg, rgba(2,0,36,1) 0%, rgba(255,255,255,1) 0%, rgba(152,239,240,1) 100%)",
          }}
        >
          <Grid
            item
            xs={12}
            px={8}
            py={10}
            height={"70vh"}
            sm={6}
            alignItems='center'
            display='flex'
            justifyContent='center'
            sx={{
              // backgroundImage: `url(${background})`,
              backgroundPosition: "bottom",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <Typography variant='h2' align='center'>
              Introducing the Face Recognition System
            </Typography>
          </Grid>
          <Grid item xs={12} height={"70vh"} sm={6}>
            <Box
              sx={{ width: "100%", height: "100%" }}
              display='flex'
              justifyContent={"center"}
              alignItems={"center"}
            >
              <img src={side1} alt='' />
            </Box>
          </Grid>
        </Grid>
        <Stack>
          <Typography variant='h3' align='center' py={4}>
            Features
          </Typography>
          <Grid container>
            {features &&
              features.map(({ icons, name, description }, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Stack
                    spacing={2}
                    py={5}
                    px={7}
                    justifyContent='center'
                    display='flex'
                    alignItems={"center"}
                    sx={{ maxWidth: "250px", mx: "auto" }}
                  >
                    <Box display='flex' justifyContent={"center"}>
                      {icons}
                    </Box>
                    <Typography variant='h6' align='center'>
                      {name}
                    </Typography>
                    <Typography variant='body1' align='center'>
                      {description}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
          </Grid>
          <Grid container columnSpacing={3}>
            <Grid item xs={12} md={6}>
              <Box p={3}>
                <img
                  src={sample}
                  alt='sample Image'
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    borderRadius: "20px",
                  }}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              display='flex'
              justifyContent='center'
              flexDirection={"column"}
              p={3}
            >
              <Stack spacing={3}>
                <Typography variant='h4'>Real time Face Recognition</Typography>
                <Typography variant='body1'>
                  A model that can recognize the face of the user and show all
                  the results in the right screen.
                </Typography>
                <Box>
                  <Button
                    variant='contained'
                    size='large'
                    onClick={() => navigate("/pic-capture2")}
                  >
                    Try it Out
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              xs={12}
              md={6}
              display='flex'
              justifyContent='center'
              flexDirection={"column"}
              p={3}
            >
              <Stack spacing={3}>
                <Typography variant='h4'>Attendance Management</Typography>
                <Typography variant='body1'>
                  Recognizes the number of people present in a group of pictures
                  and shows the number the number of people recognized as the
                  output.
                </Typography>
                <Box>
                  <Button
                    variant='contained'
                    size='large'
                    onClick={() => navigate("/multiple-images")}
                  >
                    Try it Out
                  </Button>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box p={3}>
                <img
                  src={sample}
                  alt='sample Image'
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    borderRadius: "20px",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              background: "rgb(2,0,36)",
              background:
                "linear-gradient(288deg, rgba(2,0,36,1) 0%, rgba(255,255,255,1) 0%, rgba(152,239,240,1) 100%)",
            }}
          >
            <Typography variant='h3' align='center' py={4}>
              About Us
            </Typography>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Box p={3}>
                  <img
                    src={silfralogo}
                    alt='Silfra Tech Logo'
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                      borderRadius: "20px",
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                display='flex'
                justifyContent='center'
                flexDirection={"column"}
                p={3}
              >
                <Stack spacing={3}>
                  <Typography variant='h4'>Silfra Technologies</Typography>
                  <Typography variant='body1'>
                    <p>
                      We are headquartered in Bangalore, India with branches in
                      Pune and Chennai. Our leadership team comprises of season
                      IT professionals with more than 100 years of work
                      experience in fortune 500 companies.
                    </p>
                    <p>
                      We are passionate about leveraging technology to make
                      world a better place. Leverage data insights to improve
                      business decisions. Bring Superior technology to Business.
                    </p>
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <Box display='flex' width='100%' justifyContent={"center"}>
            <Stack minWidth={"700px"} display='flex' justifyContent={"center"}>
              <Typography variant='h3' align='center' py={4}>
                Contact Us
              </Typography>
              <Box component='form'>
                <Stack p={3} spacing={3}>
                  <TextField variant='standard' label='Name' />
                  <TextField variant='standard' label='Email' />
                  <TextField variant='standard' label='Contact Number' />
                  <Button type='submit' variant='contained' size='large'>
                    Submit
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
        <Footer />
      </Box>
    </div>
  );
};

export default Landing;
