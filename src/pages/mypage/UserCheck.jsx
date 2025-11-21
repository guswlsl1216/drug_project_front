import { useEffect, useState } from "react";
import useLoginRedirect from "../../utils/useLoginRedirect";
import UseNavi from "../../utils/UseNavi";
import { useUser } from "../../components/context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import requestHandler from "../../utils/requestHandler";

const UserCheck = () => {
  const { goTo } = UseNavi();
  const { requireLogin } = useLoginRedirect();
  const { user, loading } = useUser();

  const [password, setPassword] = useState(""); // 사용자가 입력하는 비밀번호

  // const getCookie = (name) => { // 쿠키에서 accessToken 가져오는 함수
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(";").shift();
  // };

  useEffect(() => {
    requireLogin(() => { }, true);
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (!user) return null; // 로그인 안 되면 렌더링X

  const handleCheck = async () => {
    if (!password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      requestHandler({
        method:"post",
        url:"/auth/user/verify-password",
        payload:{password},
        onSuccess:(data) => {
          console.log(data)
          goTo("/mypage/userinfo")
        },
        onError: (msg) => {
          alert(msg)
        }
      });
    } catch (error) {
      console.error(error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="check-container">
      <h2 className="check-title">비밀번호 재확인</h2>
      <div className="login-form-group">
        <h4 className="login-label">아이디</h4>
        <input className="login-input" type="text" value={user.username} readOnly />
      </div>

      <div className="login-form-group">
        <h4 className="login-label">비밀번호</h4>
        <input type="password" className="login-input" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <button className="login-btn" onClick={handleCheck}>확인</button>
    </div>
  )
}

export default UserCheck;