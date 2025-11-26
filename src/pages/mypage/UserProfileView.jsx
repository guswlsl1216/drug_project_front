import { useEffect, useState } from "react";
import { useUser } from "../../components/context/UserContext";
import Button from "../../components/ui/Button";
import UseNavi from "../../utils/UseNavi";
import requestHandler from "../../utils/requestHandler";
import LoadingSpinner from "../../utils/LoadingSpinner";
import time from "../../utils/time";
import { TfiAngleRight } from "react-icons/tfi";

const UserProfileView = () => {
  const { user } = useUser();
  const { goTo } = UseNavi()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true);  

  const load = async () => {
    await requestHandler({
      method: "get",
      url: "/mypage/order",
      setLoading,
      onSuccess: (data) => {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      },
      onError: () => {
        setOrders([]);
      }
    })
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <LoadingSpinner label="내 정보 불러오는 중..." />
  
  return (
    <div>
      <div>
        <h3>{user.nickname}님</h3>
      </div>

      <div>
        <h5>보유 포인트</h5>
        <p></p>
      </div>

      <section className="recent-orders">
        <h5>최근 주문 내역</h5>
        <Button
          variant="text"
          onClick={() => goTo(
            "/myOrderList"
          )}
        >
          전체보기
        </Button>
        {orders.length === 0 ? (
          <p>최근 주문이 없습니다.</p>
        ) : (
          <table className="">
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
        )}
      </section>

      <div>
        <Button
          variant="secondary"
          onClick={() => goTo(
            "/mypage/usercheck", {
              next: "/mypage/userinfo"
            }
          )}
        >
          회원정보 수정
        </Button>
        <Button
         variant="danger"
        >
          탈퇴하기
        </Button>
      </div>
    </div>
  )
}

export default UserProfileView