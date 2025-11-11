import { NavLink, Outlet } from "react-router-dom";
import "../../styles/Store.css";

const Store = () => {
  return (
    <>
    <div className="store-container">
      <nav className="store-nav">
        <NavLink to="allgoods" className={({isActive}) => (isActive ? "tab active" : "tab")}>
          전체
        </NavLink>
        <NavLink to="functionality" className={({isActive}) => (isActive ? "tab active" : "tab")}>
          기능성
        </NavLink>
        <NavLink to="ingredient" className={({isActive}) => (isActive ? "tab active" : "tab")}>
          성분별
        </NavLink>
      </nav>
      
      <div className="store-content">
        <Outlet />
      </div>
    </div>
    
    </>
  )
}

export default Store;