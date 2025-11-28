import { useEffect, useState } from "react"
import "../../styles/mypage/PointHistory.css"
import requestHandler from "../../utils/requestHandler"
import LoadingSpinner from "../../utils/LoadingSpinner"
import Pagination from "../../components/ui/Pagination"
import time from "../../utils/time"

const PointHistory = () => {
  const [loading, setLoading] = useState(true)
  const [point, setPoint] = useState(0)
  const [histories, setHistories] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(20)

  const load = async () => {
    await requestHandler({
      method: "get",
      url: "/mypage/point",
      params : {page, per_page: perPage},
      setLoading,
      onSuccess: (data) => {
        setPoint( data.point ?? 0);
        setHistories(Array.isArray(data.histories) ? data.histories : []);
        setTotal(typeof data.total === "number" ? data.total : 0);
        setPages(typeof data.pages === "number" ? data.pages : 1);
        setPerPage(typeof data.per_page === "number" ? data.per_page : 20);
      },
      onError: (msg) => {
        alert(msg)
        setHistories([])
        setTotal(0)
        setPages(1)
      },
    })
  }

  useEffect(() => {
    load()
  }, [page, perPage])

  if (loading) return <LoadingSpinner label="포인트 조회 중..." />

  return (
    <div className="point-wrapper">
      <div className="point-top-box">
        <h3>보유 포인트</h3>
        <p className="point-value">{point.toLocaleString()} P</p>
      </div>

      <h4 className="point-title">포인트 내역</h4>

      { histories.length === 0 ? (
        <p className="point-empty">포인트 내역이 없습니다.</p>
      ) : (
        <ul className="point-list">
          {histories.map((h) => (
            <li className="point-item" key={h.id}>
              <div className="point-left">
                <span className="point-date">{time(h.created_at)}</span>
                <span className="point-desc">{h.description}</span>
              </div>

              <div className="point-right">
                <span className={`point-amount ${h.amount > 0 ? "plus" : "minus"}`}>
                  {h.amount > 0 ? `+${h.amount.toLocaleString?.()}` : h.amount.toLocaleString?.()} P
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        pages={pages}
        loading={loading}
        onChange={(num) => setPage(num)}
      />

    </div>
  )
}

export default PointHistory