import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Fade,
  Box,
  TextField,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { toast } from "react-toastify";
import validator from "validator";
import "../Admin.css";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../../Redux/functions/userFunctions";
import { reset, resetImage } from "../../../Redux/reducers/image";
import OptionAdd from "./OptionAdd";
const axios = require("axios");

const ModifyModal = ({ setModify, modify, setModifyOptionAdd }) => {
  const dispatch = useDispatch();
  const [clicked, setClicked] = useState(false);
  var user = { name: "", mob_no: "", department: "", city: "", gender: "" };
  const [values, setValues] = useState({
    name: "",
    city: "",
    department: "",
    mob_no: "",
    gender: user.gender,
  });
  const extension = useSelector((state) => state.image.extension);
  user = useSelector((state) => state.user.user);
  const [updated, setUpdated] = useState(user);
  const image = useSelector((state) => state.user.image);
  useEffect(() => {
    console.log(user);
    setUpdated(user);
    setValues({
      name: "",
      city: "",
      department: "",
      mob_no: "",
      gender: user.gender,
    });
    console.log(updated);
  }, [user]);

  useEffect(() => {
    if (clicked === true) {
      // dispatch(updateUser(updated));
      // setValues({});
      // setModals((prev) => ({ ...prev, modify: false }));
    }
  }, [updated]);

  const handleModify = (id) => {
    console.log(values);
    console.log(updated);
    setClicked(true);
    dispatch(updateUser(updated));
    dispatch(reset());
    setModify(false);
    return () => {
      setValues({
        name: "",
        city: "",
        department: "",
        mob_no: "",
        gender: "",
      });
    };
  };

  const handleReset = () => {
    setValues({
      name: "",
      city: "",
      department: "",
      mob_no: "",
      gender: user.gender,
    });
    dispatch(reset());
    setModify(false);
  };

  const handleImage = () => {
    setModifyOptionAdd(true);
    setModify(false);
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    if (e.target.value !== "") {
      setUpdated((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    } else {
      setUpdated((prev) => ({ ...prev, [e.target.name]: user[e.target.name] }));
    }
  };

  const handleImageReset = () => {
    dispatch(reset());
    setModify(false);
    setModifyOptionAdd(true);
  };

  return (
    <>
      <Modal
        open={modify}
        onClose={() => setModify(false)}
        closeAfterTransition
      >
        <Fade in={modify}>
          <Stack spacing={4} sx={{ py: 2, px: 3 }} className='modifyModalStack'>
            <TextField
              className='ModifyInput'
              value={values.name}
              onChange={(e) => handleChange(e)}
              name='name'
              placeholder={"Name: " + user.name}
              label='Name'
              variant='outlined'
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id='genderId'>Gender</InputLabel>
              <Select
                label='Gender'
                value={values.gender}
                onChange={(e) => handleChange(e)}
                name='gender'
                labelId='genderId'
                // value={values.gender}
                // onChange={(e) =>
                //   setValues((prev) => ({ ...prev, gender: e.target.value }))
                // }
              >
                <MenuItem value='M'>Male</MenuItem>
                <MenuItem value='F'>Female</MenuItem>
                <MenuItem value='O'>Prefer not to say</MenuItem>
              </Select>
            </FormControl>
            <TextField
              className='ModifyInput'
              value={values.city}
              placeholder={"City: " + user.city}
              onChange={(e) => handleChange(e)}
              name='city'
              label='City'
              variant='outlined'
              fullWidth
            />
            <TextField
              className='ModifyInput'
              value={values.department}
              onChange={(e) => handleChange(e)}
              placeholder={"Department: " + user.department}
              label='Department'
              name='department'
              variant='outlined'
              fullWidth
            />
            <TextField
              className='ModifyInput'
              value={values.mob_no}
              onChange={(e) => handleChange(e)}
              placeholder={"Mobile No: " + user.mob_no}
              label='Mobile No'
              name='mob_no'
              variant='outlined'
              fullWidth
            />
            <Box className='addModalBox'>
              {!image && (
                <Button
                  variant='contained'
                  color='primary'
                  fullWidth
                  onClick={() => handleImage()}
                >
                  {extension !== null ? "Change Image" : "Add Image"}
                </Button>
              )}
              {image && (
                <Button
                  variant='contained'
                  fullWidth
                  onClick={() => dispatch(reset())}
                >
                  Reset Image
                </Button>
              )}
            </Box>
            <Box className='addModalBox'>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                onClick={() => handleModify(user.user_id)}
              >
                Modify
              </Button>
            </Box>
            <Box className='addModalBox'>
              <Button
                variant='outlined'
                color='secondary'
                fullWidth
                onClick={() => handleReset()}
              >
                Cancel
              </Button>
            </Box>
          </Stack>
        </Fade>
      </Modal>
    </>
  );
};

export default ModifyModal;
