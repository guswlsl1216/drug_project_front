import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import SearchModal from "../../components/ui/SearchModal";
import "../../styles/MedicinePage.css";

const SupplementPage = () => {
  const navigate = useNavigate();
  // 예시를 위한 상태 관리 (실제 로직에서는 API 호출 등으로 데이터 관리)
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);
  const [recognizedMedicines, setRecognizedMedicines] = useState([
    {id: 1, name: "복용하는 영양제1"},
    {id: 2, name: "복용하는 영양제2"},
    {id: 3, name: "복용하는 영양제3"},
  ]);

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

  const handleNext = () => {
    // 현재 데이터를 저장하고 다음 페이지로 이동
    console.log("의약품 데이터 저장:", recognizedMedicines);
    // 여기에 최종 의약품 리스트를 서버에 저장하는 로직 추가
    navigate("/analyze/result"); // ResultPage로 이동
  };

  return (
    <div className="medicine-page-container">
      <div className="content-wrapper">
        {/* 영양제 리스트 섹션 */}
        <div className="recognized-list-section">
          <h3>영양제 리스트</h3>
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
        ※ 복용하는 영양제의 제품명을 입력해 주세요.
      </p>

      {/* 결과보기 버튼 */}
      <button className="button-next" onClick={handleNext}>
        결과보기
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
              med.id === selectedMedicineId ? {...med, name: selectedItem.name} : med
            )
          );
          setSearchModalOpen(false);
        }}
        apiEndpoint="/aiAnalyze/supplements/search"
        type='supps'
      />
    </div>
  );
};

export default SupplementPage;
