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
    email:"",
    age:"",
    gender:"",
    address:"",
    detailed_address:"",
    tel:""
  });
  
  const handleSubmit = (e) => {
    e.preventDefault(); 

    requestHandler({
      method: "post",
      url:"auth/signup",
      payload: form,
      setLoading,
      onSuccess:(data) => {
        alert(`${data.data.nickname}님 환영합니다. 일반 로그인은 알림 설정이 불가능 합니다.`);
        console.log(data);
        
        goTo("/signupComplete");
      },
      onError: (msg) => {
        alert(msg);
      }
    })
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tel"){
      let phone = value.replace(/[^0-9]/g,""); // 숫자만 남기기
      if (phone.length > 3 && phone.length <= 7){
        phone = phone.replace(/(\d{3})(\d+)/, "$1-$2");
      } else if (phone.length > 7){
        phone = phone.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
      }
      setForm({ ...form, [name]: phone });
    }else {
      setForm({ ...form, [name]: value });
    }
  };

  const required = ["username","password","email","nickname"]
  const unable = required.some((field) => form[field].trim() === "");

  return (
    <>
      <div className="wrapper">
        <h2>회원가입 페이지</h2>
        
        <form action="" onSubmit={handleSubmit}>
          
          <div>
            <h4>아이디</h4>
            <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="ID"/>
          </div>

          <div>
            <h4>비밀번호</h4>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="password"/>
          </div>

          <div>
            <h4>닉네임</h4>
            <input type="text" name="nickname" value={form.nickname} onChange={handleChange} placeholder="nickname"/>
          </div>
          
          <div>
            <h4>이메일</h4>
            <input type="text" name="email" value={form.email} onChange={handleChange} placeholder="email"/>
          </div>

          <div>
            <h4>전화번호</h4> 
            <h5>(선택사항)</h5>
            <input type="text" name="tel" value={form.tel} onChange={handleChange} placeholder="ex) 010-1234-5678" maxLength={13}/>
          </div>

          <div>
            <h4>나이</h4> 
            <h5>(선택사항)</h5>
            <input type="text" name="age" value={form.age} onChange={handleChange} placeholder="ex) 23"/>
          </div>

          <div>
            <h4>성별</h4>
            <h5>(선택사항)</h5>
            <input type="text" name="gender" value={form.gender} onChange={handleChange} placeholder="ex) 남 or 여"/>
          </div>

          <div>
            <h4>주소</h4>
            <h5>(선택사항)</h5>
            <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="ex) 도로명 주소"/>
          </div>

          <div>
            <h4>상세 주소</h4>
            <h5>(선택사항)</h5>
            <input type="text" name="detailed_address" value={form.detailed_address} onChange={handleChange} placeholder="ex) 상세 주소"/>
          </div>

          <Button variant="primary" disabled={unable} onClick={handleSubmit}>가입하기</Button>

        </form>


      </div>
    </>
  );
}

export default Signup;
