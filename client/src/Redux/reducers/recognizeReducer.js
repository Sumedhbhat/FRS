import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  result: false,
  image: null,
  userId: null,
  error: null,
  loading: false,
  user: null,
  errorCode: null,
};

export const getUser = createAsyncThunk(
  "user/getUserStatus",
  async (userId, { rejectWithValue, getState }) => {
    const data = await axios
      .get(process.env.REACT_APP_SERVER + `/admin/users/?user_id=${userId}`)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
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

export const recognizeUser = createAsyncThunk(
  "recognize/recognizeUserStatus",
  async (image, { rejectWithValue, getState }) => {
    const data = await axios
      .post(process.env.REACT_APP_SERVER + "/user/recognizeuser", {
        base64img: getState().recognize.image,
        in_out_status: "IN",
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          return {
            userId: res.data.user_id,
            msg: res.data.msg,
          };
        } else {
          return rejectWithValue({
            code: res.status,
            msg: res.data.msg,
            userId: null,
          });
        }
      })
      .catch((err) => console.log(err));
    return data;
  }
);

const recognize = createSlice({
  name: "recognize",
  initialState,
  reducers: {
    addImage: (state, action) => {
      state.image = action.payload;
    },
    resetImage: (state) => {
      state.image = null;
    },
    reset: (state) => {
      state.userId = null;
      state.error = null;
      state.loading = false;
      state.result = false;
      state.user = null;
      state.errorCode = null;
      state.image = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(recognizeUser.pending, (state, action) => {
      state.loading = true;
      state.result = false;
      state.userId = null;
    });
    builder.addCase(recognizeUser.rejected, (state, action) => {
      state.error = action.payload.msg;
      state.errorCode = action.payload.code;
      state.loading = false;
      state.result = false;
    });
    builder.addCase(recognizeUser.fulfilled, (state, action) => {
      state.error = null;
      state.loading = true;
      state.result = true;
      state.userId = action.payload.userId;
    });
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

export const { resetImage, addImage, reset } = recognize.actions;
export default recognize.reducer;
