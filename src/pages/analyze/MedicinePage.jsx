import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchModal from "../../components/ui/SearchModal";
import "../../styles/MedicinePage.css";

const ResultDataKey = "ANALYSIS_RESULT_DATA"; // 결과 데이터 키 (사용하지 않더라도 일관성을 위해 유지)
const MedicineDataKey = "MEDICINE_LIST_TO_SEND"; // 약물 목록 저장 키

const saveMedicineList = (data) => {
  try {
    // 💡 MedicineDataKey를 사용하여 recognizedMedicines를 저장합니다.
    sessionStorage.setItem(MedicineDataKey, JSON.stringify(data));
    console.log("약물 목록 세션 저장 완료.");
  } catch (error) {
    console.error("세션 저장 오류:", error);
  }
};


const MedicinePage = () => {
  const navigate = useNavigate();
  // 예시를 위한 상태 관리 (실제 로직에서는 API 호출 등으로 데이터 관리)
  const [medicineImage, setMedicineImage] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);
  const [recognizedMedicines, setRecognizedMedicines] = useState([
    {id: 1, name: "인식된 의약품 1"},
    {id: 2, name: "인식된 의약품 2"},
    {id: 3, name: "인식된 의약품 3"},
  ]);

  const handleImageUpload = (event) => {
    // 이미지 업로드 로직 (선택된 파일 처리)
    const file = event.target.files[0];
    if (file) {
      setMedicineImage(URL.createObjectURL(file));
      console.log("이미지 업로드:", file.name);
      // 여기에 이미지 분석 API 호출 로직 추가
    }
  };

  const handleMedicineNameChange = (id, newName) => {
    setRecognizedMedicines(
      recognizedMedicines.map((med) => (med.id === id ? {...med, name: newName} : med))
    );
  };

  const handleMedicineDelete = (id) => {
    setRecognizedMedicines(recognizedMedicines.filter((med) => med.id !== id));
  };

  const handleMedicineAdd = () => {
    const newId = Math.max(...recognizedMedicines.map((med) => med.id)) + 1;
    setRecognizedMedicines([...recognizedMedicines, {id: newId, name: "새로운 의약품"}]);
  };

  const handleSearch = () => {
    console.log("검색 버튼 클릭 - 이미지 분석 결과 기반 검색");
    // 여기에 분석된 이미지로 의약품 정보 검색 로직 추가
  };

  const handleNext = () => {
    // 현재 데이터를 저장하고 다음 페이지로 이동
    saveMedicineList(recognizedMedicines);
    
    console.log("의약품 데이터 저장:", recognizedMedicines);
    // 여기에 최종 의약품 리스트를 서버에 저장하는 로직 추가
    navigate('/analyze/supplement'); // SupplementPage로 이동
  };

  return (
    <div className="medicine-page-container">
      <div className="content-wrapper">
        {/* 이미지 분석 섹션 */}
        <div className="image-analysis-section">
          <h3>이미지 분석</h3>
          <div
            className="image-display-box"
            style={{
              backgroundImage: medicineImage ? `url(${medicineImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: medicineImage ? "transparent" : "#f0f0f0",
            }}
          >
            {/* 이미지 미리보기가 없을 때 */}
            {!medicineImage && <span className="placeholder-text">이미지 없음</span>}
          </div>
          <label className="button-upload">
            이미지업로드
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{display: "none"}}
            />
          </label>
          <button className="button-search" onClick={handleSearch}>
            검사
          </button>
        </div>

        {/* 인식된 의약품 리스트 섹션 */}
        <div className="recognized-list-section">
          <h3>인식된 의약품 리스트</h3>
          <div className="medicine-list">
            {recognizedMedicines.map((med) => (
              <div key={med.id} className="medicine-item">
                <input
                  type="text"
                  className="medicine-input"
                  value={med.name}
                  onChange={(e) => handleMedicineNameChange(med.id, e.target.value)}
                />
                <button
                  className="button-edit"
                  onClick={() => {
                    setSelectedMedicineId(med.id);
                    setSearchModalOpen(true);
                  }}
                >
                  ✓
                </button>
                <button className="button-delete" onClick={() => handleMedicineDelete(med.id)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
          <button className="button-add" onClick={handleMedicineAdd}>
            추가
          </button>
        </div>
      </div>

      {/* 안내 문구 */}
      <p className="guidance-text">
        ※ 처방전이나 약봉투에 기재되어 있는 이름이 다를경우 의약품 이름을 수정 해 주세요.
      </p>

      {/* 다음으로 버튼 */}
      <button className="button-next" onClick={handleNext}>
        다음으로
      </button>

      {/* 검색 모달 */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        searchTerm={
          selectedMedicineId
            ? recognizedMedicines.find((med) => med.id === selectedMedicineId)?.name
            : ""
        }
        onSelect={(selectedItem) => {
          setRecognizedMedicines(
            recognizedMedicines.map((med) =>
              med.id === selectedMedicineId
                ? {
                    id: selectedItem.id, 
                    name: selectedItem.name,
                    ingredients: selectedItem.ingredients || med.ingredients,
                  }
                : med
            )
          );
          setSearchModalOpen(false);
        }}
        apiEndpoint="/aiAnalyze/medicine/search"
        type='meds'
      />
    </div>
  );
};

export default MedicinePage;


