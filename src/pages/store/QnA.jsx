import { useParams } from "react-router-dom";
import { useUser } from "../../components/context/UserContext";
import { useEffect, useState } from "react";
import requestHandler from "../../utils/requestHandler";
import "../../styles/QnA.css";
import Changehandler from "../../utils/Changehandler";
import Button from "../../components/ui/Button";
import UseNavi from "../../utils/UseNavi";

const QnA = () => {
  const { goodsId } = useParams(); // URL에서 상품 ID 가져오기
  const { isLoggedIn, user } = useUser(); // 로그인 상태 및 사용자 정보
  const { goTo } = UseNavi();

  // Q&A 목록 상태
  const [qnaList, setQnaList] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  // 질문 등록 폼 상태
  const [formData, setFormData] = useState({
    question_title: "",
    question_content: "",
    is_private: false,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleFormChange = Changehandler(setFormData);

  const fetchQnAList = async () => {
    setListLoading(true);
    await requestHandler({
      method: "get",
      url: `/qna/${goodsId}`,
      setLoading: setListLoading,
      onSuccess: (data) => {
        setQnaList(data.qna_list);
      },
      onError: (msg) => {
        console.error("Q&A 목록 불러오기 실패:", msg);
      },
    });
  };

  useEffect(() => {
    if (goodsId) {
      fetchQnAList();
    }
  }, [goodsId]);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setFormMessage(null);
    setError(null);

    if (!isLoggedIn) {
      setError("로그인 후 질문을 등록할 수 있습니다.");
      return;
    }

    if (!formData.question_title || !formData.question_content) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const fd = new FormData();
    fd.append("question_title", formData.question_title);
    fd.append("question_content", formData.question_content);
    fd.append("is_private", formData.is_private);

    await requestHandler({
      method: "post",
      url: `/qna/${goodsId}`,
      payload: fd,
      setLoading: setFormLoading,
      onSuccess: (data) => {
        setFormMessage(data.message);
        setFormData({
          question_title: "",
          question_content: "",
          is_private: false,
        });
        fetchQnAList();
      },
      onError: (msg) => {
        setError(msg || "질문 등록에 실패했습니다.");
      },
    });
  };

  const isQuestioner = (qnaUserNickname) => {
    return isLoggedIn && user && user.nickname === qnaUserNickname;
  };

  return (
    <>
      <div className="qna-section">
        <h3>상품 Q&A</h3>

        {/* --- 1. 질문 등록 폼 --- */}
        <div className="qna-form-container">
          <h4>질문하기</h4>

          {formMessage && <div className="qna-success-message">{formMessage}</div>}
          {error && <div className="qna-error-message">{error}</div>}

          {isLoggedIn ? (
            <form onSubmit={handleQuestionSubmit} className="question-form">
              <div className="form-group">
                <input type="text" name="question_title" placeholder="제목을 입력해주세요." value={formData.question_title} onChange={handleFormChange} disabled={formLoading} />
              </div>
              <div className="form-group">
                <textarea
                  name="question_content"
                  rows="4"
                  placeholder="내용을 입력해주세요. (비방, 욕설, 광고성 글은 삭제될 수 있습니다.)"
                  value={formData.question_content}
                  onChange={handleFormChange}
                  disabled={formLoading}
                />
              </div>
              <div className="form-action-row">
                <label className="private-checkbox">
                  <input
                    type="checkbox"
                    name="is_private"
                    checked={formData.is_private}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_private: e.target.checked }))}
                    disabled={formLoading}
                  />
                  비밀글로 작성
                </label>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "등록 중..." : "질문 등록"}
                </Button>
              </div>
            </form>
          ) : (
            <p className="login-prompt">
              상품에 대해 궁금한 점이 있으신가요?{" "}
              <span className="text-primary" onClick={() => goTo("/login")}>
                로그인
              </span>{" "}
              후 질문을 등록해주세요.
            </p>
          )}
        </div>

        {/* --- 2. Q&A 목록 --- */}
        <div className="qna-list-container">
          {listLoading ? (
            <p className="loading-state">Q&A 목록을 불러오는 중...</p>
          ) : qnaList.length > 0 ? (
            <ul className="qna-list">
              {qnaList.map((qna) => (
                <li key={qna.id} className={`qna-item ${qna.answer ? "answered" : "pending"}`}>
                  {/* 질문 영역 */}
                  <div className="qna-question">
                    <span className="q-badge">Q</span>
                    <span className="q-title">
                      {qna.is_private && <span className="private-tag">🔒 비밀글</span>}
                      {qna.title}
                    </span>
                    <span className="q-author">{qna.user_nickname}</span>
                    <span className="q-date">{qna.created_at.split(" ")[0]}</span>
                  </div>

                  {/* 질문 내용 (비밀글 처리) */}
                  <div className="qna-content">{qna.is_private && !isQuestioner(qna.user_nickname) ? "작성자 또는 관리자만 확인할 수 있는 비밀글입니다." : qna.question}</div>

                  {/* 답변 영역 */}
                  {qna.answer && (
                    <div className="qna-answer">
                      <span className="a-badge">A</span>
                      <div className="a-content">
                        {qna.answer}
                        <span className="a-date">({qna.answered_at})</span>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">아직 등록된 Q&A가 없습니다. 첫 질문을 남겨보세요!</p>
          )}
        </div>
      </div>
    </>
  );
};

export default QnA;
