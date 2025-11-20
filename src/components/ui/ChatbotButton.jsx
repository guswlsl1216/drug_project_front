import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "./Button"
import { faOpenai } from "@fortawesome/free-brands-svg-icons"
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import "../../styles/ChatbotButton.css"
import { useEffect, useState } from "react";

const ChatbotButton = ({onClick}) => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toTopHandler = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="cb-fab">
      <div className={`to_top ${showTopBtn ? 'show' : ''}`}>
        <Button
          variant="outline"
          className="top_btn"
          onClick={toTopHandler}
          aria-label="맨 위로 가기"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </Button>
      </div>

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