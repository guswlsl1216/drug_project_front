import { NavLink, Outlet } from "react-router-dom"
import '../../styles/admin/ProductManage.css'

const ProductManage = () => {
  const tabClass = ({ isActive }) =>
    `productmanage-tab ${isActive ? "active" : ""}`;

  return(
    <div className="productmanage-container">
      <h3>상품 관리</h3>

      <nav className="productmanage-tabs">
        <NavLink to="" end className={tabClass}>상품 목록</NavLink>
        <NavLink to="register" className={tabClass}>상품 등록</NavLink>
        <NavLink to="soldout" className={tabClass}>품절 관리</NavLink>
      </nav>

      <div className="productmanage-content">
        <Outlet />
      </div>

    </div>
  )
}

export default ProductManage 