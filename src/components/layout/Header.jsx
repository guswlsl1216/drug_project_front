// 헤더
import "../../styles/Header.css";
const Header = () => {
  return (
    <>
      <header>
        <div className="header_container">
          <div className="header_logo">
            <h1>LOGO</h1>
          </div>
          <ul className="header_menu">
            <li>의약품조합</li>
            <li>의약품목록</li>
            <li>로그인</li>
            <li>회원가입</li>
          </ul>
        </div>
      </header>
    </>
  );
}

export default Header;
