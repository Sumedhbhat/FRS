import { useState, useEffect } from "react";
import { Grid, Box, IconButton, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import {
  deleteUser,
  getUser,
  getDisplayUser,
} from "../../Redux/functions/userFunctions";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import DeleteConfirm from "./UserActions/DeleteConfirm";
import ModifyModal from "./UserActions/ModifyModal";
import UploadPic from "./UserActions/UploadPic";
import ImageCapture from "./UserActions/ImageCapture";
import OptionAdd from "./UserActions/OptionAdd";

const UserCard = ({ user, setClick }) => {
  const dispatch = useDispatch();
  const [modifyOptionAdd, setModifyOptionAdd] = useState(false);
  const [modify, setModify] = useState(false);
  const [modifyTakePic, setModifyTakePic] = useState(false);
  const [modifyUploadPic, setModifyUploadPic] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const count = useSelector((state) => state.user.count);
  useEffect(() => {
    dispatch(getDisplayUser(user.user_id));
  }, [count]);

  const handleDelete = () => {
    setDeleteConfirm(true);
  };
  const handleModify = (id) => {
    // setSelUser(user);
    dispatch(getUser(id));
    setModify(true);
  };

  const handleClick = (id) => {
    setClick(true);
    dispatch(getDisplayUser(id));
  };

  return (
    <>
      <OptionAdd
        setModifyOptionAdd={setModifyOptionAdd}
        modifyOptionAdd={modifyOptionAdd}
        setModifyTakePic={setModifyTakePic}
        setModifyUploadPic={setModifyUploadPic}
      />
      <ImageCapture
        setModifyTakePic={setModifyTakePic}
        setModify={setModify}
        modifyTakePic={modifyTakePic}
      />
      <UploadPic
        setModifyUploadPic={setModifyUploadPic}
        modifyUploadPic={modifyUploadPic}
        setModify={setModify}
      />
      <ModifyModal
        setModify={setModify}
        modify={modify}
        setModifyOptionAdd={setModifyOptionAdd}
      />
      <DeleteConfirm
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        user_id={user.user_id}
      />
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2.5}
        key={user}
        sx={{ mx: "auto", display: "flex" }}
        justifyContent='center'
      >
        <Box className='adminPageBox'>
          <Box className='backdrop' onClick={() => handleClick(user.user_id)} />
          <img
            onClick={handleClick}
            src={require(`../../../../user_images/uploads/${user.base_img}`)}
            alt=''
            className='adminPageImage'
          />
          <Button
            variant='contained'
            className='imageModify'
            component={motion.div}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleModify(user.user_id)}
          >
            Modify
          </Button>
          <IconButton
            className='imageDelete'
            variant='contained'
            component={motion.span}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDelete()}
          >
            <Box className='buttonBox'>
              <MdDelete color='white' size={30} />
            </Box>
          </IconButton>
        </Box>
      </Grid>
    </>
  );
};

export default UserCard;
