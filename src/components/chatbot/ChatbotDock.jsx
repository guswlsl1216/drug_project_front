import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "../ui/Button"
import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons"
import "../../styles/ChatbotDock.css"
import { useEffect, useRef, useState } from "react"
import handler from "../../../api/apiChat"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LoadingSpinner from "../../utils/LoadingSpinner"

const ChatbotDock = ({open, onClose, messages, setMessages, onNewChat}) => {
  const [input, setInput] = useState("")
  const [scope, setScope] = useState("health")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if(!open) return null

  const send = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    try {
      setLoading(true);
      setProgress(0);

      timerRef.current = setInterval(() => {
        setProgress((p) => {
          if (p < 50) return p + Math.random() * 4 + 2;    // 0~50: 매우 빠르게
          if (p < 70) return p + Math.random() * 2 + 1.5;    // 50~70: 빠르게
          if (p < 90) return p + Math.random() * 0.8;        // 70~90: 보통
          if (p < 99) return p + Math.random() * 0.2;      // 90~99: 매우 느리게
          return 99;
        });
      }, 120);

      const { answer } = await handler ({ text, scope }); 
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "죄송해요. 응답을 가져오지 못했어요." },
      ]);
    } finally {
      clearInterval(timerRef.current);
      setLoading(false);
      setProgress(100);

      setTimeout(() => {
        setProgress(0);
      }, 200);  
    }
  };


  return (
    <div className="dock">
      <header className="dock__header">
        <div className="dock__title">
          <h1>영양제·경구약 AI 챗봇</h1>
        </div>
        <div className="dock__actions">
          <button className="icon-btn" aria-label="새 대화" onClick={onNewChat} >
            <FontAwesomeIcon icon={faPenToSquare} size="lg" />
          </button>
          <button className="icon-btn" onClick={onClose} aria-label="창 닫기">
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>
      </header>

      <div className="dock__body" ref={bodyRef}>
        {messages.length === 0 ? (
          <div className="dock__suggest">
            <h3 className="lead">
              고객님, 안녕하세요<br />
              어떤 정보를 찾아드릴까요?<br />
              <span className="accent">복용약 / 영양제 / 병용섭취 주의</span> 중에서 선택해주세요.
            </h3>

            <div className="cats">
              <Button 
                variant="text" 
                className={`cat-btn ${scope==='health' ? 'active' : ''}`}
                onClick={() => setScope('health')}
                title="복용약"
              >
                복용약
              </Button>
              <Button 
                variant="text" 
                className={`cat-btn ${scope==='drug' ? 'active' : ''}`}
                onClick={() => setScope('drug')}
                title="영양제"
              >
                영양제
              </Button>
              <Button 
                variant="text" 
                className={`cat-btn ${scope==='all' ? 'active' : ''}`}
                onClick={() => setScope('all')}
                title="영양제 – 의약품 병용섭취 주의"
              >
                영양제 – 의약품 병용섭취 주의
              </Button>
            </div>
            <div className="chips">
              <div className="chips__title">추천 질문</div> 
              {[
                "오메가3와 와파린 같이 먹어도 돼?",
                "불면에 좋은 영양제 추천해줘",
                "아세트아미노펜 정보 보여줘",
                "상호작용 주의해야 할 조합 알려줘",
                "눈건강에 뭐가 좋아?"
              ].map((q,i) => {
                return(
                <Button key={i} variant="text" className="chip" onClick={()=>{ setInput(q); setTimeout(()=>send(),0)}}>
                  <span className="plus">＋</span> {q}
                </Button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="msgs">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.role === "assistant" ? (
                  <div className="md">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                    >{m.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <span className="user-text">{m.text}</span>
                )}
              </div>))}
              {loading && (
                <div className="msg assistant loading-box">
                  <LoadingSpinner size={20} />
                  <span className="loading-text">응답 생성 중... {Math.floor(progress)}%</span>
                </div>
              )}
          </div>
        )}
      </div>

      <div className="dock__disclaimer">
        ※ AI 챗봇의 답변은 참고용이며, 의약 전문가의 상담을 대체하지 않습니다.
      </div>

      <form className="dock__input" onSubmit={send}>
        <input 
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="무엇이든 물어보세요."
        />
        <Button type="submit" variant="text" className="send" disabled={loading}>
          {loading ? "보내는 중... " : "보내기"}
        </Button>
      </form>
      
    </div>
  )
}

export default ChatbotDock