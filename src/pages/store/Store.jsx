import { NavLink, Outlet, useLocation } from "react-router-dom";
import "../../styles/Store.css";
import StoreSideMenu from "../../components/store/StoreSideMenu";
import { useEffect, useState } from "react";

const Store = () => {
  const location = useLocation();
  // 최근 본 상품 세션 업데이트 알림
  const [isUpdated, setIsUpdated] = useState(false);
  const triggerUpdate = () => {
    setIsUpdated(prev => !prev);
  };

  // 장바구니 업데이트 알림
  const [cartUpdated, setCartUpdated] = useState(false);
  const triggerCartUpdate = () => {
    setCartUpdated(prev => !prev);
  };

  // ✨ 리모컨을 표시할 경로 목록을 확인하는 조건
  const shouldShowSideMenu = (
      location.pathname.startsWith('/store/allgoods') ||
      location.pathname.startsWith('/store/functionality') ||
      location.pathname.startsWith('/store/ingredient') ||
      location.pathname.startsWith('/store/detail/')
  );

  // 스토어 네비바
  const shouldShowNav = (
    location.pathname.startsWith('/store/allgoods') ||
    location.pathname.startsWith('/store/functionality') ||
    location.pathname.startsWith('/store/ingredient')
  )

  // 검색 기능 --------
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
  const resetSearchStates = () => {
    setSearchQuery("");
    setSubmittedSearchQuery("");
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSubmittedSearchQuery(searchQuery)
    console.log("검색어 제출:", searchQuery)
  }

  useEffect(() => {
    if (location.pathname.startsWith('/store/')) {
      setSearchQuery("");
      setSubmittedSearchQuery("");
    }
  }, [location])

  return (
    <>
      <div className="wrapper">
        <section className="store_bg">
          <div className="bg_text">
            <h1 className="bg_main_title">Store</h1>
            <p className="bg_sub_title">내가 먹는 의약품과 분석하며 안전하게 구매하세요. </p>
          </div>
        </section>
        <div className="store-container-wrapper">
          <div className="store-container">
            {shouldShowNav && (
              <nav className="store-nav">
                <NavLink
                  to="allgoods"
                  className={({isActive}) => (isActive ? "tab active" : "tab")}
                >
                  전체
                </NavLink>
                <NavLink
                  to="functionality"
                  className={({isActive}) => (isActive ? "tab active" : "tab")}
                >
                  기능성
                </NavLink>
                <NavLink
                  to="ingredient"
                  className={({isActive}) => (isActive ? "tab active" : "tab")}
                >
                  성분별
                </NavLink>
              </nav>
            )}

            <div className={`store-content-wrapper ${shouldShowSideMenu ? "showSide" : ""}`}>
              <div className="store-content">
                <Outlet
                  context={{
                    triggerUpdate,
                    triggerCartUpdate,
                    searchQuery,
                    handleSearchChange,
                    handleSearchSubmit,
                    submittedSearchQuery,
                    resetSearchStates,
                  }}
                />
              </div>
            </div>
          </div>
          {shouldShowSideMenu && (
            <div className="store-menu">
              <StoreSideMenu isUpdated={isUpdated} cartUpdated={cartUpdated} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Store;