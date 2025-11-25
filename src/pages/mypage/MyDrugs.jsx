import React, { useState, useEffect } from "react";
import { useUser } from "../../components/context/UserContext"; // UserContext import
import "../../styles/MyDrugs.css";
import DrugList from "./DrugList";
import MedInput from "./MedInput";
import SuppInput from "./SuppInput";
import requestHandler from "../../utils/requestHandler";
import DrugHistory from "./DrugHistory";
import EditDrugModal from "./EditDrugModal";
import useLoginRedirect from "../../utils/useLoginRedirect";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../utils/LoadingSpinner";

const MyDrugs = ( ) => {
  // 🚨 UserContext에서 사용자 정보와 로그인 상태를 가져옵니다.
  const { user, isLoggedIn } = useUser();
  // 🚨 Context에서 user.id를 userId로 설정합니다.
  const userId = user?.id;
  const { requireLogin } = useLoginRedirect();
  

  
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "list";
  const [activeTab, setActiveTab] = useState(initialTab);


  const [meds, setMeds] = useState([]);
  const [supps, setSupps] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    drug_id: "",
    type: "",
    eattime: [false,false,false],
    start_date: "",
    end_date: "",
    note: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
  requireLogin(); 
  }, []);

  // 로그인 된 경우에만 userId 존재 → loadDrugs 실행
  useEffect(() => {
    if (user?.id) {
      loadDrugs();
    }
  }, [user?.id]);

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
      eattime: item.eattime || [false, false, false],
      start_date: item.start_date || "",
      end_date: item.end_date || "",
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
        return <SuppInput userId={userId} form={form} setForm={setForm} loadDrugs={loadDrugs} setActiveTab={setActiveTab} />;
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
          <LoadingSpinner label="목록 로딩 중..." size={65} />
        </div>
      </div>
    );
  }
  return (
    <div className="my-med-container clean-theme">
      <div className="main-layout-wrapper">
        <div className="med-sidebar">
          <button className={`sidebar-btn ${activeTab==="med-input"?"active":""}`} onClick={()=>setActiveTab("med-input")}>💊 복용약 등록</button>
          <button className={`sidebar-btn ${activeTab==="supp-input"?"active":""}`} onClick={()=>setActiveTab("supp-input")}>🌿 영양제 등록</button>
          <button className={`sidebar-btn ${activeTab==="list"?"active":""}`} onClick={()=>setActiveTab("list")}>📜 루틴 목록</button>
          <button className={`sidebar-btn ${activeTab==="drug-history"?"active":""}`} onClick={()=>setActiveTab("drug-history")}>📘 루틴 히스토리</button>
        </div>
        <div className="tab-content-wrapper">
          {successMessage && <div className="success-message-global">{successMessage}</div>}
          {renderContent()}
        </div>
      </div>
      
      {editing && (<EditDrugModal editing={editing}
      form={form}
      setForm={setForm}
      setEditing={setEditing}
      loadDrugs={loadDrugs} 
      setSuccessMessage={setSuccessMessage}/>
      )}
    </div>


  )
}

export default MyDrugs;
