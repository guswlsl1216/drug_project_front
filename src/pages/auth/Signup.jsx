// 회원가입 페이지

import { useEffect, useState } from "react";
import UseNavi from "../../utils/UseNavi";
import Button from "../../components/ui/Button";
import requestHandler from "../../utils/requestHandler";
import Changehandler from "../../utils/Changehandler";
import AddressPicker from "../../components/ui/AddressPicker";
import "../../styles/auth/Signup.css";

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
    jibun:"",
    zipcode:"",
    tel:""
  });

  const handleAddressChange = (addr) => {
    setForm((prev) => ({
      ...prev,
      address: addr.road || addr.jibun || "", 
      detailed_address: addr.detail || "",
      jibun: addr.jibun || "",
      zipcode: addr.postcode || "",
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault(); 

    const payload = {
      ...form, 
      tel: form.tel ? form.tel.replace(/-/g,"") : null, // 전화번호를 입력 시 하이픈 제거하고 보내고, 입력을 안 할 시 null로 보냄
    }

    requestHandler({
      method: "post",
      url:"auth/signup",
      payload: payload,
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

    if (name === "tel"){ // 전화번호 입력 시 자동 하이픈 생성
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

  const required = ["username","password","email","nickname"] // 필수 입력
  const unable = required.some((field) => form[field].trim() === ""); 

  return (
    <div className="signup-page-wrapper">
      
      <form action="" onSubmit={handleSubmit} className="signup-form">
        <h2>회원가입</h2>
        
        <div className="form-group">
          <h4 className="form-label">아이디</h4>
          <input className="form-input" type="text" name="username" value={form.username} onChange={handleChange} placeholder="ID"/>
        </div>

        <div className="form-group">
          <h4 className="form-label">비밀번호</h4>
          <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="password"/>
        </div>

        <div className="form-group">
          <h4 className="form-label">닉네임</h4>
          <input className="form-input" type="text" name="nickname" value={form.nickname} onChange={handleChange} placeholder="nickname"/>
        </div>
        
        <div className="form-group">
          <h4 className="form-label">이메일</h4>
          <input className="form-input" type="text" name="email" value={form.email} onChange={handleChange} placeholder="email"/>
        </div>

        <div className="form-group">
          <h4 className="form-label">전화번호<small>(선택사항)</small></h4> 
          
          <input className="form-input" type="text" name="tel" value={form.tel} onChange={handleChange} placeholder="ex) 010-1234-5678" maxLength={13}/>
        </div>

        <div className="form-group">
          <h4 className="form-label">나이<small>(선택사항)</small></h4> 
          
          <input className="form-input" type="text" name="age" value={form.age} onChange={handleChange} placeholder="ex) 23"/>
        </div>

        <div className="form-group">
          <h4 className="form-label">성별<small>(선택사항)</small></h4>
          
          <select name="gender" value={form.gender} onChange={handleChange} className="form-select">
            <option value="">성별 선택</option>
            <option value="남자">남자</option>
            <option value="여자">여자</option>
          </select>
        </div>

        <div className="form-group">
          <h4 className="form-label">주소<small>(선택사항)</small></h4>
          <AddressPicker onChange={handleAddressChange} enableExtra={false} />
        </div>

        <Button className="signup-btn" variant="primary" disabled={unable} onClick={handleSubmit}>가입하기</Button>

      </form>  
    </div>
  );
}

export default Signup;
