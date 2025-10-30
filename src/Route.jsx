import { Route, Routes } from "react-router-dom"
import Mainpage from "./pages/Mainpage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Analyze from "./pages/Analyze";
import Mypage from "./pages/mypage/Mypage";
import Cart from "./pages/mypage/Cart";
import Orders from "./pages/mypage/Orders";
import Review from "./pages/mypage/Review";
import Userinfo from "./pages/mypage/Userinfo";
import History from "./pages/mypage/History";
import Routine from "./pages/mypage/Routine";
import Medslist from "./pages/Medslist";
import Mymeds from "./pages/mypage/Mymeds";

const Routers = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/medslist" element={<Medslist />} />

        <Route path="/mypage" element={<Mypage />}>
          <Route path="userinfo" element={<Userinfo />} />
          <Route path="history" element={<History />} />
          <Route path="mymeds" element={<Mymeds />} />
          <Route path="routine" element={<Routine />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="review" element={<Review />} />
        </Route>
      </Routes>
    </>
  );
}

export default Routers