import { useState, useEffect, useRef } from "react";
import {
  Grid,
  Typography,
  Box,
  Button,
  Popover,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import { IoMdAddCircle } from "react-icons/io";
import { AiOutlineHistory, AiOutlineUser } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { logOut } from "../../Redux/reducers/admin";
import axios from "axios";

const Navbar = ({ setOptionAdd }) => {
  const dispatch = useDispatch();
  const [history, setHistory] = useState(null);
  const admin = useSelector((state) => state.admin.username);
  const [openAdminHistory, setOpenAdminHistory] = useState(false);
  const [openUserHistory, setOpenUserHistory] = useState(false);
  const [userHis, setUserHis] = useState(null);
  const userHistory = useRef();
  const adminHistory = useRef();
  const handleAdd = () => {
    setOptionAdd(true);
  };
  const getHistory = async () => {
    const url = process.env.REACT_APP_SERVER + "/admin/adminlog";
    await axios
      .post(
        url,
        { admin_name: admin },
        {
          headers: { Authorization: sessionStorage.getItem("token") },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) setHistory(res.data);
        else setHistory(null);
      })
      .catch((err) => console.log(err));
  };

  const handleOpenAdmin = () => {
    setOpenAdminHistory((prev) => !prev);
  };
  //User History
  const getUserHistory = async () => {
    const url = process.env.REACT_APP_SERVER + "/admin/users/capturelog";
    await axios
      .get(url, {
        headers: { Authorization: sessionStorage.getItem("token") },
      })
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) setUserHis(res.data);
        else setUserHis(null);
      })
      .catch((err) => console.log(err));
  };
  const handleOpenUser = () => {
    setOpenUserHistory((prev) => !prev);
  };
  useEffect(() => {
    getHistory();
    getUserHistory();
  }, []);

  return (
    <>
      <Box sx={{ px: 3 }}>
        <Grid container spacing={2} justifyContent='center' alignItems='center'>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography variant='h4'>Admin Page</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={2} lg={2}>
            <Button
              ref={adminHistory}
              variant='contained'
              onClick={handleOpenAdmin}
              color='primary'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              fullWidth
              component={motion.div}
              startIcon={<AiOutlineHistory />}
            >
              History
            </Button>
            <Popover
              open={openAdminHistory}
              anchorEl={adminHistory.current}
              onClose={handleOpenAdmin}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {history === null ? (
                <Typography variant='body1'>
                  The current user has not made any modifications
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Change On</TableCell>
                        <TableCell align='right'>Change Type</TableCell>
                        <TableCell align='right'>Change Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {history.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align='right'>{item.change_on}</TableCell>
                          <TableCell align='right'>
                            {item.change_type}
                          </TableCell>
                          <TableCell align='right'>
                            {item.change_time}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Popover>
          </Grid>
          <Grid item xs={6} sm={6} md={2} lg={2}>
            <Button
              variant='contained'
              ref={userHistory}
              onClick={handleOpenUser}
              color='primary'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              fullWidth
              component={motion.div}
              startIcon={<AiOutlineUser />}
            >
              User Mod
            </Button>
            <Popover
              open={openUserHistory}
              anchorEl={userHistory.current}
              onClose={handleOpenUser}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {userHis === null || userHis.length === 0 ? (
                <Typography variant='body1'>
                  No capture log has been enabled
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Change On</TableCell>
                        <TableCell align='right'>Change Type</TableCell>
                        <TableCell align='right'>Change Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userHis.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align='right'>{item.change_on}</TableCell>
                          <TableCell align='right'>
                            {item.change_type}
                          </TableCell>
                          <TableCell align='right'>
                            {item.change_time}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Popover>
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={2}
            lg={2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              variant='contained'
              color='primary'
              startIcon={<IoMdAddCircle />}
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAdd}
              fullWidth
            >
              Add
            </Button>
          </Grid>
          <Grid item xs sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant='outlined'
              color='primary'
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(logOut())}
              fullWidth
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Navbar;
