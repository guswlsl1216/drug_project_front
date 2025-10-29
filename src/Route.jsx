import { Route, Routes } from "react-router-dom"
import Mainpage from "./pages/Mainpage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Meds from "./pages/mypage/Meds";
import Analyze from "./pages/Analyze";
import Mypage from "./pages/mypage/Mypage";
import Cart from "./pages/mypage/Cart";
import Myplan from "./pages/Myplan";
import Orders from "./pages/mypage/Orders";
import Review from "./pages/mypage/Review";
import Userinfo from "./pages/mypage/Userinfo";
import History from "./pages/mypage/History";

const Routers = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="myplan" element={<Myplan />} />
        

        <Route path="/mypage" element={<Mypage />}>
          <Route path="userinfo" element={<Userinfo />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="review" element={<Review />} />
          <Route path="meds" element={<Meds />} />
          <Route path="history" element={<History />} />
        </Route>

      </Routes>
    </>
  );
}

export default Routers