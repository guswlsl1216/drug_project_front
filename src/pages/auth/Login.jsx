import UseNavi from "../../utils/UseNavi";
import Button from "../../components/ui/Button";
import requestHandler from "../../utils/requestHandler";
import Changehandler from "../../utils/Changehandler";
import { useEffect, useState } from "react";
import { useUser } from "../../components/context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import "../../styles/auth/Login.css";
import { useLocation } from "react-router-dom";

// 로그인 페이지

const Login = () => {
  const location = useLocation();
  const fromSignupComplete = location.state?.fromSignupComplete;
  const {goIndex, goTo, goBack} = UseNavi();
  const [form, setForm] = useState({
    username:"",
    password:""
  });
  const [loading, setLoading] = useState(false);
  const { user, setUser, isLoggedIn } = useUser();
  
  const handleSubmit = async (e) => {

    e.preventDefault();
    
    try {
      // axiosInstance는 withCredentials: true 설정됨 -> 쿠키 전송
      const res = await axiosInstance.post("login/login", form);

      // 서버에서 보내 준 user 정보로 Context 업데이트
      setUser(res.data.data);
      if (fromSignupComplete) {
        goIndex(); // 회원가입 완료 페이지에서는 인덱스로 이동
      }else {
        goBack(); // 모든 다른 페이지에서는 이전 페이지로 이동
      }
      
    } catch (err) {
      alert(err?.response?.data?.message || "로그인 실패"); 

    } finally {
      setLoading(false);
    }};

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="login-fixed-center">

        <div className="login-container">
          <h2 className="login-title">로그인</h2>

          <form action="" className="login-form">
            <div className="login-form-group">
              <h4 className="login-label">아이디</h4>
              <input className="login-input" type="text" name="username" value={form.username} onChange={Changehandler(setForm)} />
            </div>

            <div className="login-form-group">
              <h4 className="login-label">비밀번호</h4>
              <input className="login-input" type="password" name="password" value={form.password} onChange={Changehandler(setForm)} />
            </div>

            <Button className="login-btn" type="submit" variant="primary" onClick={handleSubmit}>로그인</Button>

          </form>
        </div>
      </div>    
    </>
  );
}

export default Login;
