import { useParams } from "react-router-dom";
import { useUser } from "../../components/context/UserContext";
import { useEffect, useState } from "react";
import requestHandler from "../../utils/requestHandler";
import "../../styles/QnA.css";
import Changehandler from "../../utils/Changehandler";
import Button from "../../components/ui/Button";
import UseNavi from "../../utils/UseNavi";
import QnATopFAQ from "../../components/store/QnATopFAQ";
import time from "../../utils/time";

const QnA = () => {
  const {goodsId} = useParams(); // URL에서 상품 ID 가져오기
  const {isLoggedIn, user} = useUser(); // 로그인 상태 및 사용자 정보
  const {goTo} = UseNavi()

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

  // 답변 등록 폼 상태
  const [answerFormData, setAnswerFormData] = useState('');
  const [answeringQnaId, setAnsweringQnaId] = useState(null) // 현재 답변 중인 QnA ID 추적
  const [answerLoading, setAnswerLoading] = useState(false)
  const [answerError, setAnswerError] = useState(null)

  const handleFormChange = Changehandler(setFormData);

  // 수정 모드 상태
  const [editingQnaId, setEditingQnaId] = useState(null) // 현재 수정 중인 QnA ID
  const [editFormData, setEditFormData] = useState({
    question_title: '',
    question_content: '',
    answer_content: '',
    is_private: false
  })
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerContent, setEditAnswerContent] = useState("");

  const [editError, setEditError] = useState(null);

  // Q&A 목록 불러오기
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

  // 글 등록 후 메시지 5초 후 사라짐
  useEffect(() => {
  const timeoutIds = [];

  // 폼 등록 메시지
  if (formMessage) {
    timeoutIds.push(setTimeout(() => setFormMessage(null), 5000));
  }
  if (error) {
    timeoutIds.push(setTimeout(() => setError(null), 5000));
  }
  // 답변 등록 에러 메시지 (성공 메시지는 handleAnswerSubmit 내부 alert로 처리되고 있어 별도 처리 필요 없음)
  if (answerError) {
    timeoutIds.push(setTimeout(() => setAnswerError(null), 5000));
  }
  // 수정 에러 메시지
  if (editError) {
    timeoutIds.push(setTimeout(() => setEditError(null), 5000));
  }

  // 컴포넌트 언마운트 시 또는 상태가 변경되어 재실행 시 타이머 정리
  return () => {
    timeoutIds.forEach(id => clearTimeout(id));
  };
}, [formMessage, error, answerError, editError]);

  // 질문 등록하기
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

  const isAdmin = () => {
    return isLoggedIn && user && user.role === 'admin';
  }

  // 답변 등록하기
  const handleAnswerSubmit = async (qnaId) => {
    setAnswerError(null);
    setAnsweringQnaId(qnaId);

    if (!answerFormData.trim()) {
      setAnswerError("답변 내용을 입력해주세요.");
      return
    }

    const fd = new FormData();
    fd.append("answer_content", answerFormData);

    await requestHandler({
      method:'post',
      url:`/qna/${qnaId}/answer`,
      payload:fd,
      setLoading:setAnswerLoading,
      onSuccess:(data) => {
        setFormMessage(data.message);
        setAnswerFormData(''); // 폼 초기화
        setAnsweringQnaId(null);
        fetchQnAList(); // 목록 새로고침
      },
      onError:(msg) => {
        setAnswerError(msg || "답변 등록에 실패했습니다.")
      }
    })
  }


  // 관리자 답변 수정
  const handleAnswerUpdate = async (qnaId) => {
    if (!editAnswerContent.trim()) {
      alert("답변 내용을 입력하세요.");
      return;
    }

    await requestHandler({
      method: "put",
      url: `/qna/${qnaId}/answer`,
      payload: { answer_content: editAnswerContent },
      onSuccess: (data) => {
        setFormMessage(data.message);
        setEditingAnswerId(null);
        setEditAnswerContent("");
        fetchQnAList();
      },
      onError: (msg) => setEditError(msg || "답변 수정 실패")
    });
  };

  const handleDelete = async (qnaId) => {
    if (!window.confirm("정말로 이 질문을 삭제하시겠습니까?")) return;

    await requestHandler({
      method: 'delete',
      url: `/qna/${qnaId}`,
      onSuccess: (data) => {
        setFormMessage(data.message);
        fetchQnAList();
      },
      onError: (msg) => {
        setError(msg || "질문 삭제에 실패했습니다.")
      }
    })
  }

  const handleQuestionUpdate = async (e) => {
    e.preventDefault();
    setEditError(null);

    if (!editFormData.question_title || !editFormData.question_content) {
      setEditError("제목과 내용을 모두 입력해주세요.")
      return;
    }
    
    // PUT 요청 시에는 FormData 대신 JSON Payload를 사용하는 것이 일반적이며,
    // Flask 백엔드가 JSON을 받는 로직이 있으므로 JSON으로 보냅니다.
    const payload = {
      question_title: editFormData.question_title,
      question_content: editFormData.question_content,
      is_private: editFormData.is_private,
    };

    await requestHandler({
      method:'put',
      url:`/qna/${editingQnaId}`,
      payload:payload,
      setLoading: setFormLoading, // 질문 등록/수정 시 공통 로딩 사용
      onSuccess:(data) => {
        setFormMessage(data.message);
        setEditingQnaId(null); // 수정 모드 종료
        setEditFormData({ // 폼 초기화
          question_title: '',
          question_content: '',
          answer_content: '',
          is_private: false
        });
      fetchQnAList();
    },
    onError: (msg) => {
      setEditError(msg || "질문 수정에 실패했습니다.");
    }
  });
};

  const startEdit = (qna) => {
  // 수정 권한: 질문 작성자 본인만 가능. 관리자에게는 질문 수정 권한을 부여하지 않음.
    if (!qna.is_owner) {
      alert("질문 수정 권한이 없습니다.");
      return;
    }
 
    // 답변이 완료된 질문은 작성자도 수정 불가능
    if (qna.status === 'answered') {
      alert("답변이 완료된 질문은 수정할 수 없습니다.");
      return;
    }

    setEditingQnaId(qna.id);
    setEditFormData({
      question_title: qna.title,
      question_content: qna.content,
      answer_content: qna.answer || '',
      is_private: qna.is_private
    });
    setEditError(null);
  }

  return(
    <div className="qna-section">
      <h3>상품 Q&A</h3>
      <span className="of-question">자주 묻는 질문</span>
      <QnATopFAQ />


      {/* --- 질문 등록 폼 --- */}
      <div className="qna-form-container">
        <h4>질문하기</h4>

        {formMessage && <div className="qna-success-message">{formMessage}</div>}
        {error && <div className="qna-error-message">{error}</div>}

        {isLoggedIn ? (
          <form onSubmit={handleQuestionSubmit} className="question-form">
            <div className="form-group">
              <input
                type="text"
                name="question_title"
                placeholder="제목을 입력해주세요."
                value={formData.question_title}
                onChange={handleFormChange}
                disabled={formLoading}
              />
            </div>

            <div className="form-group">
              <textarea
                name="question_content"
                rows="4"
                placeholder="내용을 입력해주세요."
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
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_private: e.target.checked }))
                  }
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
            질문하려면{" "}
            <span className="text-primary" onClick={() => goTo("/login")}>
              로그인
            </span>
            이 필요합니다.
          </p>
        )}
      </div>

      {/* --- Q&A 목록 --- */}
      <div className="qna-list-container">
        {listLoading ? (
          <p className="loading-state">불러오는 중...</p>
        ) : qnaList.length > 0 ? (
          <ul className="qna-list">
            {qnaList.map((qna) => {
              const canView = !qna.is_private || qna.is_owner || isAdmin();

              const isEditing = editingQnaId === qna.id;

              return (
                <li key={qna.id} className="qna-item">
                  {/* --- 질문 영역 --- */}
                  <div className="qna-question">
                    <span className="q-badge">Q</span>
                    <span className="q-title">
                      {qna.is_private && <span className="private-tag">🔒</span>}
                      {qna.title}
                    </span>
                    <span className="q-author">{qna.user_nickname}</span>
                    <span className="q-date">{time(qna.created_at)}</span>

                    {/* (관리자)질문 수정 버튼 제거 */}
                    {(qna.is_owner || isAdmin()) && !isEditing && (
                      <div className="qna-actions">
                        <Button
                          type="button"
                          className="edit-button small"
                          onClick={() => startEdit(qna)}
                        >
                          수정
                        </Button>

                        <Button
                          type="button"
                          className="delete-button small"
                          onClick={() => handleDelete(qna.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleQuestionUpdate} className="edit-question-form">
                      {editError && <div className="qna-error-message">{editError}</div>}
                      <div className="form-group">
                        <input 
                          type="text" 
                          name="question_title"
                          placeholder="제목을 수정해주세요."
                          value={editFormData.question_title}
                          onChange={(e) => setEditFormData(prev => ({...prev, question_title: e.target.value}))}
                          disabled={formLoading}
                         />
                      </div>
                      <div className="form-group">
                        <textarea
                          name="question-content"
                          rows="4"
                          placeholder="내용을 수정해주세요."
                          value={editFormData.question_content}
                          onChange={(e) => setEditFormData(prev => ({...prev, question_content: e.target.value}))}
                          disabled={formLoading}
                        />
                      </div>

                      <div className="form-action-row">
                        <label className="private-checkbox">
                          <input 
                            type="checkbox" 
                            name="is_private"
                            checked={editFormData.is_private}
                            onChange={(e) => 
                              setEditFormData((prev) => ({...prev, is_private: e.target.checked}))
                            }
                            disabled={formLoading}
                          />
                          비밀글로 변경
                        </label>
                        <Button type="submit" disabled={formLoading} className="small">
                          {formLoading ? "수정 중..." : "수정 완료"}
                        </Button>
                        <Button 
                          type="button" 
                          className="small cancel-button"
                          onClick={() => setEditingQnaId(null)}
                          disabled={formLoading}
                        >
                          취소
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="qna-content">  {/* 질문 내용 */}
                      {canView ? qna.content : <span className="private-tag">비밀글입니다</span>}
                    </div>
                  )}

                  {/* --- 답변 영역 --- */}
                  {qna.answer ? (
                    <>
                      <div className="qna-answer">
                        <span className="a-badge">A</span>
                        <div className="a-content">
                          {canView ? (
                            editingAnswerId === qna.id ? (
                              <>
                                <textarea
                                  rows="3"
                                  className="answer-edit-textarea"
                                  value={editAnswerContent}
                                  onChange={(e) => setEditAnswerContent(e.target.value)}
                                />
                                <div className="edit-answer-actions">
                                  <Button
                                    onClick={() => handleAnswerUpdate(qna.id)}
                                    className="small"
                                  >
                                    저장
                                  </Button>
                                  <Button
                                    onClick={() => setEditingAnswerId(null)}
                                    className="small cancel-button"
                                  >
                                    취소
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <>
                              <div className="answer-text-row">
                                {qna.answer}
                                <span className="a-date">({time(qna.answered_at)})</span>
                              </div>
                              </>
                            )
                          ) : (
                            <span className="private-tag">비밀글입니다</span>
                          )}
                        </div>
                      </div>

                      {/* ⭐ 관리자만 답변 수정 버튼 표시 */}
                      {isAdmin() && editingAnswerId !== qna.id && (
                        <Button
                          className="edit-button small"
                          onClick={() => {
                            setEditingAnswerId(qna.id);
                            setEditAnswerContent(qna.answer);
                          }}
                        >
                          답변 수정
                        </Button>
                      )}
                    </>
                  ) : (
                    isAdmin() && (
                      <div className="admin-answer-form">
                        <textarea
                          rows="3"
                          placeholder="관리자 답변을 입력하세요."
                          value={qna.id === answeringQnaId ? answerFormData : ""}
                          onChange={(e) => {
                            setAnsweringQnaId(qna.id);
                            setAnswerFormData(e.target.value);
                          }}
                        />
                        <Button
                          onClick={() => handleAnswerSubmit(qna.id)}
                          disabled={answerLoading}
                        >
                          {answerLoading && qna.id === answeringQnaId
                            ? "등록 중..."
                            : "답변 등록"}
                        </Button>

                        {answerError && qna.id === answeringQnaId && (
                          <div className="answer-error-text">{answerError}</div>
                        )}
                      </div>
                    )
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="empty-state">질문이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default QnA;
