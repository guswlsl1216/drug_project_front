import { useEffect, useState } from "react"
import "../../styles/admin/InquiryList.css"
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../utils/LoadingSpinner";
import time from "../../utils/time";
import Pagination from "../../components/ui/Pagination";
import requestHandler from "../../utils/requestHandler";
import InquiryDetailModal from "./components/InquiryDetailModal";

const InquiryList = ({mode = "all"}) => {
  const isPendingMode = mode === "pending";
  const [qna, setQnA] = useState([])
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [filters, setFilters] = useState({
    status: isPendingMode ? "pending" : "",
    query: ""
  })
  const [selected, setSelected] = useState(null)  


  const load = async () => {
    await requestHandler({
      method: "get",
      url: "/admin/inquiry",
      params : {
        page, 
        per_page: perPage,
        status: filters.status,
        query: filters.query
      },
      setLoading,
      onSuccess: (data) => {
        setQnA(Array.isArray(data.qna) ? data.qna : []);
        setTotal(typeof data.total === "number" ? data.total : 0);
        setPages(typeof data.pages === "number" ? data.pages : 1);
        setPerPage(typeof data.per_page === "number" ? data.per_page : 10);
      },
      onError: (msg) => {
        alert(msg)
        setQnA([])
        setTotal(0)
        setPages(1)
      },
    })
  }

  useEffect(() => {
    load()
  }, [page, perPage, filters])

  return (
    <div className="inquiry-list">
      <div className="inquiry-header">
        <h2 className="inquiry-title">문의 내역</h2>

        <div className="inquiry-filter-wrap">
          <form 
            className="inquiry-filter-form"
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              setPage(1)
              setFilters({
                status: fd.get("status") || "",
                query: fd.get("query") || ""
              })
            }}
          >
            {!isPendingMode && (
              <label className="filter-field">
                <span className="filter-label">답변상태</span>
                <select name="status" className="filter-select" defaultValue={filters.status}>
                  <option value="">전체</option>
                  <option value="pending">답변대기</option>
                  <option value="answered">답변완료</option>
                </select>
              </label>
            )}
            <div className="filter-search">
              <input 
                type="text" 
                name="query" 
                placeholder="문의자명 또는 문의상품ID 검색" 
                className="filter-input"
              />
            </div>
             <div className="filter-actions">
              <Button type="submit" variant="primary" className="filter-submit">
                검색
              </Button>
              <Button variant="secondary" className="filter-refresh" onClick={() => {
                setPage(1)
                setFilters({ 
                  status: isPendingMode ? "pending" : "",
                  query: "" 
                });
              }}>
                새로고침
              </Button>
             </div>

            <label className="filter-field per-page-field">
              <span className="filter-label">표시 개수</span>
              <select
                className="filter-select"
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
        </div>        
      </div>

      {loading ? (
        <div className="inquiry-loading">
          <LoadingSpinner size={30} label="문의 내역 불러오는중" />
        </div>
      ) : qna.length ? (
        <>
          <div className="inquiry-table-wrap">
            <table className="inquiry-table">
              <thead>
                <tr>
                  <th className="col-visibility">번호</th>
                  <th className="col-visibility">상품번호</th>
                  <th>문의 제목</th>
                  <th>문의자</th>
                  <th>등록일</th>
                  <th>답변상태</th>
                  <th className="col-visibility">공개여부</th> 
                </tr>
              </thead>
              <tbody>
                {qna.map((q) => {
                  return(
                    <tr key={q.id}>
                      <td className="col-visibility">{q.id}</td>
                      <td className="col-visibility">{q.goods.id}</td>
                      <td 
                        className="inquiry-title-cell clickable"
                        onClick={() => setSelected(q)}
                      >
                        {q.is_private && <span className="private-icon">🔒</span>}
                        {q.question_title}
                      </td>
                      <td>{q.user.nickname}</td>
                      <td>{time(q.created_at)}</td>
                      <td>
                        <span className={`status-badge status-${q.status}`}>
                          {q.status_label}
                        </span>
                      </td>
                      <td className="col-visibility">
                        <span className={`visibility-badge ${q.is_private ? "private" : "public"}`}>
                          {q.visibility_label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="inquiry-bottom">
            <Pagination
              page={page}
              pages={pages}
              loading={loading}
              onChange={(num) => setPage(num)}
            />
            <div className="inquiry-total">
              총 <b>{total.toLocaleString()}</b>건
            </div>
          </div>
        </>
      ) : (
        <div className="inquiry-empty">
          {filters.status === "answered" 
            ? "답변완료된 문의가 없습니다." 
            : filters.status === "pending"
            ? "답변대기 문의가 없습니다."
            : "등록된 문의가 없습니다."
          }
        </div>
      )}

      {selected && (
        <InquiryDetailModal
          inquiry={selected}
          onClose={() => setSelected(null)}
          onSaved={() => load()}
          canAnswer={isPendingMode}
        />
      )}
    </div>
  )
}

export default InquiryList