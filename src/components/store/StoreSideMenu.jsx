import { faAngleLeft, faAngleRight, faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/store/StoreSideMenu.css";
import { useEffect, useMemo, useState } from "react";
import UseNavi from "../../utils/UseNavi";
import requestHandler from "../../utils/requestHandler";

const StoreSideMenu = ({ isUpdated, cartUpdated }) => {
  const { goTo } = UseNavi();
  const [recentItems, setRecentItems] = useState([]); // 최근 본 상품 목록
  const [cartLen, setCartLen] = useState(0);  // 장바구니 목록 개수
  
  // 최근 본 상품 페이지네이션
  const [nowPage, setNowPage] = useState(0);
  const ITEMS_PER_PAGE = 3; // 최근 본 상품은 3개씩 보여줌
  const maxPage = useMemo(() => {
      if (recentItems.length === 0) return 0;
      return Math.ceil(recentItems.length / ITEMS_PER_PAGE);
  }, [recentItems]);

  const itemToDisplay = useMemo(() => {
    if (!recentItems) return [];
    return recentItems.slice(nowPage*3, (nowPage*3) + 3);
  }, [recentItems, nowPage, maxPage]);
  
  useEffect(() => {
    if (maxPage === 0) {
      setNowPage(0);
      return;
    }

    if (nowPage > maxPage - 1) {
      setNowPage(maxPage - 1);
    }
  }, [recentItems.length, maxPage, nowPage])

  useEffect(() => {
    const data = sessionStorage.getItem("recentItems");
    if (data) {
      setRecentItems(JSON.parse(data));
    }
  }, [isUpdated]);

  useEffect(() => {
    const getCart = async () => {
      await requestHandler ({
        method: "get",
        url: '/cart',
        onSuccess: (data) => {
          if (data) {
            if (!data)
              setCartLen(0);
            else
              setCartLen(data.length);
          }
        },
        onError: (msg) => {
          console.error("장바구니 정보 로딩 실패: ", msg)
        }
      });
    };
    getCart();
  }, [cartUpdated])
  
  const deleteItemHandler = (selectItem, e) => {
    e.stopPropagation();

    const items = JSON.parse(sessionStorage.getItem("recentItems"));
    const updatedItems = items.filter(item => item.id !== selectItem.id);
    setRecentItems(updatedItems);

    sessionStorage.setItem("recentItems", JSON.stringify(updatedItems));
  };

  return (
    <>
      <div className="store_side_menu_wrapper">
        <div className="side_menu_box">
          <div className="side_menu" onClick={() => goTo("/store/cart")} >
            <div className="cart_icon">
              {cartLen > 0 && <p className="cart_cnt">{cartLen}</p>}
              <FontAwesomeIcon icon={faCartShopping} />
            </div>
            <p>장바구니</p>
          </div>
          <div className="side_menu" onClick={() => goTo("/store/favorite")}>
            <FontAwesomeIcon icon={faHeart} />
            <p>찜 목록</p>
          </div>
        </div>
        <div className="recent_items_box">
          <div className="recent_items_title">
            <p>최근 본 상품</p>
          </div>
          <div className="recent_items_list">
            {
              recentItems.length > 0
              ? (
                <>
                  {
                    itemToDisplay.map((item) => {
                      return (
                        <div className="recent_item" key={item.id}>
                          <div
                            className="delete_item_btn"
                            onClick={(e) => deleteItemHandler(item, e)}
                          >&times;</div>
                          <img
                            src={item.image_path}
                            alt={item.goods_name}
                            title={item.goods_name}
                            onClick={() => goTo(`/store/detail/${item.id}`)}
                          />
                        </div>
                      )
                    })

                  }
                  <div className="recent_pagination">
                    {recentItems && (
                      <>
                      <button
                        className="page_btn"
                        onClick={() => setNowPage(nowPage - 1)}
                        disabled={nowPage === 0}
                      >
                      <FontAwesomeIcon icon={faAngleLeft} /></button>
                      <p>
                        <span className="page_text">{nowPage + 1}</span>
                        <span className="page_text">/</span>
                        <span className="page_text">{maxPage}</span>
                      </p>
                      <button
                        className="page_btn"
                        onClick={() => setNowPage(nowPage + 1)}
                        disabled={nowPage === maxPage - 1 || maxPage === 0}
                      >
                      <FontAwesomeIcon icon={faAngleRight} /></button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="no_recent">
                  <p>최근 본 상품이 없습니다.</p>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default StoreSideMenu;