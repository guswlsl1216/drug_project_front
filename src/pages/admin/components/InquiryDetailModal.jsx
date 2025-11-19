import { useState } from "react"
import "./InquiryDetailModal.css"
import time from "../../../utils/time"
import Button from "../../../components/ui/Button"
import requestHandler from "../../../utils/requestHandler"

const InquiryDetailModal = ({inquiry, onClose, onSaved, canAnswer}) => {
  const [answer, setAnswer] = useState(inquiry.answer_content || "")
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      return alert("답변 내용을 입력해주세요.");
    }

    await requestHandler({
      method: "post",
      url:`/admin/inquiry/${inquiry.id}`,
      payload: { answer },
      setLoading: setSaving, 
      onSuccess: (data) => {
        alert(data.message);
        onSaved && onSaved();       
        onClose();                  // 모달 닫기
      },
      onError: (msg) => {
        alert(msg || "답변 등록에 실패했습니다.");
      },
    })
    
  }

  return (
    <div className="inqu-modal-backdrop" onClick={onClose}>
      <div
        className="inqu-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="inqu-modal-header">
          <div className="inqu-header-left">
            <div className="inqu-header-icon">Q</div>
            <div>
              <div className="inqu-header-title">문의 상세</div>
              <div className="inqu-header-sub">
                #{inquiry.id} · {time(inquiry.created_at)}
              </div>
            </div>
          </div>

          <div className="inqu-header-badges">
            <span className={`status-chip status-${inquiry.status}`}>
              {inquiry.status_label}
            </span>
            <span
              className={`visibility-chip ${
                inquiry.is_private ? "private" : "public"
              }`}
            >
              {inquiry.visibility_label}
            </span>
          </div>
        </header>

        <div className="inqu-modal-body">
          <section className="inqu-meta-row">
            <div className="meta-item">
              <span className="meta-label">문의자</span>
              <span className="meta-value">{inquiry.user.nickname}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">상품번호</span>
              <span className="meta-value">{inquiry.goods?.id ?? inquiry.goods_id}</span>
              {inquiry.goods?.image && (
                <img
                  className="meta-thumb"
                  src={inquiry.goods.image}
                  alt={inquiry.goods.goods_name}
                />
              )}
            </div>
          </section>

          <section className="inqu-section">
            <h3 className="section-title">문의 제목</h3>
            <div className="section-box">{inquiry.question_title}</div>

            <h3 className="section-title with-margin-top">문의 내용</h3>
            <div className="section-box section-box-text">
              {inquiry.question_content}
            </div>
          </section>

          <section className="inqu-section">
            <h3 className="section-title">관리자 답변</h3>
            {canAnswer ? (
              <form onSubmit={handleSave} className="answer-form">
                <textarea
                  className="answer-textarea"
                  rows={6}
                  onChange={(e) => setAnswer(e.target.value)}
                  value={answer}
                  placeholder="답변 내용을 입력하세요."
                />
                <div className="inqu-modal-actions">
                  <Button variant="secondary" onClick={onClose}>
                    닫기
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={saving}
                  >
                    {saving ? "저장 중..." : "답변 완료"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="section-box section-box-text">
                {inquiry.answer_content || "등록된 답변이 없습니다."}
              </div>
            )}

            {inquiry.answered_at && (
              <div className="answer-meta">
                <span className="answer-meta-label">답변일</span>
                <span className="answer-meta-value">
                  {time(inquiry.answered_at)}
                </span>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default InquiryDetailModal