import { useEffect, useState } from "react";
import UseNavi from "../../utils/UseNavi";
import { useUser } from "../../components/context/UserContext";
import requestHandler from "../../utils/requestHandler";
import Button from "../../components/ui/Button";
import AddressPicker from "../../components/ui/AddressPicker";
import "../../styles/auth/Userinfo.css";
import axiosInstance from "../../utils/axiosInstance";

const Userinfo = () => {
  const {user, loading, verified, setUser} = useUser();
  const {goTo} = UseNavi();
  const preVerfied = location.state?.verified ?? false;

  const [localVerified, setLocalVerified] = useState(preVerfied);

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
      } else if (!verified && !localVerified) {
        goTo("/mypage/usercheck"); // 비밀번호 인증을 안 하고 접근 시 인증으로 이동
      }
    }
  }, [loading, user, verified, localVerified, goTo]);

  useEffect(() => {
    if (user?.id) {
      axiosInstance.get(`/auth/${user.id}`)
      .then((res) => {
        console.log(res)
        setForm((prev) => ({
          ...prev,
          nickname: res.data.data.nickname || "",
          email: res.data.data.email || "",
          tel: res.data.data.tel || "",
          age: res.data.data.age || "",
          gender: res.data.data.gender || "",
          address: res.data.data.address || "",
          detail: res.data.data.detail || "",
          jibun: res.data.data.jibun || "",
          zipcode: res.data.data.zipcode || "",
        }));
      })
      .catch((err) => {
        console.error("유저 정보 로드 실패", err);
      });
    }
  }, [user?.id]);
  
  if (loading || !user || (!verified && !localVerified)) {
    return <div>로딩 중 . . .</div>;
  }

  const handleChange = async () => {
    
    const payload = {};
    

    Object.keys(form).forEach((key) => {
      let value = form[key]; // 공백 제거 key,value 

      // if (value == null || value === "") return; // 값 없으면 건너뛰기
      if (typeof value === "string") value = value.trim();
      if (key === "tel") value = value.replace(/-/g,""); // 하이픈 제거
      if (key === "age" && value !== "") value = parseInt(value, 10);

      if (value !== "" && value != null && value !== user[key]) {
        payload[key] = value;
      } 

    });

    if (Object.keys(payload).length === 0) {
      alert("변경 된 내용이 없습니다.");
      return;
    }
    console.log("payload",payload)

    try {
      const res = await axiosInstance.post("/auth/user", payload, {
        headers:{"Content-Type":"application/json"},
      });

      alert("회원정보가 변경되었습니다.");

      const updateUser = res.data.data;

      setForm((prev) => ({
        ...prev,
        password:updateUser.password || "",
        nickname:updateUser.nickname || "",
        email:updateUser.email || "",
        tel:updateUser.tel || "",
        age:updateUser.age || "",
        gender:updateUser.gender || "",
        address:updateUser.address || "",
        detail:updateUser.detail || "",
        jibun:updateUser.jibun || "",
        zipcode:updateUser.zipcode || "",
      }));
    } catch (error) {
      alert(error?.response?.data?.message || "회원정보 변경 실패");
    }
  
  };

  const handelDelete = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) {
      return;
    }

    try {
      const res = await axiosInstance.delete("/auth/delete");

      alert("탈퇴 요청이 완료되었습니다.");

      // 로그아웃 시키기
      setUser(null);

      goTo("/login");
    } catch (error) {
      alert(error?.response?.data?.message || "탈퇴 실패!");
    }
  };

  return(
    <div className="userinfo-page-wrapper">
      <div className="userinfo-container"> 
        <h2>회원정보 수정</h2>

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
          <label>이메일</label>
          <input type="text" name="email" value={form.email} placeholder={user.email || "이메일"} onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} />
        </div>

        <div className="userinfo-group">
          <label>성별</label>
          <select
            name="gender"
            value={form.gender} 
            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
          >
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
              display:{raw:form.address || "", compact:form.address || ""}
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
        
        <div className="button-container">
        <button className="button" onClick={handleChange}>수정</button>
        <button className="button" onClick={handelDelete}>삭제</button>
        </div>

      </div>
    </div>
  );
};

export default Userinfo;