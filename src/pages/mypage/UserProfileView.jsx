import { useEffect, useState } from "react";
import { useUser } from "../../components/context/UserContext";
import Button from "../../components/ui/Button";
import UseNavi from "../../utils/UseNavi";
import requestHandler from "../../utils/requestHandler";
import LoadingSpinner from "../../utils/LoadingSpinner";
import time from "../../utils/time";
import { TfiAngleRight } from "react-icons/tfi";
import "../../styles/mypage/UserProfileView.css"

const UserProfileView = () => {
  const { user } = useUser();
  const { goTo } = UseNavi()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true);  
  const [point, setPoint] = useState(0)

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

    await requestHandler({
      method: "get",
      url: "/mypage/point",
      onSuccess: (data) => {
        setPoint(data.point ?? 0);
      },
      onError: () => {
        setPoint(0);
      }
    })
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <LoadingSpinner label="내 정보 불러오는 중..." />
  
  return (
    <div className="mypage-wrapper">
      <div className="mypage-username-box">
        <h3 className="mypage-username">{user.nickname}님</h3>
      </div>

      <div 
        className="mypage-point-box clickable"
        onClick={() => {goTo("/mypage/points")}}
      >
        <h5 className="mypage-section-title">보유 포인트</h5>
        <div className="mypage-point-row">
          <p className="mypage-point-value">{point.toLocaleString()} P</p>
        </div>
        <span className="mypage-point-arrow">적립내역<TfiAngleRight /></span>
      </div>

      <section className="mypage-order-section">
        <div className="mypage-order-header">
          <h5 className="mypage-section-title">최근 주문 내역</h5>
          <Button
            variant="text"
            className="mypage-order-view-all"
            onClick={() => goTo(
              "/myOrderList"
            )}
          >
            전체보기
          </Button>
        </div>
        {orders.length === 0 ? (
          <p className="mypage-no-order">최근 주문이 없습니다.</p>
        ) : (
          <table className="mypage-order-table">
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>주문일시</th>
                  <th>상품명/주문금액/수량</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const mainItem = o.main_item;;   // 첫번째 상품
                  const extraCount = o.extra_count; // 나머지 상품 개수

                  return(
                    <tr key={o.id || o.order_code}>
                      <td className="order-code">{o.order_code}</td>
                      <td className="order-date">{time(o.payment_at)}</td>
                      <td 
                        className="order-info" 
                        onClick={() => {
                          goTo("/myOrderDetail", {
                            order: {
                              order_id: o.id
                            }
                          })
                      }}>
                        {mainItem && (
                            <div className="order-item">
                              {mainItem.image && (
                                <img
                                  src={mainItem.image}
                                  alt={mainItem.goods_name}
                                  className="order-item-image"
                                />
                              )}
                              <div className="order-item-text">
                                <div className="order-item-name">
                                  {mainItem.goods_name}
                                  {extraCount > 0 && (
                                    <span className="order-item-extra">
                                      {" "}외 {extraCount}건
                                    </span>
                                  )}
                                </div>
                                <div className="order-item-details">
                                  {o.final_amount?.toLocaleString()}원 /{" "}
                                  {o.total_count}개
                                </div>
                                <div className="order-item-detail-btn">
                                  상세보기<TfiAngleRight />
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

      <div className="mypage-btn-area">
        <Button
          variant="secondary"
          className="mypage-edit-btn"
          onClick={() => goTo(
            "/mypage/usercheck", {
              next: "/mypage/userinfo"
            }
          )}
        >
          회원정보 변경하기
        </Button>
      </div>
    </div>
  )
}

export default UserProfileView