import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import ResultPage from "./Components/ResultPage/ResultPage";
import TakePicture from "./Components/TakePicture/TakePicture";
import LoginPage from "./Components/LoginPage/LoginPage";
import AdminPage from "./Components/AdminPage/AdminPage";
import PicCapture from "./Components/TakePicture/Testing/PicCapture";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "./Redux/functions/userFunctions";
import TakePicture2 from "./Components/TakePicture2/TakePicture2";
import MultipleImages from "./Components/MulitpleImages/MultipleImages";

const App = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.user.count);
  const basename = process.env.REACT_APP_BASENAME || null;
  useEffect(() => {
    dispatch(getUsers());
  }, [count]);
  return (
    <Router basename={basename}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/take-picture' element={<TakePicture />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/pic-capture' element={<PicCapture />} />
        <Route path='/pic-capture2' element={<TakePicture2 />} />
        <Route path='/multiple-images' element={<MultipleImages />} />
        <Route path='*' element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
