import { useState } from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { MdKeyboardArrowUp } from "react-icons/md";
import { motion } from "framer-motion";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { filterUsers } from "../../../Redux/functions/userFunctions";

const Search = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState([]);
  const [city, setCity] = useState([]);
  const [department, setDepartment] = useState([]);
  const [gender, setGender] = useState([""]);
  const [date, setDate] = useState([null, "after"]);
  const [click, setClick] = useState(false);

  const handleSubmit = () => {
    console.log(city.length);
    var values = {};
    if (name.length !== 0 && name[0] !== "") {
      values.name = name;
    } else {
      delete values.name;
    }
    if (city.length !== 0 && city[0] !== "") {
      values.city = city;
    }
    if (department.length !== 0 && department[0] !== "") {
      values.department = department;
    }
    if (gender[0] !== "") {
      values.gender = gender;
    }
    if (date[0] !== null) {
      values.date_created = date;
    }
    console.log(values);
    dispatch(filterUsers(values));
  };

  return (
    <>
      <Grid
        container
        columnGap={3}
        rowGap={3}
        sx={{
          flexDirection: ["column", "column", "row"],
          display: [click ? "none" : "flex", click ? "none" : "flex", "flex"],
        }}
      >
        <Grid item xs>
          <TextField
            label='Name'
            variant='outlined'
            value={name && name.join(" ")}
            onChange={(e) => {
              setName(e.target.value.split(" "));
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs>
          <FormControl fullWidth>
            <InputLabel id='genderId'>Gender</InputLabel>
            <Select
              label='Gender'
              labelId='genderId'
              value={gender[0]}
              onChange={(e) => setGender([e.target.value])}
            >
              <MenuItem value='M'>Male</MenuItem>
              <MenuItem value='F'>Female</MenuItem>
              <MenuItem value='O'>Prefer not to say</MenuItem>
              <MenuItem value=''>Clear</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs>
          <TextField
            label='City'
            variant='outlined'
            value={city && city.join(" ")}
            onChange={(e) => {
              setCity(e.target.value.split(" "));
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs>
          <TextField
            label='Department'
            variant='outlined'
            value={department && department.join(" ")}
            onChange={(e) => {
              setDepartment(e.target.value.split(" "));
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DesktopDatePicker
              label='Date desktop'
              inputFormat='DD/MM/YYYY'
              value={date[0]}
              fullWidth
              onChange={(e) => {
                setDate((prev) => [e, prev[1]]);
                console.log(date[0].format("DD-MM-YYYY"));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs>
          <FormControl fullWidth>
            <InputLabel id='zoneId'>Zone</InputLabel>
            <Select
              label='Gender'
              labelId='zoneId'
              value={date[1]}
              onChange={(e) => setDate((prev) => [prev[0], e.target.value])}
            >
              <MenuItem value='before'>Before</MenuItem>
              <MenuItem value='after'>After</MenuItem>
              <MenuItem value='at'>At</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Button onClick={handleSubmit} variant='contained'>
          Search
        </Button>
      </Grid>
      {click ? (
        <Button
          sx={{
            display: [click ? "flex" : "none", click ? "flex" : "none", "none"],
          }}
          onClick={() => setClick(false)}
          variant='contained'
        >
          Search
        </Button>
      ) : (
        <IconButton
          className=''
          variant='outlined'
          sx={{
            display: [click ? "none" : "flex", click ? "none" : "flex", "none"],
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setClick(true)}
        >
          <MdKeyboardArrowUp size={30} />
        </IconButton>
      )}
    </>
  );
};

export default Search;
