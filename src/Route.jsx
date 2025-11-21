import { Navigate, Route, Routes } from "react-router-dom"
import Mainpage from "./pages/Mainpage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Analyze from "./pages/analyze/Analyze";
import Mypage from "./pages/mypage/Mypage";
import Review from "./pages/mypage/Review";
import Userinfo from "./pages/mypage/Userinfo";
import History from "./pages/mypage/History";
import Routine from "./pages/mypage/Routine";
import MyDrugs from "./pages/mypage/MyDrugs";
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
import PaySuccess from "./pages/order/PaySuccess";
import PayFail from "./pages/order/PayFail";
import { AdminRoute } from "./hooks/AdminRoute";
import MyOrderList from "./pages/order/MyOrderList";
import MyOrderDetail from "./pages/order/MyOrderDetail";
import Cart from "./pages/store/Cart";
import ContactUs from "./pages/store/ContactUs";
import QnA from "./pages/store/QnA";
import TermsOfService from "./pages/footer/TermsOfService";
import PrivacyPolicy from "./pages/footer/privacyPolicy";
import InquiryManage from "./pages/admin/InquiryManage";
import InquiryList from "./pages/admin/InquiryList";
import PendingList from "./pages/admin/PendingList";
import { Suspense } from "react";
import LoadingSpinner from "./utils/LoadingSpinner";


const Routers = () => {

  return (
    <Suspense fallback={<LoadingSpinner size={25} label="불러오는 중..." />}>
      <Routes>
        <Route path="/terms" element={<TermsOfService/>}/>
        <Route path="/privacy" element={<PrivacyPolicy/>}/>
        <Route path="/" element={<Mainpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signupComplete" element={<SignupComplete/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/analyze" element={<Analyze />}>
          <Route path="medicine" element={<MedicinePage />} />
          <Route path="supplement" element={<SupplementPage />} />
        </Route>
        <Route path="/analyze/result" element={<AnalyzeResult />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/detail/:id" element={<HistoryDetail />} />

        <Route path="mydrugs" element={<MyDrugs />} />
        <Route path="routine" element={<Routine />} />

        <Route path="/mypage" element={<Mypage />}>
          <Route path="userinfo" element={<Userinfo />} />
          <Route path="review" element={<Review />} />
        </Route>

        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>}>
          <Route index element={<Navigate to="products" replace />} />   {/* 기본: 상품관리 */}
          <Route path="products" element={<ProductManage />}>
            <Route index element={<ProductList />} /> {/* 기본: 등록된 상품 목록 */}
            <Route path="register" element={<ProductRegister />} /> {/* 상품 등록 */}
            <Route path="edit/:id" element={<ProductEdit />} /> {/* 상품 수정 */}
            <Route path="soldout" element={<SoldoutManage />} /> {/* 품절 관리 */}
          </Route>
          <Route path="order" element={<OrderHistory />} />
          <Route path="inquiry" element={<InquiryManage />}> {/* 문의 관리 */}
            <Route index element={<Navigate to="qna" replace />} />
            {/* 상품 문의 */}
            <Route path="qna" element={<InquiryList source="qna" />} />
            <Route path="qna/pending" element={<PendingList source="qna" />} />

            {/* 고객센터 문의 */}
            <Route path="inquiry" element={<InquiryList source="inquiry" />} />
            <Route path="inquiry/pending" element={<PendingList source="inquiry" />} />
          </Route>
        </Route>
        <Route path="/store" element={<Store />} >
          <Route path="cart" element={<Cart/>} />
          <Route path="allgoods" element={<Allgoods />}/>
          <Route path="functionality" element={<Functionality />}/>
          <Route path="ingredient" element={<Ingredient />}/>
          <Route path="favorite" element={<Favorite />} />
          <Route path="detail/:goodsId" element={<ProductDetail />}>
            <Route index element={<Navigate to="desc" replace />} />
            <Route path="desc" element={<ProductDescription />} />
            <Route path="review" element={<Reviews />} />
            <Route path="qna" element={<QnA/>}/>
          </Route>
          <Route path="contactUs" element={<ContactUs />} />
        </Route>
        <Route path="/orders" element={<OrderSheet />} />
        <Route path="/myOrderList" element={<MyOrderList />} />
        <Route path="/myOrderDetail" element={<MyOrderDetail />} />
        <Route path="/success" element={<PaySuccess />} />
        <Route path="/fail" element={<PayFail />} />
      </Routes>
    </Suspense>
  );
}

export default Routers