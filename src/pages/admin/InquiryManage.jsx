import { NavLink, Outlet } from "react-router-dom";
import "../../styles/admin/InquiryManage.css"

const InquiryManage = () => {
  const tabClass = ({ isActive }) =>
    `inqu-tab ${isActive ? "active" : ""}`;
  
  return(
    <div className="inqu-container">
      <h3 className="inqu-title">문의 내역 관리</h3>

      <div className="inqu-tab-wrap">
        <nav className="inqu-tabs">
          <NavLink to="" end className={tabClass}>전체</NavLink>
          <NavLink to="pending" className={tabClass}>답변대기</NavLink>
        </nav>
      </div>
  
      <div className="inqu-content-card">
        <Outlet />
      </div>
  
    </div>
  )
}

export default InquiryManage