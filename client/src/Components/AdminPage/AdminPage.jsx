import { useState, useEffect } from "react";
import {
  Stack,
  Grid,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
// import Modals from "./Modals";
import "./Admin.css";
import { useDispatch, useSelector } from "react-redux";
import { checkLogin, logOut } from "../../Redux/reducers/admin";
import { MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";
import Search from "./UserActions/Search";
import axios from "axios";
import AddModal from "./UserActions/AddModal";
import AddOptionAdd from "./UserActions/AddOptionAdd";
import AddImageCapture from "./UserActions/AddImageCapture";
import AddUploadPic from "./UserActions/AddUploadPic";

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [takePic, setTakePic] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [uploadPic, setUploadPic] = useState(false);
  const [optionAdd, setOptionAdd] = useState(false);
  const isLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const loadingAdminLogin = useSelector((state) => state.admin.loading);
  var users = useSelector((state) => state.user.users);
  var error = useSelector((state) => state.user.error);
  var loading = useSelector((state) => state.user.loading);
  var displayUser = useSelector((state) => state.user.displayUser);

  //UseEffect
  useEffect(() => {
    dispatch(checkLogin());
    if (!isLoggedIn && !loadingAdminLogin) {
      navigate("/");
    }
  }, [isLoggedIn, loadingAdminLogin]);

  if (!loadingAdminLogin && isLoggedIn) {
    return (
      <>
        <AddUploadPic
          uploadPic={uploadPic}
          setUploadPic={setUploadPic}
          setAddOpen={setAddOpen}
        />
        <AddImageCapture
          takePic={takePic}
          setTakePic={setTakePic}
          setAddOpenOne={setAddOpen}
        />
        <AddOptionAdd
          optionAdd={optionAdd}
          setOptionAdd={setOptionAdd}
          setTakePic={setTakePic}
          setUploadPic={setUploadPic}
        />
        <AddModal addOpen={addOpen} setAddOpen={setAddOpen} />

        {/* <Modals modals={modals} setModals={setModals} /> */}
        <Stack spacing={4} sx={{ py: 2, px: 3 }}>
          <Navbar setOptionAdd={setOptionAdd} optionAdd={optionAdd} />
          <Search />
          {error.getUsers && <h1>{error.getUsers}</h1>}
          {error.filterUsers && <h1>{error.filterUsers}</h1>}
          {loading.addUser && loading.deleteUser && loading.getUsers ? (
            <CircularProgress />
          ) : (
            <Grid
              container
              columnGap={2}
              justifyContent='space-between'
              flexDirection={["column-reverse", "column-reverse", "row"]}
            >
              <Grid item xs={click ? 12 : 12} md={click ? 9 : 12}>
                <Grid container gap={3} justifyContent='center'>
                  {!error.getUsers &&
                    !error.filterUsers &&
                    users !== null &&
                    users.map((user) => (
                      <UserCard
                        click={click}
                        setClick={setClick}
                        user={user}
                        key={user.user_id}
                      />
                    ))}
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                md={2.7}
                display={click ? "flex" : "none"}
                justifyContent='center'
              >
                {displayUser && (
                  <Box sx={{ mx: "auto" }}>
                    <Stack>
                      <IconButton onClick={() => setClick(false)}>
                        <IoMdClose size={30} />
                      </IconButton>
                      <img
                        src={`${process.env.REACT_APP_IMAGE}/uploads/${displayUser.base_img}`}
                        alt=''
                        className='adminPageImage'
                      />
                      <p>Name: {displayUser.name}</p>
                      <p>Gender: {displayUser.gender}</p>
                      <p>City: {displayUser.city}</p>
                      <p>Department: {displayUser.department}</p>
                    </Stack>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </Stack>
      </>
    );
  } else if (!isLoggedIn && !loadingAdminLogin) {
    return (
      <Typography variant='h5' align='center'>
        You are not logged in. Please log in to continue.
      </Typography>
    );
  } else {
    return <CircularProgress />;
  }
};

export default AdminPage;
