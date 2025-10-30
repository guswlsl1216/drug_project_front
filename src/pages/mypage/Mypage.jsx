import { NavLink, Outlet } from "react-router-dom";
import "../../styles/Mypage.css";

const Mypage = () => {
  return (
    <>
      <div className="mypage-container">
        <h2>마이페이지</h2>

        <nav className="mypage-tabs">
          <NavLink to="Userinfo">회원정보</NavLink>
          <NavLink to="History">분석결과내역</NavLink>
          <NavLink to="Mymeds">내가복용중인약</NavLink>
          <NavLink to="Routine">루틴</NavLink>
          <NavLink to="Orders">주문내역</NavLink>
          <NavLink to="Cart">찜목록</NavLink>
          <NavLink to="Review">리뷰</NavLink>
        </nav>

        <div className="mypage-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Mypage;