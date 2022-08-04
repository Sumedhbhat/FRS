import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  result: false,
result: null,
  error: null,
  loading: false,
  errorCode: null,
};


export const recognizeUser2 = createAsyncThunk(
  "recognize/recognizeUser2",
  async (image, { rejectWithValue, getState }) => {
    const data = await axios
      .post(process.env.REACT_APP_SERVER + "/user/recognizeuser", {
        base64img: image,
        in_out_status: "IN",
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          return {
            result: true,
            loading: false,
            users: res.data.users,
            error: null,
          };
        } else {
          return {
            loading: false,
            result: false,
            users: null,
            error: res.data.msg,
          };
        }
      })
      .catch((err) => {
        return {
          users: null,
          loading: false,
          result: false,
          error: err.response.data.msg,
        };
      });
    return data;
  });

const attendance = createSlice({
  name: "attendance",
  initialState,
  reducers: {
  },
  extraReducers: {
    [recognizeUser2.pending]: (state, action) => {
      state.loading = true;
    },
    [recognizeUser2.fulfilled]: (state, action) => {
      state.loading = false;
      state.result = action.payload.result;
      state.users = action.payload.users;
      state.error = action.payload.error;
    },
    [recognizeUser2.rejected]: (state, action) => {
      state.loading = false;
      state.result = action.payload.result;
      state.users = action.payload.users;
      state.error = action.payload.error;
    }
  }
});
