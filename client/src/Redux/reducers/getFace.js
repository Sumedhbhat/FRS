import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  error: null,
  loading: false,
  errorCode: null,
};

export const getUser = createAsyncThunk(
  "user/getUserStatus",
  async (userId, { rejectWithValue, getState }) => {
    const data = await axios
      .get(process.env.REACT_APP_SERVER + `/admin/users/?user_id=${userId}`)
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          return {
            user: res.data,
          };
        } else {
          return rejectWithValue({
            code: res.status,
            msg: res.data.msg,
          });
        }
      })
      .catch((err) => console.log(err));
    return data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state, action) => {
      state.user = null;
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      console.log(action);
      state.user = action.payload.user;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.user = null;
      state.error = action.payload.msg;
      state.errorCode = action.payload.code;
      state.loading = false;
    });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
