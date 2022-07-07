import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addUser = createAsyncThunk(
  "user/addUserStatus",
  async (user, { getState, rejectWithValue }) => {
    const data = await axios
      .post("/admin/users/create", {
        ...user,
        user_id: getState().image.user_id,
        last_modified_by: getState().admin.username,
        extension: getState().image.extension,
        face_encoding: getState().image.face_encoding,
      })
      .then((res) => {
        console.log("inside add user function");
        console.log(res);
        if (res.status === 200) {
          return res.data;
        } else {
          return rejectWithValue(res.data.msg);
        }
      })
      .catch((err) => {
        console.log("inside console log add users");
        console.log(err);
        return rejectWithValue(err.response.data.msg);
      });
    return data;
  }
);

export const getUsers = createAsyncThunk(
  "user/getUsersStatus",
  async (obj, thunkAPI) => {
    const data = await axios
      .get(process.env.REACT_APP_SERVER + "/admin/dashboard")
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          return res.data;
        } else {
          return thunkAPI.rejectWithValue(res.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        return thunkAPI.rejectWithValue(err.response.data.msg);
      });
    return data;
  }
);

export const filterUsers = createAsyncThunk(
  "user/filterUsersStatus",
  async (filter, thunkAPI) => {
    console.log(filter);
    const data = await axios
      .post(process.env.REACT_APP_SERVER + "/admin/users/search", filter)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          return res.data;
        } else {
          return thunkAPI.rejectWithValue(res.data.msg);
        }
      })
      .catch((err) => console.log(err));
    return data;
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUserStatus",
  async (user_id, { rejectWithValue, getState }) => {
    console.log(user_id);
    const data = await axios
      .delete(process.env.REACT_APP_SERVER + "/admin/users", {
        params: {
          user_id: user_id,
        },
        data: { last_modified_by: getState().admin.username },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          return res.data.msg;
        } else {
          console.log(res.data);
          return rejectWithValue(res.data.msg);
        }
      })
      .catch((err) => rejectWithValue(err.response.data.msg));
    return data;
  }
);

export const getUser = createAsyncThunk(
  "user/getUserStatus",
  async (user_id, thunkAPI) => {
    const data = await axios
      .get(process.env.REACT_APP_SERVER + "/admin/users/?user_id=" + user_id)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          return thunkAPI.rejectWithValue(res.data);
        }
      })
      .catch((err) => console.log(err));
    console.log(data);
    return data;
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUserStatus",
  async (user, { getState, rejectWithValue }) => {
    user = {
      ...user,
      last_modified_by: getState().admin.username,
      extension: getState().image.extension,
      face_encoding: getState().image.face_encoding,
    };

    const data = axios
      .patch(
        process.env.REACT_APP_SERVER + "/admin/users/?user_id=" + user.user_id,
        user
      )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          return res.data;
        } else {
          return rejectWithValue(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        return rejectWithValue(err.response.data);
      });
    return data;
  }
);

export const getDisplayUser = createAsyncThunk(
  "user/getDisplayUserStatus",
  async (user_id, thunkAPI) => {
    const data = await axios
      .get(process.env.REACT_APP_SERVER + "/admin/users/?user_id=" + user_id)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          return thunkAPI.rejectWithValue(res.data);
        }
      })
      .catch((err) => console.log(err));
    console.log(data);
    return data;
  }
);

export const checkFace = createAsyncThunk(
  "user/checkFaceStatus",
  async (obj, { rejectWithValue, getState }) => {
    const image = getState().user.image;
    console.log(image);
    const data = await axios
      .post(process.env.REACT_APP_SERVER + "/admin/recognizeFace", {
        base64img: image,
      })
      .then((res) => {
        if (res.status === 200) {
          return { msg: "Success" };
        } else {
          console.log(res);
          return rejectWithValue({
            msg: res.data.msg,
            code: res.status,
          });
        }
      })
      .catch((err) => console.log(err));
    console.log(data);
    return data;
  }
);
