import { useEffect, useState } from "react"
import Button from "../../components/ui/Button"
import "../../styles/admin/OrderHistory.css"
import Pagination from "../../components/ui/Pagination"
import requestHandler from "../../utils/requestHandler"
import LoadingSpinner from "../../utils/LoadingSpinner"
import time from "../../utils/time"
import OrderDetailModal from "./components/OrderDetailModal"

const OrderHistory = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [selected, setSelected] = useState(null)
  const [approvedSum, setApprovedSum] = useState(0);
  const [cancelledSum, setCancelledSum] = useState(0);
  const [refundedSum, setRefundedSum] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    method: "",
    query: ""
  })

  const netSales = approvedSum - cancelledSum - refundedSum;

  const load = async () => {
    await requestHandler({
      method: "get",
      url: "/admin/payments",
      params : {
        page, 
        per_page: perPage,
        status: filters.status,
        method: filters.method,
        query: filters.query
      },
      setLoading,
      onSuccess: (data) => {
        setPayments(Array.isArray(data.payments) ? data.payments : []);
        setTotal(typeof data.total === "number" ? data.total : 0);
        setPages(typeof data.pages === "number" ? data.pages : 1);
        setPerPage(typeof data.per_page === "number" ? data.per_page : 10);
        setApprovedSum(typeof data.approved_sum === "number" ? data.approved_sum : 0);
        setCancelledSum(typeof data.cancelled_sum === "number" ? data.cancelled_sum : 0);
        setRefundedSum(typeof data.refunded_sum === "number" ? data.refunded_sum : 0);
      },
      onError: (msg) => {
        alert(msg)
        setPayments([])
        setTotal(0)
        setPages(1)
        setApprovedSum(0)
        setCancelledSum(0)
        setRefundedSum(0)
      },
    })
  }

  useEffect(() => {
    load()
  }, [page, perPage, filters])

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

  return(
    <div className="order-history">
      <form 
        className="order-history__filter"
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          setPage(1)
          setFilters({
            status: fd.get("status") || "",
            method: fd.get("method") || "",
            query: fd.get("query") || ""
          })
        }}
      >
        <label className="order-history__filter-label">
          결제상태
          <select name="status" className="order-history__select">
            <option value="">전체</option>
            <option value="DONE">결제완료</option>
            <option value="CANCELED">취소</option>
            <option value="PARTIAL_CANCELED">부분취소</option>
            <option value="WAITING_FOR_DEPOSIT">입금대기</option>
            <option value="READY">대기</option>
            <option value="IN_PROGRESS">진행중</option>
            <option value="ABORTED">실패</option>
            <option value="EXPIRED">만료</option>
          </select>
        </label>

        <label className="order-history__filter-label">
          결제방법
          <select name="method" className="order-history__select">
            <option value="">전체</option>
            <option value="카드">카드</option>
            <option value="간편결제">간편결제</option>
            <option value="가상계좌">가상계좌</option>
            <option value="계좌이체">계좌이체</option>
            <option value="휴대폰">휴대폰</option>
          </select>
        </label>

        <input 
          type="text" 
          name="query" 
          placeholder="주문자명 또는 주문ID 검색" 
          className="order-history__search"
        />
        <Button type="submit" variant="primary" className="order-history__search-btn">
          검색
        </Button>

        <label className="order-history__perpage">
          <span>표시 개수</span>
          <select
            className="order-history__select"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </form>

      {loading ? (
        <div className="order-history__loading">
          <LoadingSpinner size={30} label="거래 내역 불러오는 중..." />
        </div>
      ) : payments.length ? (
        <>
          <table className="order-history__table">
            <thead>
              <tr>
                <th>주문ID</th>
                <th>주문/결제일자</th>
                <th>주문자</th>
                <th>결제금액</th>
                <th>상태</th>
                <th>결제수단</th>
                <th>상세보기</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => {
                const orderId = p?.orders_id;
                const paidAt = p?.paid_at || p?.orders?.payment_at;
                return (
                  <tr key={i} className="order-history__row">
                    <td className="order-history__cell id">{orderId}</td>
                    <td className="order-history__cell date">
                      {paidAt ? time(paidAt) : "-"}
                    </td>
                    <td className="order-history__cell user">
                      {p.user_nickname || "-"}
                    </td>
                    <td className="order-history__cell amount">
                      {Number(p?.amount || 0).toLocaleString()}
                    </td>
                    <td
                      className={`order-history__cell status ${String(
                        p?.status || ""
                      ).toLowerCase()}`}
                    >
                      {formatStatus(p?.status)}
                    </td>
                    <td className="order-history__cell method">{formatMethod(p?.method)}</td>
                    <td className="order-history__cell detail">
                      <Button 
                        variant="text" 
                        className="order-history__view-btn"
                        onClick={() => setSelected(p)}
                      >
                        보기
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <Pagination 
            page={page}
            pages={pages}
            loading={loading}
            onChange={(num) => setPage(num)}
          />
          <div className="order-history__summary">
            <p>총 <b>{total.toLocaleString()}</b>건</p>
            {/* 전체 매출 요약은 항상 고정 */}
            <p>
              (결제완료 {Number(approvedSum).toLocaleString()}원, 
               취소 {Number(cancelledSum).toLocaleString()}원, 
               환불 {Number(refundedSum).toLocaleString()}원)
            </p>
            <p>순매출: {Number(netSales).toLocaleString()}원</p>
          </div>

          {selected && (
            <OrderDetailModal 
              payment={selected}
              onClose={() => setSelected(null)}
            />
          )}
        </>
      ) : (
        <div className="order-history__empty">주문 내역이 없습니다.</div> 
      ) }
    </div>
  )
}

export default OrderHistory