import { useState, useEffect } from "react";
import {
  Stack,
  Grid,
  Box,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Modal,
  Fade,
  Button,
} from "@mui/material";
import ModifyModal from "./ModifyModal";

const TableUserRow = ({ user, modifyOpen, setModifyOpen }) => {
  const handleModify = (id) => {
    setModifyOpen(true);
  };

  console.log(user);
  const handleDelete = (id) => {};
  return (
    <>
      <ModifyModal
        setModifyOpen={setModifyOpen}
        modifyOpen={modifyOpen}
        user={user}
      />

      <TableRow key={user.user_id}>
        <TableCell>{user.user_id}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.gender}</TableCell>
        <TableCell>{user.city}</TableCell>
        <TableCell>{user.department}</TableCell>
        <TableCell>{user.mob_no}</TableCell>
        <TableCell>{user.user_added_date}</TableCell>
        <TableCell>
          <Button variant='outlined' onClick={() => handleModify(user.user_id)}>
            Modify
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant='contained'
            color='error'
            onClick={() => handleDelete(user.user_id)}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TableUserRow;
