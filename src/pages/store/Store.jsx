import { NavLink, Outlet, useLocation } from "react-router-dom";
import "../../styles/Store.css";
import StoreSideMenu from "../../components/store/StoreSideMenu";
import { useState } from "react";

const Store = () => {
  const location = useLocation();
  // 최근 본 상품 세션 업데이트 알림
  const [isUpdated, setIsUpdated] = useState(false);
  const triggerUpdate = () => {
    setIsUpdated(prev => !prev);
  };

  // ✨ 리모컨을 표시할 경로 목록을 확인하는 조건
  const shouldShowSideMenu = (
      location.pathname.startsWith('/store/allgoods') ||
      location.pathname.startsWith('/store/functionality') ||
      location.pathname.startsWith('/store/ingredient') ||
      location.pathname.startsWith('/store/detail/')
  );

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
      
      <div className={`store-content-wrapper ${shouldShowSideMenu ? 'showSide' : ''}`}>
        <div className="store-content">
          <Outlet context={{ triggerUpdate }} />
        </div>
        
        {shouldShowSideMenu && (
          <div className="store-menu">
            <StoreSideMenu isUpdated={isUpdated} />
          </div>
        )}
      </div>
    </div>
    
    </>
  )
}

export default Store;