import { NavLink, Outlet } from 'react-router-dom'
import '../../styles/admin/AdminPage.css'

const AdminPage = () => {
  const tabClass = 
    ({isActive}) => `adminpage-tab ${isActive ? 'active' : ''}`
  
  return (
    <div className='adminpage-container'>
      <h2>ADMIN PAGE</h2>

      <nav className="adminpage-tabs">
        <NavLink to="products" className={tabClass}>상품 관리</NavLink>
        <NavLink to="order" className={tabClass}>거래 내역 조회</NavLink>
        <NavLink to="inquiry" className={tabClass}>문의 내역 관리</NavLink>
      </nav>

      <div className="adminpage-content">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminPage