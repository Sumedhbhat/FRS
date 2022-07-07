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
      .post("http://localhost:3007/admin/login", loginDetails)
      .then((res) => {
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
      if (sessionStorage.getItem("username") !== null) {
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
      sessionStorage.removeItem("username");
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
      state.username = action.payload.username;
      state.error = null;
      state.loading = false;
      sessionStorage.setItem("username", action.payload.username);
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
