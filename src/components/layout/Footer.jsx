// 푸터
import "../../styles/footer/Footer.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer_container">
          <div className="footer_links">
            <a href="/terms">이용약관</a>
            <a href="/privacy">개인정보처리방침</a>
          </div>

          <div className="company_info">
            <p>
              상호명: (주)ㅇㅇ컴퍼니 &nbsp;|&nbsp; 대표: ㅇㅇㅇ &nbsp;|&nbsp; 사업자등록번호: 123-45-67890 
            </p>  
            <p>
              주소: 서울특별시 강동구 천호 000 &nbsp;|&nbsp; 고객센터: 02-1234-5678 (평일 10:00~18:00)
            </p>
            <p>
              이메일: aaaa@drugproject.com
            </p>
          </div>

          <div className="copyright">
            <p>© 2023 Your Company. All rights reserved.</p>
          </div>
          
        </div>
      </footer>
    </>
  )
}

export default Footer;
