import {
  ADD_USER,
  GET_USERS,
  DELETE_USER,
  UPDATE_USER,
  ADD_IMAGE,
  RESET_IMAGE,
} from "../Constants/constants";

const initialState = {
  users: [],
  image: "",
  loading: false,
  error: null,
  count: 0,
};

const userReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false,
        count: state.count + 1,
      };
    case ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload],
        loading: false,
        count: state.count + 1,
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        loading: false,
        count: state.count + 1,
      };
    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) => {
          if (user.id === action.payload.id) {
            return action.payload;
          }
          return user;
        }),
        loading: false,
        count: state.count + 1,
      };
    case ADD_IMAGE:
      return {
        ...state,
        image: action.payload,
        count: state.count + 1,
      };

    case RESET_IMAGE:
      return {
        ...state,
        image: "",
        count: state.count + 1,
      };

    default:
      return state;
  }
};

export default userReducers;
