import Button from "../../components/ui/Button"
import UseNavi from "../../utils/UseNavi";
import "../../styles/auth/SignupComplete.css";
import { replace } from "react-router-dom";

const SignupComplete = () => {

  const { goTo } = UseNavi();
  const handleClick = () => {
    goTo("/login", {fromSignupComplete:true}, true); // replace:true
  }

  return (
    <div className="signup-complete-container">
      <div className="signup-card">
        <div className="icon-circle">
          <span className="check-icon">✓</span>
        </div>

        <h2 className="signup-title">환영합니다!</h2>

        <p className="signup-text">
          이제 의약품/영양제 성분 분석으로  
          <br />
          더 스마트한 건강 관리를 시작해보세요.
        </p>

        <Button 
          className="signup-complete-btn" 
          variant="primary" 
          onClick={handleClick}
        >
          로그인 하러 가기
        </Button>
      </div>
    </div>
  );
}

export default SignupComplete;