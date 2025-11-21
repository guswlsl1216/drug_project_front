import Button from "../components/ui/Button"
import UseNavi from "../utils/UseNavi";
import "../styles/auth/SignupComplete.css";
import { replace } from "react-router-dom";

const SignupComplete = () => {

  const { goTo } = UseNavi();
  const handleClick = () => {
    goTo("/login", {fromSignupComplete:true}, true); // replace:true
  }

  return (
    <div className="signup-complete-wrapper">  
      <h3 className="signup-complete-message">
        환영합니다.
        ai분석 기능으로 스마트한 약 복용을 시작하세요.
      </h3>
      <Button className="signup-complete-btn" variant="primary" onClick={handleClick}>로그인 하러가기</Button>
    </div>
  )
}

export default SignupComplete;