import { Grid, Box, Stack, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CardPage from "../CardPage";

const AdminPage = () => {
  return (
    <Container maxWidth='lg' sx={{ py: 5 }}>
      <Stack spacing={5}>
        <Typography variant='h2'>Known Faces</Typography>
        <Grid container rowSpacing={4} columnSpacing={4}>
          {[...Array(20)].map((x, index) => (
            <Grid key={index} item xs={2}>
              <CardPage />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};

export default AdminPage;
