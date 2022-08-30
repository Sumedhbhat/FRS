import { Typography, Box } from "@mui/material";

const Footer = () => {
  return (
    <div>
      <Box py={3} sx={{ backgroundColor: "#555", color: "white" }}>
        <Typography variant='body1' align='center'>
          Face Recognition System by SilfraTech
        </Typography>
      </Box>
    </div>
  );
};

export default Footer;
