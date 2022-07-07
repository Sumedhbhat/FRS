import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import recognizeReducer from "./reducers/recognizeReducer";
import user from "./reducers/userReducer";
import modify from "./reducers/modify";
import userSlice from "./reducers/getFace";
import admin from "./reducers/admin";
import image from "./reducers/image";

export const store = configureStore({
  reducer: {
    // reducer
    user,
    admin: admin,
    recognize: recognizeReducer,
    image,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
