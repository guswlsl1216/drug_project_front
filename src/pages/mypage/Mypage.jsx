import { NavLink, Outlet } from "react-router-dom";
import "../../styles/mypage/Mypage.css";

const Mypage = () => {
  return (
    <>
      <div className="mypage-container">
        <h2>마이페이지</h2>

        <nav className="mypage-tabs">
          <NavLink to="userinfo">회원정보</NavLink>
          <NavLink to="history">분석결과내역</NavLink>
          <NavLink to="mymeds">내가복용중인약</NavLink>
          <NavLink to="routine">루틴</NavLink>
          <NavLink to="orders">주문내역</NavLink>
          <NavLink to="cart">찜목록</NavLink>
          <NavLink to="review">리뷰</NavLink>
        </nav>

        <div className="mypage-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Mypage;