import Button from "../components/ui/Button"
import UseNavi from "../utils/UseNavi";

const SignupComplete = () => {

  const { goTo } = UseNavi();
  const handleClick = () => {
    goTo("/login");
  }

  return (
    <>
      <h3>
        환영합니다.
        ai분석 기능으로 스마트한 약 복용을 시작하세요.
      </h3>
      <Button variant="primary" onClick={handleClick}>로그인 하러가기</Button>
    </>
  )
}

export default SignupComplete;