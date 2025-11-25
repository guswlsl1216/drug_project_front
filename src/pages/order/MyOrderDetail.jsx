import { useLocation } from "react-router-dom";
import "../../styles/order/MyOrderDetail.css"
import requestHandler from "../../utils/requestHandler";
import { useEffect, useState } from "react";
import time from "../../utils/time";
import LoadingSpinner from "../../utils/LoadingSpinner";
import { GoArrowLeft } from "react-icons/go";
import Button from "../../components/ui/Button";
import UseNavi from "../../utils/UseNavi";

const MyOrderDetail = () => {
  const location = useLocation();
  const state = location.state || {};
  const orderId = state.order?.order_id || 0 // type:number
  const [order, setOrder] = useState()
  const [loading, setLoading] = useState(false);
  const {goTo} = UseNavi()

  const load = async () => {
    await requestHandler({
      method:"get",
      url:`/orders/${orderId}`,
      setLoading,
      onSuccess: (data) => {
        setOrder(data.order)
      }
    })
  }

  useEffect(() => {
    if (!orderId) return
    load()
  }, [orderId])

  const formatStatus = (status) => {
    switch (status) {
      case "DONE": return "결제완료";
      case "CANCELED": return "취소";
      case "PARTIAL_CANCELED": return "부분취소";
      case "READY": return "대기";
      case "IN_PROGRESS": return "진행중";
      case "WAITING_FOR_DEPOSIT": return "입금대기";
      case "ABORTED": return "실패";
      case "EXPIRED": return "만료";
      default: return status || "-";
    }
  };

  if (loading || !order) {
    return (
      <div className="myorder-detail loading">
        <LoadingSpinner size={30} label="주문 정보를 불러오는 중입니다..." />
      </div>
    );
  }

  const payment = order?.payment || {};

  return (
    <div className="myorder-detail-page">
      <div className="myorder-detail">

        <div className="myorder-detail__title">
          <h2 className="myorder-detail__title-text">주문 상세</h2>
          <Button
            variant="text"
            className="back-to-list-btn"
            onClick={() => goTo("/myOrderList")}
          >
            <GoArrowLeft />주문 내역으로
          </Button>
        </div>

        <div className="myorder-detail__ordercode">
          <h6 className="ordercode-title">
            주문번호
            <span className="ordercode-number">{order.order_code}</span>
          </h6>
        </div>

        <div className="myorder-detail__section">
          <h5 className="section-title">주문상품</h5>
          <div className="order-products">
            {order.items?.map((item) => {
              return (
                <div className="order-product-item" key={item.id}>
                    <div className="order-product-thumb">
                      <img src={item.image} alt={item.goods_name} />
                    </div>
                    <div className="order-product-info">
                      <p className="order-product-name">{item.goods_name}</p>
                      <p className="order-product-price">
                        {item.unit_price.toLocaleString()}원 
                        <span className="order-product-count"> × {item.count}개</span>
                      </p>
                    </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="myorder-detail__section">
          <h5 className="section-title">주문정보</h5>
          <p className="payment-row">
            <span className="payment-label">주문일자</span>
            <strong className="payment-value">{time(order.payment_at)}</strong>
          </p>
          <p className="payment-row">
            <span className="payment-label">주문상태</span>
            <strong className="payment-value">
              {formatStatus(payment.status)}
            </strong>
          </p>
        </div>
        
        <div className="myorder-detail__section">
          <h5 className="section-title">배송지</h5>
          <div className="order-address-box">
            <p className="address-name"><strong className="bold">{order.receiver}</strong></p>
            <p className="address-phone">{order.phone}</p>
            <p className="address-full">
              {order.address} {order.address_detail}
              <span className="zipcode"> ({order.zipcode})</span>
            </p>
          </div>
        </div>

        <div className="myorder-detail__section">
          <h5 className="section-title">결제정보</h5>
          <div className="order-payment-box">
            <p className="payment-row">
              <span className="payment-label">주문금액</span>
              <strong className="payment-value">
                {order.final_amount.toLocaleString()}원
              </strong>
            </p>

            <p className="payment-row">
              <span className="payment-label">상품 금액</span>
              <strong className="payment-value">
                {order.items_total.toLocaleString()}원
              </strong>
            </p>

            <p className="payment-row">
              <span className="payment-label">적립금 사용</span>
              <strong className="payment-value">
                - {order.used_points.toLocaleString()}원
              </strong>
            </p>

            <p className="payment-row">
              <span className="payment-label">배송비</span>
              <strong className="payment-value">
                {order.shipping_fee.toLocaleString()}원
              </strong>
            </p>

            <p className="payment-row">
              <span className="payment-label">결제수단</span>
              <strong className="payment-value">{payment.method || "-"}</strong>
            </p>
            
            <p className="payment-row">
              <span className="payment-label">결제상태</span>
              <strong className="payment-value">
                {formatStatus(payment.status)}
              </strong>
            </p>

            <p className="payment-row">
              <span className="payment-label">결제일</span>
              <strong className="payment-value">
                {payment.paid_at && time(payment.paid_at)}
              </strong>
            </p>

          </div>
        </div>

        <div className="myorder-detail__section point-benefit">
          <h5 className="section-title">포인트 혜택</h5>
          <div className="point-benefit-box">
            <p className="point-row">
              <span className="point-label">구매적립</span>
              <strong className="point-value">
                {order.saved_points.toLocaleString()}원
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyOrderDetail