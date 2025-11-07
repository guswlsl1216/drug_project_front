// 헤더
import { NavLink } from "react-router-dom";
import "../../styles/Header.css";
import logoImage from "../../images/logo.png";

const Header = () => {
  return (
    <>
      <header>
        <nav className="header_container">
          <div className="header_logo">
            <NavLink to="/">
              <h1 className="logo">Home</h1>
            </NavLink>
          </div>
          <ul className="header_menu">
            <NavLink to="analyze">AI분석</NavLink>
            <NavLink to="medslist">의약품목록</NavLink>
            <NavLink to="store">스토어</NavLink>
            <NavLink to="login">로그인</NavLink>
            <NavLink to="signup">회원가입</NavLink>
            <NavLink to="mypage">마이페이지(임시)</NavLink>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;
