import React, {useEffect, useState} from "react";
import "../../styles/SupplementPage.css";

const SupplementPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  // 리스트 빈 배열로 초기 값 설정
  const [medsList, setMedsList] = useState([]);
  const [suppsList, setSuppsList] = useState([]);

  // 수정할 항목의 데이터를 저장하는 상태
  const [itemToEdit, setItemToEdit] = useState([null]);

  // 메세지 띄우기
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null); // 초기화
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // 복용약 추가 함수
  const handleAddMed = (newMedData) => {
    const newMed = {
      ...newMedData,
      id: generateSimpleId(),
      type: "med",
    };

    setMedsList((prevList) => [...prevList, newMed]);
    setSuccessMessage(`✅ 복용약 '${newMed.name}'이(가) 목록에 성공적으로 등록되었습니다.`);
    setActiveTab("list");
  };

  // 영양제 추가 함수
  const handleAddSupp = (newSuppData) => {
    const newSupp = {
      ...newSuppData,
      id: generateSimpleId(),
      type: "supp",
    };

    setSuppsList((prevList) => [...prevList, newSupp]);
    setSuccessMessage(`✅ 영양제 '${newSupp.name}'이(가) 목록에 성공적으로 등록되었습니다.`);
    setActiveTab("list");
  };

  // 삭제 함수
  const hanleRemoveItem = (id, type) => {
    if (type == "med") {
      setMedsList((prevList) => prevList.filter((item) => item.id !== id));
      setSuccessMessage("🗑️ 복용약이 목록에서 삭제되었습니다.");
    } else if (type == "supp") {
      setMedsList((prevList) => prevList.filter((item) => item.id !== id));
      setSuccessMessage(`🗑️ 영양제가 목록에서 삭제되었습니다.`);
    }
  };

  // 항목 수정 (버튼 클릭)
  const handleEditStart = (id, type, currentItem) => {
    // 수정 전 데이터 저장
    setItemToEdit(currentItem);

    console.log(`[수정] ID : ${id}, 타입 : ${type} 항목 수정 시작`);
    setSuccessMessage(`${currentItem.name}' 항목 수정 준비 중...`);
  };

  // // 수정 ( 폼 제출 )
  // const handleEditComplete = (id, type, updateData) => {
  //   const updateList = (listSetter, )

  // }

  // 탭 마다 다른 페이지 보여지도록 설정
  const renderContent = () => {
    switch (activeTab) {
      case "list":
        return <DrugList meds={medsList} supps={suppsList} />;
      case "med-input":
        return <MedInput onDatasubmit={handleAddMed} />;
      case "supp-input":
        return <SuppInput onDatasubmit={handleAddSupp} />;
      default: // 기본 값 메세지 전달
        return <DrugList meds={medsList} supps={suppsList} />;
    }
  };

  return (
    <div className="my-med-container clean-theme">
      <h4>내가 복욕중인 약 & 영양제 페이지</h4>

      {/* 세로 탭 및 콘텐츠 영역을 위한 좌우 분할 레이아웃 */}
      <div className="main-layout-wrapper">
        {/* 탭 네비게이션 (왼쪽 사이드바 - 세로 정렬) */}
        <div className="med-sidebar">
          <button
            className={`sidebar-btn ${activeTab === "list" ? "active" : ""}`}
            onClick={() => setActiveTab("list")}
          >
            내 약/영양제 목록
          </button>
          <button
            className={`sidebar-btn ${activeTab === "med-input" ? "active" : ""}`}
            onClick={() => setActiveTab("med-input")}
          >
            💊 복용약 등록
          </button>
          <button
            className={`sidebar-btn ${activeTab === "supp-input" ? "active" : ""}`}
            onClick={() => setActiveTab("supp-input")}
          >
            🌿 영양제 등록
          </button>
        </div>

        {/* 탭 콘텐츠 영역 (오른쪽) */}
        <div className="tab-content-wrapper">
          {successMessage && <div className="success-message-global">{successMessage}</div>}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SupplementPage;
