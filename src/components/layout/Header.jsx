// 헤더
import { NavLink } from "react-router-dom";
import "../../styles/Header.css";
import logoImage from "../../images/logo.png";
import { useUser } from "../context/UserContext";
import requestHandler from "../../utils/requestHandler";
import Button from "../ui/Button";
import UseNavi from "../../utils/UseNavi";

const Header = () => {
  const { user, setUser, isLoggedIn } = useUser();
  const {goTo} = UseNavi();

  const handleLogout = () => {
    requestHandler({
      method:"post",
      url: "login/logout",
      onSuccess: () => {
        setUser(null); // Context에서 로그아웃 처리 (초기화)
        sessionStorage.removeItem('isSave');  // 세션 삭제 (분석 결과 저장 유무)
        sessionStorage.removeItem('result');  // 세션 삭제 (분석 결과)
        alert("로그아웃 되었습니다.");
        goTo("/login"); // 로그인 페이지로 이동
      },
      onError: (msg) => {
        alert(msg);
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
          <div className="header_main_menu">
            <ul className="main_menu_container">
              <li className="main_menu">
                <NavLink to="analyze/medicine">AI분석</NavLink>
                <div className="sub_menu_container">
                  <ul className="sub_menu">
                    <li>
                      <NavLink to="analyze/medicine">분석하기</NavLink>
                    </li>
                    <li>
                      <NavLink to="history">분석 결과 내역</NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="main_menu">
                <NavLink to="/routine">루틴</NavLink>
                <div className="sub_menu_container">
                  <ul className="sub_menu">
                    <li>
                      <NavLink to="/routine">루틴</NavLink>
                    </li>
                    <li>
                      <NavLink to="/mydrugs">복용약</NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="main_menu">
                <NavLink to="store/allgoods">스토어</NavLink>
                <div className="sub_menu_container">
                  <ul className="sub_menu">
                    <li>
                      <NavLink to="store/allgoods">상품 목록</NavLink>
                    </li>
                    <li>
                      <NavLink to="store/favorite">찜 목록</NavLink>
                    </li>
                    <li>
                      <NavLink>주문 내역</NavLink>
                    </li>
                    <li>
                      <NavLink>나의 리뷰</NavLink>
                    </li>
                    <li>
                      <NavLink to="store/cart">장바구니</NavLink>
                    </li>
                    <li>
                      <NavLink to="store/contactUs">문의하기</NavLink>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className="header_user_menu">
            <ul className="user_menu_container">
              <li className="user_menu">
                {isLoggedIn ? (
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
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
