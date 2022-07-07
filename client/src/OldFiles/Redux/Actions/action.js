import {
  GET_USERS,
  ADD_USER,
  DELETE_USER,
  UPDATE_USER,
  ADD_IMAGE,
  RESET_IMAGE,
} from "../Constants/constants";
import axios from "axios";

export const addUser = (user) => async (dispatch, getState) => {
  await axios
    .get("/admin/users/create", user)
    .then((res) => {
      if (res.status === 200) {
        dispatch({
          type: ADD_USER,
          payload: user,
        });
      }
    })
    .catch((err) => console.log(err));
};

export const getUsers = () => async (dispatch, getState) => {
  await axios
    .get("http://localhost:3007/users")
    .then((res) => {
      if (res.status === 200) {
        dispatch({
          type: GET_USERS,
          payload: res.data,
        });
      } else {
        console.log(res.data);
      }
    })
    .catch((err) => console.log(err));
};

export const deleteUser = (id) => async (dispatch, getState) => {
  await axios
    .delete("http://localhost:3007/users/" + id)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

export const updateUser = (user) => async (dispatch, getState) => {
  await axios
    .put("http://localhost:3007/users/" + user.id, user)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

export const addImage = (imageSrc) => (dispatch, getState) => {
  return {
    type: ADD_IMAGE,
    payload: imageSrc,
  };
};

export const resetImage = () => (dispatch, getState) => {
  return {
    type: RESET_IMAGE,
  };
};
