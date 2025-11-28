// 헤더
import { NavLink, useLocation } from "react-router-dom";
import "../../styles/Header.css";
import logoImage from "../../images/logo.png";
import { useUser } from "../context/UserContext";
import requestHandler from "../../utils/requestHandler";
import Button from "../ui/Button";
import UseNavi from "../../utils/UseNavi";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const { user, setUser, isLoggedIn, vetified, setVerified } = useUser();
  const {goTo} = UseNavi();
  const location = useLocation();
  const menuRef = useRef(null);

  // 프로필 눌렀을 때 메뉴 팝업 뜨게 하기
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const clickOutsideHandler = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };
  
  // 페이지에 해당하는 메인메뉴 활성화 css를 위한 페이지 분류 목록
  const [activeMenu, setActiveMenu] = useState(null);
  const nowActivePage = (pathname) => {
    if (pathname.startsWith('/analyze') ||
    pathname.startsWith('/history')) {
      return "analyze";
    }
    else if (pathname.startsWith('/routine') ||
    pathname.startsWith('/mydrugs')) {
      return "routine";
    }
    else if (pathname.startsWith('/store/') ||
    pathname.startsWith('/orders')) {
      return "store";
    }
    else if (pathname.startsWith('/contactUs')) {
      return "contactUs";
    }
    
  }

  useEffect(() => {
    document.addEventListener('mousedown', clickOutsideHandler);

    return () => {
      document.removeEventListener('mousedown', clickOutsideHandler);
    }
  }, []);
  
  useEffect(() => {
    const nowActiveMenu = nowActivePage(location.pathname);
    setActiveMenu(nowActiveMenu);
    setIsMobileMenuOpen(false)
  }, [location.pathname]);

  const handleLogout = () => {
    requestHandler({
      method:"post",
      url: "login/logout",
      onSuccess: () => {
        setUser(null); // Context에서 로그아웃 처리 (초기화)
        sessionStorage.removeItem('isSave');  // 세션 삭제 (분석 결과 저장 유무)
        sessionStorage.removeItem('result');  // 세션 삭제 (분석 결과)
        setVerified(false); // 로그아웃 시 비밀번호 인증 한 것을 false로 바꿈
        alert("로그아웃 되었습니다.");
        goTo("/login"); // 로그인 페이지로 이동
      },
      onError: (msg) => {
        alert(msg);
      }
    });
  };

  const mobileMenuRef= useRef(null)

  useEffect(() => {
    const clickOutside = (e) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest(".hamburger-btn")
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", clickOutside)

    return () => {
      document.removeEventListener("mousedown", clickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header>
        <nav className="header_container">
          <div className="header_logo">
            <NavLink to="/">
              <h1 className="logo"><img src="src/images/medicheck.png" alt="" srcset="" /></h1>
            </NavLink>
          </div>
          <Button
           type="button"
           variant="text"
           className={`hamburger-btn ${isMobileMenuOpen ? "is-open" : ""}`}
           onClick={() => setIsMobileMenuOpen((prev) => !prev)}
           aria-label="메뉴 열기"
          >
            <FontAwesomeIcon icon={faBars} />
          </Button>

          <div className="header_main_menu">
            <ul className="main_menu_container">
              <li className={`main_menu ${activeMenu == 'analyze' ? 'activeMenu' : ''}`}>
                <NavLink to="analyze/medicine">스마트 분석</NavLink>
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
              <li className={`main_menu ${activeMenu == 'routine' ? 'activeMenu' : ''}`}>
                <NavLink to="/routine">루틴</NavLink>
                <div className="sub_menu_container">
                  <ul className="sub_menu">
                    <li>
                      <NavLink to="/routine">캘린더</NavLink>
                    </li>
                    <li>
                      <NavLink to="/mydrugs">등록 / 관리</NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={`main_menu ${activeMenu == 'store' ? 'activeMenu' : ''}`}>
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
                      <NavLink to="/myReview">나의 리뷰</NavLink>
                    </li>
                    <li>
                      <NavLink to="store/cart">장바구니</NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={`main_menu ${activeMenu == 'contactUs' ? 'activeMenu' : ''}`}>
                <NavLink to="contactUs">고객센터</NavLink>
                <div className="sub_menu_container">
                  <ul className="sub_menu">
                    <li>
                      <NavLink to="/contactUs">문의하기</NavLink>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className="header_user_menu">
            <ul className="user_menu_container">
              {isLoggedIn ? (
                <li className={`user_menu_logged_in ${isMenuOpen ? 'is-active' : ''}`} ref={menuRef}>
                  <div className="profile" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <FontAwesomeIcon icon={faUser} />
                    <span>{user.nickname}</span>
                  </div>
                  <div className="mypage_menu">
                    <ul>
                      <li>
                        <NavLink to="mypage">회원정보</NavLink>
                      </li>
                      <li>
                        <p onClick={handleLogout}>로그아웃</p>
                      </li>
                    </ul>
                  </div>
                </li>
              ) : (
                <li className="user_menu_logged_out">               
                  <NavLink to="login">로그인</NavLink>
                  <NavLink to="signup">회원가입</NavLink>
                </li>
              )}
            </ul>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="mobile_menu" ref={mobileMenuRef}>
            <ul>
              <li>
                <p className="mobile-menu-section-title">AI분석</p>
                <NavLink
                  to="/analyze/medicine"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  분석하기
                </NavLink>
                <NavLink
                  to="/history"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  분석 결과 내역
                </NavLink>
              </li>

              <li>
                <p className="mobile-menu-section-title">루틴</p>
                <NavLink
                  to="/routine"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  캘린더
                </NavLink>
                <NavLink
                  to="/mydrugs"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  등록 / 관리
                </NavLink>
              </li>

              <li>
                <p className="mobile-menu-section-title">스토어</p>
                <NavLink
                  to="/store/allgoods"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  상품 목록
                </NavLink>
                <NavLink
                  to="/store/favorite"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  찜 목록
                </NavLink>
                <NavLink
                  to="/myReview"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  나의 리뷰
                </NavLink>
                <NavLink
                  to="/store/cart"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  장바구니
                </NavLink>
              </li>
              <li>
                <p className="mobile-menu-section-title">고객센터</p>
                <NavLink 
                  to="/contactUs"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  문의하기
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
