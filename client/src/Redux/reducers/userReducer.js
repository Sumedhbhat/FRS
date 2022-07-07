import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  filterUsers,
  getDisplayUser,
  checkFace,
} from "../functions/userFunctions";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    user: {
      name: "",
      city: "",
      department: "",
      mob_no: "",
      gender: "",
      user_id: "",
    },
    user_id: "",
    loading: {},
    error: {},
    result: {},
    image: null,
    count: 0,
    newFace: false,
  },
  reducers: {
    addImage: (state, action) => {
      state.image = action.payload;
    },
    resetImage: (state, action) => {
      console.log("inside reset image");
      state.error.checkFace = null;
      state.image = null;
      state.newFace = false;
      state.error.checkFaceCode = null;
    },
    setUser: (state, action) => {
      state.user = state.users.filter((user) => user.id === action.payload)[0];
    },
    resetDisplayUser: (state, action) => {
      state.displayUser = null;
    },
    resetUser: (state, action) => {
      state.error.addUser = null;
      state.result.addUser = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addUser.pending, (state) => {
      state.loading.addUser = true;
      state.error.addUser = null;
      state.result.addUser = null;
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      console.log(action);
      state.count += 1;
      state.error.checkFace = null;
      state.loading.addUser = false;
      state.result.addUser = true;
    });
    builder.addCase(addUser.rejected, (state, action) => {
      console.log(action);
      state.count += 1;
      state.error.addUser = action.payload;
      state.loading.addUser = false;
      state.result.addUser = false;
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.loading.getUsers = false;
      state.error.getUsers = action.payload;
    });
    builder.addCase(getUsers.pending, (state) => {
      state.loading.getUsers = true;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      console.log(action);
      state.loading.getUsers = false;
      state.users = action.payload;
      state.error.getUsers = null;
    });
    builder.addCase(filterUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.error.filterUsers = null;
    });
    builder.addCase(filterUsers.rejected, (state, action) => {
      console.log(action.payload);
      state.error.filterUsers = action.payload;
    });
    builder.addCase(deleteUser.pending, (state) => {
      state.loading.deleteUser = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading.deleteUser = false;
      state.count += 1;
      // state.loading = false;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.error.deleteUser = action.payload;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      console.log(state.user);
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.error.getUser = action.payload;
    });
    builder.addCase(getDisplayUser.fulfilled, (state, action) => {
      state.loading.displayUser = false;
      state.displayUser = action.payload;
    });
    builder.addCase(getDisplayUser.pending, (state, action) => {
      state.loading.displayUser = true;
      state.displayUser = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.count += 1;
    });
    builder.addCase(getDisplayUser.rejected, (state, action) => {
      state.error.displayUser = action.payload;
    });
    builder.addCase(checkFace.pending, (state, action) => {
      state.loading.checkFace = true;
      state.error.checkFace = null;
      state.newFace = false;
    });
    builder.addCase(checkFace.fulfilled, (state, action) => {
      state.loading.checkFace = false;
      state.newFace = true;
    });
    builder.addCase(checkFace.rejected, (state, action) => {
      console.log(action.payload);
      console.log(state.loading);
      state.loading.checkFace = false;
      state.error.checkFace = action.payload.msg;
      state.error.checkFaceCode = action.payload.code;
      state.newFace = false;
    });
  },
});

export const { addImage, resetImage, setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
