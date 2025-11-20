import { NavLink, Outlet, useLocation } from "react-router-dom";
import "../../styles/admin/InquiryManage.css"

const InquiryManage = () => {
  const location = useLocation()

  const isQna = location.pathname.includes("/admin/inquiry/qna")

  const tabClass = ({ isActive }) =>
    `inqu-tab ${isActive ? "active" : ""}`;

  const topTabClass = ({isActive}) =>
    `inq-top-tab ${isActive ? "active" : ""}`
  
  return(
    <div className="inqu-container">
      <h3 className="inqu-title">문의 내역 관리</h3>

      {/* 상단: 문의 종류 탭 */}
      <div className="inq-top-tabs">
        <NavLink
          to="/admin/inquiry/qna"
          className={topTabClass}
        >
          상품 문의
        </NavLink>

        <NavLink
          to="/admin/inquiry/inquiry"
          className={topTabClass}
        >
          고객센터 문의
        </NavLink>
      </div>
      {/* 하단: 전체 / 답변대기 서브 탭 */}
      <div className="inqu-tab-wrap">
        <nav className="inqu-tabs">
          <NavLink 
            to={isQna ? "/admin/inquiry/qna" : "/admin/inquiry/inquiry"} end 
            className={tabClass}
          >
            전체
          </NavLink>
          <NavLink 
            to={isQna ? "/admin/inquiry/qna/pending" : "/admin/inquiry/inquiry/pending"} 
            className={tabClass}
          >
            답변대기
          </NavLink>
        </nav>
      </div>
  
      <div className="inqu-content-card">
        <Outlet />
      </div>
  
    </div>
  )
}

export default InquiryManage