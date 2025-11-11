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

import MyDrugs from "./pages/mypage/MyDrugs";
import SignupComplete from "./pages/SignupComplete"
import AnalyzeResult from "./pages/analyze/AnalyzeResult";
import HistoryDetail from "./pages/mypage/HistoryDetail";
import Store from "./pages/store/Store";
import Allgoods from "./pages/store/Allgoods";
import Functionality from "./pages/store/Functionality";
import Ingredient from "./pages/store/Ingredient";


const Routers = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signupComplete" element={<SignupComplete/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/analyze/result" element={<AnalyzeResult />} />
        <Route path="/medslist" element={<Medslist />} />

        <Route path="/mypage" element={<Mypage />}>
          <Route path="userinfo" element={<Userinfo />} />
          <Route path="history" element={<History />} />
          <Route path="mydrugs" element={<MyDrugs />} />
          <Route path="history/detail/:id" element={<HistoryDetail />} />
          <Route path="routine" element={<Routine />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="review" element={<Review />} />
        </Route>

        <Route path="/store" element={<Store />} >
          <Route path="allgoods" element={<Allgoods />}/>
          <Route path="functionality" element={<Functionality />}/>
          <Route path="ingredient" element={<Ingredient />}/>
        </Route>
      </Routes>
    </>
  );
}

export default Routers