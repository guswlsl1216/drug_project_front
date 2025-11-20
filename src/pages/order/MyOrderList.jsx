import { useEffect, useState } from "react"
import Button from "../../components/ui/Button"
import requestHandler from "../../utils/requestHandler";
import LoadingSpinner from "../../utils/LoadingSpinner";
import Pagination from "../../components/ui/Pagination";
import time from "../../utils/time";
import "../../styles/order/MyOrderList.css"
import useLoginRedirect from "../../utils/useLoginRedirect";
import { TfiAngleRight } from "react-icons/tfi";
import UseNavi from "../../utils/UseNavi";

const MyOrderList = () => {
  const { requireLogin } = useLoginRedirect();
  const [range, setRange] = useState("all")
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const {goTo} = UseNavi()

  const load = async () => {
    await requestHandler({
      method: "get",
      url: "/orders/me",
      params : {page, per_page: perPage, range, keyword: searchKeyword },
      setLoading,
      onSuccess: (data) => {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setTotal(typeof data.total === "number" ? data.total : 0);
        setPages(typeof data.pages === "number" ? data.pages : 1);
        setPerPage(typeof data.per_page === "number" ? data.per_page : 10);
      },
      onError: (msg) => {
        alert(msg)
        setOrders([])
        setTotal(0)
        setPages(1)
      },
    })
  }

  useEffect(() => {
    requireLogin(() => {
      load()
    }, false)
  }, [page, perPage, range, searchKeyword])

  return (
    <div className="myorder-list">
      <div className="myorder-list__header">
        <h2>주문 내역</h2>
        {total > 0 && (
          <p className="myorder-list__summary">
            총 <strong>{total}</strong>건의 주문 내역
          </p>
        )}
      </div>
      
      {/* 조회기간 + 검색 영역 */}
      <div className="myorder-list__filters">
        <div className="myorder-list__range-group">
          <h6>조회기간</h6>
          <div className="myorder-list__range-buttons">
            <Button 
              variant="outline" 
              className={`range-btn ${range === "all" ? "is-active" : ""}`}
              onClick={() => {
                setRange("all");
                setPage(1);
              }}
            >
              전체
            </Button>
            <Button 
              variant="outline" 
              className={`range-btn ${range === "1m" ? "is-active" : ""}`}
              onClick={() => {
                setRange("1m");
                setPage(1);
              }}
            >
              최근 1개월
            </Button>
            <Button 
              variant="outline" 
              className={`range-btn ${range === "3m" ? "is-active" : ""}`}
              onClick={() => {
                setRange("3m");
                setPage(1);
              }}
            >
              최근 3개월
            </Button>
            <Button 
              variant="outline" 
              className={`range-btn ${range === "6m" ? "is-active" : ""}`}
              onClick={() => {
                setRange("6m");
                setPage(1);
              }}
            >
              최근 6개월
            </Button>
          </div>
        </div>

        <div className="myorder-list__search">
          <input 
            type="text" 
            name="keyword" 
            placeholder="상품명 또는 주문번호 검색" 
            className="myorder-list__search__form"
            value={keyword}
            onChange={(e) => {
              const v = e.target.value;
              setKeyword(v);

              // 검색창 지우면 자동으로 전체 목록 조회
              if (v.trim() === "") {
                setSearchKeyword("");  // 서버에 keyword="" 전달 → 전체 조회
                setPage(1);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setPage(1);
                setSearchKeyword(keyword.trim());
              }
            }}
          />
          <Button 
            type="button" 
            variant="primary" 
            className="myorder-list__search-btn"
            onClick={() => {
              setPage(1)
              setSearchKeyword(keyword.trim())
            }}
          >
            검색
          </Button>
        </div>
      </div>


      {loading ? (
        <div className="loading">
          <LoadingSpinner size={32} label="주문 목록 불러오는 중..." />
        </div>
      ) : orders.length ? (
        <>
          <div className="myorder-list__table-wrapper">
            <table className="myorder-list__table">
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>주문일시</th>
                  <th>상품명/주문금액/수량</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const mainItem = o.items?.[0];   // 첫번째 상품
                  const extraCount = (o.items?.length || 0) - 1; // 나머지 상품 개수

                  return(
                    <tr key={o.id || o.order_code}>
                      <td className="cell-order-code">{o.order_code}</td>
                      <td className="cell-order-date">{time(o.payment_at)}</td>
                      <td className="cell-order-info" onClick={() => {
                        goTo("/myOrderDetail", {
                          order: {
                            order_id: o.id
                          }
                        })
                      }}>
                        {mainItem && (
                            <div className="order-item">
                              {mainItem.image && (
                                <div className="order-thumb">
                                  <img
                                    src={mainItem.image}
                                    alt={mainItem.goods_name}
                                  />
                                </div>
                              )}
                              <div className="order-text">
                                <div className="order-main-name">
                                  {mainItem.goods_name}
                                  {extraCount > 0 && (
                                    <span className="order-extra">
                                      {" "}외 {extraCount}건
                                    </span>
                                  )}
                                </div>
                                <div className="order-price-qty">
                                  {o.final_amount?.toLocaleString()}원 /{" "}
                                  {o.total_count}개
                                </div>
                                <div className="order-view-detail">
                                  상세보기<TfiAngleRight className="order-view-detail__icon" />
                                </div>
                              </div>
                            </div>
                          )
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            pages={pages}
            loading={loading}
            onChange={(num) => setPage(num)}
          />
        </>
      ) : (
        <div className="empty">주문한 상품이 없습니다.</div>
      )}
    </div>
  )
}

export default MyOrderList