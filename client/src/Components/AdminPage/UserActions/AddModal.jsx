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
  CircularProgress,
  Typography,
} from "@mui/material";
import validator from "validator";
import "../Admin.css";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../../../Redux/functions/userFunctions";
import { reset } from "../../../Redux/reducers/image";
import { resetUser } from "../../../Redux/reducers/userReducer";

const AddModal = ({ addOpen, setAddOpen }) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    name: "",
    gender: "",
    city: "",
    department: "",
    mob_no: "",
  });
  const [errors, setErrors] = useState(null);
  const count = useSelector((state) => state.user.count);
  const error = useSelector((state) => state.user.error.addUser);
  const loading = useSelector((state) => state.user.loading.addUser);
  const result = useSelector((state) => state.user.result.addUser);
  useEffect(() => {
    // console.log(image);
    if (
      errors &&
      Object.values(errors).filter((errors) => errors.length !== 0).length === 0
    ) {
      dispatch(addUser(values));
      return () => {
        dispatch(reset());
        dispatch(resetUser());
      };
    }
  }, [errors]);

  useEffect(() => {
    if (error === null && loading === false && result !== null) {
      console.log("here");
      console.log(error === null);
      console.log(loading === false);
      console.log(result !== null);
      setAddOpen(false);
      return () => {
        setValues({
          name: "",
          gender: "",
          city: "",
          department: "",
          mob_no: "",
        });
      };
    }
  }, [count, error, loading, result]);

  const handleClose = () => {
    setAddOpen(false);
    dispatch(reset());
    dispatch(resetUser());
  };

  const handleSubmit = () => {
    setErrors({});
    var er = {
      name: "",
      gender: "",
      city: "",
      department: "",
      mob_no: "",
    };
    if (validator.isEmpty(values.name)) {
      // setErrors((prev) => ({ ...prev, name: "Name is required" }));
      er = { ...er, name: "Name is required" };
    }
    if (validator.isEmpty(values.gender)) {
      // setErrors((prev) => ({ ...prev, gender: "Gender is Required" }));
      er = { ...er, gender: "Gender is required" };
    }
    if (validator.isEmpty(values.city)) {
      // setErrors((prev) => ({ ...prev, city: "Please enter the cities name" }));
      er = { ...er, city: "city is required" };
    }
    if (validator.isEmpty(values.department)) {
      // setErrors((prev) => ({
      // ...prev,
      // department: "Please enter the department",
      // }));
      er = { ...er, department: "Enter the department" };
    }
    if (validator.isEmpty(values.mob_no)) {
      // setErrors((prev) => ({
      // ...prev,
      // mob_no: "Please enter the mobile number",
      // }));
      er = { ...er, mob_no: "please enter the mob_no" };
    }
    setErrors(er);
    // setModals((prev) => ({ ...prev, addOpen: false }));

    console.log(errors);
    console.log(values);
  };

  const handleReset = () => {
    setValues({
      name: "",
      gender: "",
      city: "",
      department: "",
      mob_no: "",
    });
    setAddOpen(false);
    setErrors(null);
    dispatch(resetUser());
    dispatch(reset());
  };

  return (
    <Modal closeAfterTransition open={addOpen} onClose={handleClose}>
      <Fade in={addOpen}>
        <Stack spacing={3} className='addModalStack'>
          <TextField
            error={errors && errors.name.length !== 0}
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            label='Name'
            helperText={errors && errors.name}
            variant='outlined'
            fullWidth
          />
          <FormControl error={errors && errors.gender.length !== 0} fullWidth>
            <InputLabel id='genderId'>Gender</InputLabel>
            <Select
              label='Gender'
              labelId='genderId'
              value={values.gender}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, gender: e.target.value }))
              }
            >
              <MenuItem value='M'>Male</MenuItem>
              <MenuItem value='F'>Female</MenuItem>
              <MenuItem value='O'>Prefer not to say</MenuItem>
            </Select>
            <FormHelperText>{errors && errors.gender}</FormHelperText>
          </FormControl>
          <TextField
            error={errors && errors.city.length !== 0}
            value={values.city}
            helperText={errors && errors.city}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, city: e.target.value }))
            }
            label='City'
            variant='outlined'
            fullWidth
          />
          <TextField
            error={errors && errors.department.length !== 0}
            value={values.department}
            helperText={errors && errors.department}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, department: e.target.value }))
            }
            label='Department'
            variant='outlined'
            fullWidth
          />
          <TextField
            error={errors && errors.mob_no.length !== 0}
            value={values.mob_no}
            helperText={errors && errors.mob_no}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, mob_no: e.target.value }))
            }
            label='Mobile No'
            variant='outlined'
            fullWidth
          />
          {loading && <CircularProgress />}
          {!loading && error && (
            <Typography variant='body2'>{error}</Typography>
          )}
          <Box className='addModalBox'>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={handleSubmit}
            >
              Add
            </Button>
          </Box>
          <Box className='addModalBox'>
            <Button
              variant='outlined'
              color='secondary'
              fullWidth
              onClick={handleReset}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </Fade>
    </Modal>
  );
};

export default AddModal;
