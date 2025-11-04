// 회원가입 페이지

import { useState } from "react";
import UseNavi from "../utils/UseNavi";
import Button from "../components/ui/Button";
import requestHandler from "../utils/requestHandler";
import Changehandler from "../utils/Changehandler";

const Signup = () => {
  const { goIndex, goTo, goBack } = UseNavi();
  const [loading,setLoading] = useState(false);
  const [form, setForm] = useState({
    username:"",
    password:"",
    nickname:"",
    email:""
  });
  
  const handleSubmit = (e) => {
    e.preventDefault(); 

    requestHandler({
      method: "post",
      url:"auth/signup",
      payload: form,
      setLoading,
      onSuccess:(data) => {
        alert(`${data.data.nickname}님 환영합니다.`);
        console.log(data);
        
        goTo("/auth/login");
      },
      onError: (msg) => {
        alert(msg);
      }
    })
  };

  const unable = Object.values(form).some((value) => value.trim() === "");

  return (
    <>
      <div className="wrapper">
        <h2>회원가입 페이지</h2>
        
        <form action="">
          
          <div>
            <h4>아이디</h4>
            <input type="text" name="username" value={form.username} onChange={Changehandler(setForm)} placeholder="ID"/>
          </div>

          <div>
            <h4>비밀번호</h4>
            <input type="password" name="password" value={form.password} onChange={Changehandler(setForm)} placeholder="password"/>
          </div>

          <div>
            <h4>닉네임</h4>
            <input type="text" name="nickname" value={form.nickname} onChange={Changehandler(setForm)} placeholder="nickname"/>
          </div>
          
          <div>
            <h4>이메일</h4>
            <input type="text" name="email" value={form.email} onChange={Changehandler(setForm)} placeholder="email"/>
          </div>

          <Button variant="primary" disabled={unable} onClick={handleSubmit}>가입하기</Button>

        </form>

      </div>
    </>
  );
}

export default Signup;
