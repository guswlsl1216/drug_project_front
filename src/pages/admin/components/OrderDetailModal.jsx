import { useEffect, useState } from "react"
import requestHandler from "../../../utils/requestHandler"
import time from "../../../utils/time"
import "./OrderDetailModal.css"
import Button from "../../../components/ui/Button"
import LoadingSpinner from "../../../utils/LoadingSpinner"

const OrderDetailModal = ({payment, onClose}) => {
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      await requestHandler({
        method: "get",
        url: `/admin/orders/${payment.orders_id}`,
        onSuccess: (data) => setOrder(data.order),
        onError: (msg) => alert(msg)
      })
    }
    fetchOrder()
  }, [payment])

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

  const formatMethod = (method) => {
    // DB에 저장된 값 기준으로 매핑
    switch (method) {
      case "카드": return "카드";
      case "간편결제": return "간편결제";
      case "가상계좌": return "가상계좌";
      case "계좌이체": return "계좌이체";
      case "휴대폰": return "휴대폰결제";
      default: return method || "-";
    }
  };

  // 로딩 중일 때도 모달 레이아웃 유지
  if (!order) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <LoadingSpinner size={25} label="로딩 중..." />
        </div>
      </div>
    )
  }

  return(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>주문 상세 내역</h2>
        <section>
          <h3>기본 정보</h3>
          <p><b>주문번호:</b>{order.id}</p>
          <p><b>주문일자:</b>{time(order.payment_at)}</p>
          <p><b>수령인:</b>{order.receiver}</p>
          <p><b>연락처:</b>{order.phone}</p>
          <p><b>주소:</b>{order.address} {order.address_detail}</p>
        </section>

        <section>
          <h3>결제 정보</h3>
          <p><b>결제금액:</b>₩{payment.amount.toLocaleString()}</p>
          <p><b>결제수단:</b>{formatMethod(payment.method)}</p>
          <p><b>결제상태:</b>{formatStatus(payment.status)}</p>
          <p><b>결제일:</b>{payment.paid_at ? time(payment.paid_at) : "-"}</p>
          {payment.status === "CANCELLED" && (
            <>
              <p><b>취소사유:</b> {payment.cancel_reason || "-"}</p>
              <p><b>취소일:</b> {payment.cancelled_at ? time(payment.cancelled_at) : "-"}</p>
            </>
          )}
        </section>

        <section>
          <h3>주문 상품</h3>
          <table>
            <thead>
              <tr>
                <th>상품명</th>
                <th>단가</th>
                <th>수량</th>
                <th>소계</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((it, i) => (
                <tr key={i}>
                  <td>{it.goods_name}</td>
                  <td>{it.unit_price.toLocaleString()}</td>
                  <td>{it.count}</td>
                  <td>{it.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>닫기</Button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailModal