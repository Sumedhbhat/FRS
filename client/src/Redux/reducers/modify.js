import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {};

const modifySlice = createSlice({
  name: "modify",
  initialState,
  reducers: {
    addImage: (state, action) => {
      state.image = action.payload;
    },
  },
});

export const { addImage } = modifySlice.actions;
export default modifySlice.reducer;
