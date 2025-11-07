// 헤더
import { NavLink } from "react-router-dom";
import "../../styles/Header.css";
import logoImage from "../../images/logo.png";
import { useUser } from "../context/UserContext";
import requestHandler from "../../utils/requestHandler";
import Button from "../ui/Button";

const Header = () => {
  const { user, setUser, isLoggedIn } = useUser();

  const handleLogout = () => {
    requestHandler({
      method:"post",
      url: "login/logout",
      onSuccess: () => {
        setUser(null); // Context에서 로그아웃 처리

      }
    });
  };

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
            {isLoggedIn() ? (
              <>
                <span>{user.nickname}님</span>
                <Button onClick={handleLogout}>로그아웃</Button>
              </>
            ) : (
              <>               
                <NavLink to="login">로그인</NavLink>
                <NavLink to="signup">회원가입</NavLink>
              </>
            )}
            <NavLink to="mypage">마이페이지(임시)</NavLink>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;
