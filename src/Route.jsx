import { Navigate, Route, Routes } from "react-router-dom"
import Mainpage from "./pages/Mainpage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Analyze from "./pages/analyze/Analyze";
import Mypage from "./pages/mypage/Mypage";
import Orders from "./pages/mypage/Orders";
import Review from "./pages/mypage/Review";
import Userinfo from "./pages/mypage/Userinfo";
import History from "./pages/mypage/History";
import Routine from "./pages/mypage/Routine";
import Medslist from "./pages/Medslist";
import Mymeds from "./pages/mypage/Mymeds";
import MedicinePage from "./pages/analyze/MedicinePage";
import SupplementPage from "./pages/analyze/SupplementPage";


import SignupComplete from "./pages/SignupComplete"
import AnalyzeResult from "./pages/analyze/AnalyzeResult";
import AdminPage from "./pages/admin/AdminPage";
import ProductManage from "./pages/admin/ProductManage";
import ProductList from "./pages/admin/ProductList";
import ProductRegister from "./pages/admin/ProductRegister";
import SoldoutManage from "./pages/admin/SoldoutManage";
import OrderHistory from "./pages/admin/OrderHistory";
import ProductEdit from "./pages/admin/ProductEdit";
import HistoryDetail from "./pages/mypage/HistoryDetail";
import Store from "./pages/store/Store";
import Allgoods from "./pages/store/Allgoods";
import Functionality from "./pages/store/Functionality";
import Ingredient from "./pages/store/Ingredient";
import ProductDetail from "./pages/store/ProductDetail";
import Favorite from "./pages/mypage/Favorite";
import OrderSheet from "./pages/order/OrderSheet";
import ProductDescription from "./pages/store/ProductDescription";
import Reviews from "./pages/store/Reviews";

const Routers = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signupComplete" element={<SignupComplete/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/analyze" element={<Analyze />}>
          <Route path="medicine" element={<MedicinePage />} />
          <Route path="supplement" element={<SupplementPage />} />
        </Route>
        <Route path="/analyze/result" element={<AnalyzeResult />} />
        <Route path="/medslist" element={<Medslist />} />
        <Route path="routine" element={<Routine />} />

        <Route path="/mypage" element={<Mypage />}>
          <Route path="userinfo" element={<Userinfo />} />
          <Route path="history" element={<History />} />
          <Route path="history/detail/:id" element={<HistoryDetail />} />
          <Route path="mymeds" element={<Mymeds />} />
          <Route path="favorite" element={<Favorite />} />
          <Route path="orders" element={<Orders />} />
          <Route path="review" element={<Review />} />
        </Route>

        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<Navigate to="products" replace />} />   {/* 기본: 상품관리 */}
          <Route path="products" element={<ProductManage />}>
            <Route index element={<ProductList />} /> {/* 기본: 등록된 상품 목록 */}
            <Route path="register" element={<ProductRegister />} /> {/* 상품 등록 */}
            <Route path="edit/:id" element={<ProductEdit />} /> {/* 상품 수정 */}
            <Route path="soldout" element={<SoldoutManage />} /> {/* 품절 관리 */}
          </Route>
          <Route path="order" element={<OrderHistory />} />
        </Route>
        <Route path="/store" element={<Store />} >
          <Route path="allgoods" element={<Allgoods />}/>
          <Route path="functionality" element={<Functionality />}/>
          <Route path="ingredient" element={<Ingredient />}/>
          <Route path="detail/:goodsId" element={<ProductDetail />}>
            <Route index element={<Navigate to="desc" replace />} />
            <Route path="desc" element={<ProductDescription />} />
            <Route path="review" element={<Reviews />} />
          </Route>
        </Route>
        <Route path="/orders" element={<OrderSheet />} />
      </Routes>
    </>
  );
}

export default Routers