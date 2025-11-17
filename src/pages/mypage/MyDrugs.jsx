import React, { useState, useEffect } from "react";
import { useUser } from "../../components/context/UserContext"; // UserContext import
import UseNavi from "../../utils/UseNavi"; // 리다이렉트를 위해 UseNavi import
import "../../styles/MyDrugs.css";
import DrugList from "./DrugList";
import MedInput from "./MedInput";
import SuppInput from "./SuppInput";
import requestHandler from "../../utils/requestHandler";
import DrugHistory from "./DrugHistory";

const MyDrugs = ( ) => {
  // 🚨 UserContext에서 사용자 정보와 로그인 상태를 가져옵니다.
  const { user, isLoggedIn } = useUser();
  const { goTo } = UseNavi(); 
  
  // 🚨 Context에서 user.id를 userId로 설정합니다.
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState("list");
  const [meds, setMeds] = useState([]);
  const [supps, setSupps] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    drug_id: "",
    type: "",
    eattime: [true,true,true],
    start_date: "",
    end_date: "",
    note: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
  if (!isLoggedIn || !userId) {
      // 로그인 정보가 없거나 유효하지 않으면 로그인 페이지로 이동
      console.log("로그인 정보 없음. 로그인 페이지로 이동.");
      alert("로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
      goTo("/login"); // 실제 로그인 페이지 경로로 수정하세요.
    }
    }, [isLoggedIn, userId, goTo])
    

  useEffect(() => {
    if (userId) {
    loadDrugs();
    } else {
      console.error("userId가 없어서 loadDrugs를 실행하지 않습니다. (로그인 대기중")
    }
  }, [userId]);

  useEffect(() => {
    if(successMessage){
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadDrugs = async () => {

      if (!userId) {
      console.error("loadDrugs: userId가 없습니다!");
      alert("로그인 정보를 찾을 수 없습니다.");
      return;
    }

    console.log("API 호출 시작 - userId:", userId);
    console.log("API URL:", `/routine/getUserDrugs/${userId}`);

    const res = await requestHandler({
      method: "get",
      url: `/routine/getUserDrugs/${userId}`,
      setLoading,
      onError: (msg)=> {
        console.error("API 에러:", msg);
        alert("목록 불러오기 실패: "+msg);
      }
    });

    console.log("API 응답:", res);

    if(res.ok){
      const medList = [], suppList = []
      const drugs = res.data?.drugs || [];

      console.log("받은 drugs:", drugs);

      drugs.forEach((d)=>{
        if(d.type==="user_meds") medList.push(d);
        else suppList.push(d);
        console.log("받은 drugs:", drugs);
      });
      setMeds([...medList]);
      setSupps([...suppList]);
      
    }
  }

  const handleRemove = async (item) => {
    if(!item?.id) return;
    const res = await requestHandler({
      method: "delete",
      url: `/routine/deleteRoutine/${item.id}`,
      setLoading,
      onError: (msg)=> alert("삭제 실패: "+msg)
    });
    if(res.ok){
      setSuccessMessage("삭제 완료");
      loadDrugs();
    }
  }

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      drug_id: item.drug_id,
      type: item.type === "medicine" ? "med" : "supp",
      eattime: item.eattime,
      start_date: item.start_date,
      end_date: item.end_date,
      note: item.note || ""
    });
    
  }


  const renderContent = () => {
    switch(activeTab){
      case "list": 
        return <DrugList 
          meds={meds} 
          supps={supps} 
          onEdit={handleEdit} 
          onRemove={handleRemove} 
          logs={logs} 
           />;
      case "med-input":
        return <MedInput userId={userId} form={form} setForm={setForm} loadDrugs={loadDrugs} setActiveTab={setActiveTab} />;
      case "supp-input":
        return <SuppInput userId={userId} form={form} setForm={setForm} onSubmit={loadDrugs} setActiveTab={setActiveTab} />;
      case "drug-history":
        return <DrugHistory userId={userId} onSubmit={loadDrugs} setActiveTab={setActiveTab} />;
      default:
        return <DrugList 
          meds={meds} 
          supps={supps} 
          onEdit={handleEdit} 
          onRemove={handleRemove} 
          logs={logs} 
          />;
    }
  }
if (!isLoggedIn) {
     // 로그인 정보가 없다면 이미 리다이렉션이 진행 중입니다.
    return (
      <div className="my-med-container clean-theme">
        <div style={{padding: '40px', textAlign: 'center'}}>
          <h2>로그인 정보 확인 중...</h2>
        </div>
      </div>
    );
  }
  
  // 로딩 상태는 isLoggedIn이 true일 때만 의미가 있습니다.
  if (loading) {
    return (
      <div className="my-med-container clean-theme">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>⏳ 목록 로딩 중...</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="my-med-container clean-theme">
      <div className="main-layout-wrapper">
        <div className="med-sidebar">
          <button className={`sidebar-btn ${activeTab==="list"?"active":""}`} onClick={()=>setActiveTab("list")}>내 약/영양제 목록</button>
          <button className={`sidebar-btn ${activeTab==="med-input"?"active":""}`} onClick={()=>setActiveTab("med-input")}>💊 복용약 등록</button>
          <button className={`sidebar-btn ${activeTab==="supp-input"?"active":""}`} onClick={()=>setActiveTab("supp-input")}>🌿 영양제 등록</button>
          <button className={`sidebar-btn ${activeTab==="drug-history"?"active":""}`} onClick={()=>setActiveTab("drug-history")}>📘 내 히스토리</button>
        </div>
        <div className="tab-content-wrapper">
          {successMessage && <div className="success-message-global">{successMessage}</div>}
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default MyDrugs;
