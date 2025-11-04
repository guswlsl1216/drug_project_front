import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "../ui/Button"
import { faCommentMedical, faXmark } from "@fortawesome/free-solid-svg-icons"
import "../../styles/ChatbotDock.css"
import { useEffect, useRef, useState } from "react"

const ChatbotDock = ({open, onClose, messages, setMessages, onNewChat}) => {
  const [input, setInput] = useState("")
  const bodyRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if(!open) return null

  const send = (e) => {
    e?.preventDefault()
    const text = input.trim()
    if (!text) return
    setMessages(prev => [...prev, `${text}`])
    setInput("")
  }

  return (
    <div className="dock">
      <header className="dock__header">
        <div className="dock__title">
          <h1>영양제·경구약 AI 챗봇</h1>
        </div>
        <div className="dock__actions">
          <button aria-label="새 대화" onClick={onNewChat} >
            <FontAwesomeIcon icon={faCommentMedical} />
          </button>
          <button onClick={onClose} aria-label="창 닫기">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </header>

      <div className="dock__body" ref={bodyRef}>
        {messages.length === 0 ? (
          <div className="dock__suggest">
            <h3>
              <span className="accent">AI Chat</span>과 대화를 시작해볼까요?
            </h3>
            <div className="chips">
              <Button variant="text">복용약</Button>
              <Button variant="text">영양제</Button>
              <Button variant="text">영양제 – 의약품 병용섭취 주의</Button>
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
            {messages.map((m, i) => <div key={i} className="msg">{m}</div>)}
          </div>
        )}
      </div>

      <form className="dock__input" onSubmit={send}>
        <input 
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="무엇이든 물어보세요."
        />
        <Button type="submit" variant="text" className="send">보내기</Button>
      </form>
      
    </div>
  )
}

export default ChatbotDock