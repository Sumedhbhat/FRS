import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  username: null,
  isLoggedIn: false,
  error: null,
  loading: true,
};

export const adminLogin = createAsyncThunk(
  "admin/login",
  async (loginDetails, { getState, rejectWithValue }) => {
    console.log(loginDetails);
    const data = await axios
      .post(
        process.env.REACT_APP_SERVER + "/admin/login",
        {
          headers: { Authorization: sessionStorage.getItem("token") },
        },
        loginDetails
      )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          return { ...res.data, ...loginDetails };
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

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    checkLogin: (state, action) => {
      if (sessionStorage.getItem("token") !== null) {
        state.username = sessionStorage.getItem("username");
        state.isLoggedIn = true;
        state.loading = false;
      } else {
        state.username = null;
        state.isLoggedIn = false;
        state.loading = false;
      }
    },
    logOut: (state) => {
      sessionStorage.removeItem("token");
      state.username = null;
      state.isLoggedIn = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(adminLogin.pending, (state) => {
      state.isLoggedIn = false;
      state.error = null;
      state.loading = true;
    });
    builder.addCase(adminLogin.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.username = action.payload.token;
      state.error = null;
      state.loading = false;
      sessionStorage.setItem("token", action.payload.token);
    });
    builder.addCase(adminLogin.rejected, (state, action) => {
      state.isLoggedIn = false;
      state.error = action.payload.msg;
      state.loading = false;
    });
  },
});

export default adminSlice.reducer;
export const { checkLogin, logOut } = adminSlice.actions;
