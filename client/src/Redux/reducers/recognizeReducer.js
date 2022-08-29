import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  result: false,
  image: null,
  users: null,
  error: null,
  loading: false,
  user: null,
  errorCode: null,
};

// export const getUser = createAsyncThunk(
//   "user/getUserStatus",
//   async (users, { rejectWithValue, getState }) => {
//     const allUsers = [];
//     users.map(async (userId) => {
//       const data = await axios
//         .get(process.env.REACT_APP_SERVER + `/admin/users/?user_id=${userId}`)
//         .then((res) => {
//           console.log(res);
//           if (res.status === 200) {
//             return {
//               user: res.data,
//               userId: userId,
//             };
//           } else {
//             return {
//               code: res.status,
//               msg: res.data.msg,
//               userId: userId,
//             };
//           }
//         })
//         .catch((err) => {
//           return { msg: err.response.data.msg, userId: userId };
//         });
//       allUsers.push(data);
//     });
//     return allUsers;
//   }
// );

export const recognizeUser2 = createAsyncThunk(
  "recognize/recognizeUser2",
  async (image, { rejectWithValue, getState }) => {
    const data = await axios
      .post(
        process.env.REACT_APP_SERVER + "/user/recognizeuser",
        {
          headers: { Authorization: sessionStorage.getItem("token") },
        },
        {
          base64img: image,
          in_out_status: "IN",
        }
      )
      .then((res) => {
        console.log(res);
        console.log(res.data.face_liveness_confidence);
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
            live_status: res.data.face_liveness_status,
            live_confidence: res.data.face_liveness_confidence,
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
  }
);

export const recognizeUser = createAsyncThunk(
  "recognize/recognizeUserStatus",
  async (image, { rejectWithValue, getState }) => {
    const data = await axios
      .post(
        process.env.REACT_APP_SERVER + "/user/recognizeuser",
        {
          headers: { Authorization: sessionStorage.getItem("token") },
        },
        {
          base64img: getState().recognize.image,
          in_out_status: "IN",
        }
      )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          return {
            users: res.data.users,
            imgpath: res.data.imgpath,
          };
        } else {
          return rejectWithValue({
            code: res.status,
            msg: res.data.msg,
          });
        }
      })
      .catch((err) => rejectWithValue({ msg: err.response.data.msg }));
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
      state.users = null;
      state.error = null;
      state.loading = false;
      state.result = false;
      state.user = null;
      state.errorCode = null;
      state.image = null;
      state.imgpath = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(recognizeUser.pending, (state, action) => {
      state.loading = true;
      state.result = false;
      state.users = null;
      state.imgpath = null;
    });
    builder.addCase(recognizeUser.rejected, (state, action) => {
      state.error = action.payload.msg;
      state.errorCode = action.payload.code;
      state.loading = false;
      state.result = false;
      state.imgpath = null;
      state.users = null;
    });
    builder.addCase(recognizeUser.fulfilled, (state, action) => {
      state.error = null;
      state.loading = false;
      state.imgpath = action.payload.imgpath;
      state.result = true;
      state.users = action.payload.users;
    });
    builder.addCase(recognizeUser2.pending, (state, action) => {
      state.error = null;
      state.loading = true;
      state.result = false;
      state.users = null;
    });
    builder.addCase(recognizeUser2.rejected, (state, action) => {
      state.error = action.payload.msg;
      state.errorCode = action.payload.code;
      state.loading = false;
      state.result = false;
      state.users = null;
    });
    builder.addCase(recognizeUser2.fulfilled, (state, action) => {
      state.error = null;
      state.loading = false;
      state.result = true;
      state.users = action.payload.users;
    });

    // builder.addCase(getUser.pending, (state, action) => {
    //   state.allUsers = null;
    //   state.loading = true;
    //   state.error = null;
    // });
    // builder.addCase(getUser.fulfilled, (state, action) => {
    //   console.log(action);
    //   state.allUsers = action.payload.allUsers;
    //   state.error = null;
    //   state.loading = false;
    // });
    // builder.addCase(getUser.rejected, (state, action) => {
    //   state.allUsers = null;
    //   state.error = action.payload.msg;
    //   state.errorCode = action.payload.code;
    //   state.loading = false;
    // });
  },
});

export const { resetImage, addImage, reset } = recognize.actions;
export default recognize.reducer;
