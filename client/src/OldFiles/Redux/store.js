import { combineReducers } from "redux";
import userReducers from "./Reducers/reducers";

const rootReducer = combineReducers({
  user: userReducers,
});

export default rootReducer;
