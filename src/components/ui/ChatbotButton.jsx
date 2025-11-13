import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "./Button"
import { faOpenai } from "@fortawesome/free-brands-svg-icons"
import "../../styles/ChatbotButton.css"

const ChatbotButton = ({onClick}) => {
  return (
    <div className="cb-fab">
      <div className="cb-fab__stack">
        <Button 
          variant="outline" 
          onClick={onClick} 
          className="cb-fab__btn" 
          aria-label="챗봇 열기"
        >
          <FontAwesomeIcon icon={faOpenai} />
        </Button>
        <span className="cb-fab__badge">챗봇</span>
      </div>
    </div>
  )
}

export default ChatbotButton