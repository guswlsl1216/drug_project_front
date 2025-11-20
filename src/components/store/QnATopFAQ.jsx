import { useState } from "react";
import "../../styles/QnA.css";

const QnATopFAQ = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`qa-item ${isOpen ? "open" : ""}`}>
      <button 
        className="qa-question"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span>제품 문의에 대한 답변은 언제 받을 수 있나요?</span>

        {/* + 아이콘 */}
        <svg className="icon plus" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>

        {/* × 아이콘 */}
        <svg className="icon close" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>

      <div className="qa-answer">
        문의 내용은 보통 24시간 이내에 답변드립니다.
      </div>
    </div>
  );
};

export default QnATopFAQ;
