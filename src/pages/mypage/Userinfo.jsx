import { useEffect, useState } from "react";
import UseNavi from "../../utils/UseNavi";
import { useUser } from "../../components/context/UserContext";
import requestHandler from "../../utils/requestHandler";
import Button from "../../components/ui/Button";
import AddressPicker from "../../components/ui/AddressPicker";

const Userinfo = () => {
  const {user, loading, verified} = useUser();
  const {goTo} = UseNavi();

  const [form, setForm] = useState({
    password:"",
    nickname:"",
    text:"",
    email:"",
    tel:"",
    age:"",
    gender:"",
    address:"",
    detail:"",
    jibun:"",
    zipcode:"",
  });

  useEffect(() => { 
    if (!loading) {
      if(!user) {
        goTo("/login"); // 로그인을 안 했으면 로그인 페이지로 이동
      } else if (!verified) {
        goTo("/mypage/usercheck"); // 비밀번호 인증을 안 하고 접근 시 인증으로 이동
      }
    }
  }, [loading, user, verified, goTo]);
  
  if (loading || !user || !verified) {
    return <div>로딩 중 . . .</div>;
  }

  const handleChange = () => {
    
    const payload = {};

    Object.keys(form).forEach((key) => {
      let value = form[key].trim(); // 공백 제거 key,value 
      if (key ==="tel") value = value.replace(/-/g,""); // 하이픈 제거
      if (value !== "") payload[key] = value;
    });

    if (Object.keys(payload).length === 0) {
      alert("수정 할 내용이 없습니다.");
      return;
    }

    requestHandler({
      method: "post",
      url:"/auth/user",
      payload,
      onSuccess: (data) => {
        alert("회원정보가 변경되었습니다.");
        setForm({
          password:"",
          nickname:"",
          text:"",
          email:"",
          tel:"",
          age:"",
          gender:"",
          address:"",
          detail:"",
          jibun:"",
          zipcode:"",
        });
      },
      onError: (msg) => alert(msg || "회원정보 변경 실패"),
    });
  };

  return(
    <div className="userinfo-container"> 
      <h2>회원정보 페이지</h2>

      <div className="userinfo-group">
        <label>아이디</label>
        <input type="text" value={user.username} readOnly />
      </div>

      <div className="userinfo-group">
        <label>비밀번호</label>
        <input type="password" name="password" value={form.password} placeholder="새 비밀번호 입력" onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
      </div>

      <div className="userinfo-group">
        <label>닉네임</label>
        <input type="text" name="nickname" value={form.nickname} placeholder={user.nickname || "닉네임"} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
      </div>

      <div className="userinfo-group">
        <label>성별</label>
        <select name="gender" value={form.gender || user.gender || ""} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}> 
          <option value="">성별 선택</option>
          <option value="남자">남자</option>
          <option value="여자">여자</option>
        </select>
      </div>

      <div className="userinfo-group">
        <label>나이</label>
        <input type="text" name="age" value={form.age} placeholder={user.age || "나이"} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
      </div>

      <div className="userinfo-group">
        <label>전화번호</label>
        <input type="text" name="tel" value={form.tel || user.tel || ""} placeholder={user.tel || "전화번호"} 
        onChange={(e) => {
          let v = e.target.value.replace(/[^\d]/g,"");
          if (v.length > 3 && v.length <= 7) v = `${v.slice(0,3)}-${v.slice(3)}`;
          else if (v.length > 7) v = `${v.slice(0,3)}-${v.slice(3,7)}-${v.slice(7,11)}`;
          setForm({...form, tel:v});
        }} />
      </div>

      <div className="userinfo-group">
        <label>주소</label>
        <AddressPicker 
          value={{
            postcode: form.zipcode,
            road: form.address,
            jibun: form.jibun,
            detail: form.detail,
          }}
          onChange={(data) => {
            setForm((prev) => ({
              ...prev,
              address:data.road,
              detail: data.detail,
              jibun: data.jibun,
              zipcode: data.postcode
            }));
          }}
        />
      </div>

      <Button onClick={handleChange}>회원정보 변경</Button>

    </div>
  );
};

export default Userinfo;