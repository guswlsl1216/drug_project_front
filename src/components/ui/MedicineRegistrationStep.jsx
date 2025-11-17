// components/modals/MedicineRegistrationStep.jsx
import React, {useState} from "react";
import axios from "axios";
import SearchModal from "./SearchModal";
import "../../styles/SearchModal.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const MedicineRegistrationStep = ({onNext}) => {
  // 상태 관리
  const [uploadedFile, setUploadedFile] = useState(null);
  const [medicineImage, setMedicineImage] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);
  const [recognizedMedicines, setRecognizedMedicines] = useState([
    {
      id: 1,
      name: "",
      isValidated: false,
    },
  ]);

  // API 호출 함수
  const callDetectApi = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${SERVER_URL}/result/detect`, // 이미지 분석 엔드포인트
        formData
      );
      return response.data;
    } catch (error) {
      console.error("이미지 분석 API 오류:", error.response?.data || error.message);
      alert(`이미지 분석 실패: ${error.response?.data?.message || error.message}`);
      return null;
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    event.target.value = null;
    if (file) {
      setMedicineImage(URL.createObjectURL(file));
      setUploadedFile(file);
    } else {
      console.log("파일 선택 취소됨 또는 파일 없음");
    }
  };

  // 약 이름 변경 핸들러
  const handleMedicineNameChange = (id, newName) => {
    setRecognizedMedicines(
      recognizedMedicines.map((med) =>
        med.id === id ? {...med, name: newName, isValidated: false} : med
      )
    );
  };

  // 약 항목 삭제 핸들러
  const handleMedicineDelete = (id) => {
    setRecognizedMedicines(recognizedMedicines.filter((med) => med.id !== id));
  };

  // 약 항목 추가 핸들러
  const handleMedicineAdd = () => {
    // 1. 새로운 약 객체 생성
    const newMedicine = {
      id: Date.now(), // 고유 ID 생성
      name: "",
      isValidated: false,
      
    };

    // 2. 새로운 항목을 기존 배열의 맨 앞에 추가하고 상태 업데이트
    setRecognizedMedicines((prevMedicines) => [
      ...prevMedicines, // 기존 항목을 먼저
      newMedicine,
    ]);
  };

  // 이미지 검사/분석 핸들러
  const handleSearch = async () => {
    if (!uploadedFile) {
      alert("이미지 파일을 먼저 업로드해주세요.");
      return;
    }

    const result = await callDetectApi(uploadedFile);

    if (result && result.detections) {
      if (result.detections.length > 0) {
        const newMedicines = result.detections.map((detection) => ({
          id: detection.class_id || Date.now() + Math.random(), // 고유 ID 부여
          name: detection.product_name,
          ingredients: [],
          korName: "",
          isValidated: true,
        }));

        setRecognizedMedicines(newMedicines);
        alert("이미지 분석 및 목록 업데이트가 완료되었습니다.");
      } else {
        alert("이미지에서 인식된 약물이 없습니다. 직접 추가해 주세요.");
        setRecognizedMedicines([]);
      }
    }
  };

  // 분석 시작 핸들러
  const handleAnalyzeStart = () => {
    // 유효성 검사
    const hasValidatedMedicine = recognizedMedicines.some((med) => med.isValidated === true);
    const hasAnyUnvalidatedMedicine = recognizedMedicines.some((med) => med.isValidated === false);

    if (!hasValidatedMedicine) {
      alert(
        "분석을 시작하려면 의약품을 1개 이상 등록해야 합니다.\n의약품을 입력하고 '✓' 버튼을 눌러 정확한 의약품 정보를 확정해주세요."
      );
      return;
    }

    if (hasAnyUnvalidatedMedicine) {
      alert(
        "등록된 의약품 목록에 유효하지 않은 (미확정된) 항목이 남아있습니다. \n모든 항목을 삭제하거나 '✓' 버튼을 눌러 의약품 정보를 확정해야 분석을 시작할 수 있습니다."
      );
      return;
    }

    // 모든 검사를 통과했을 때, 상위 모달의 분석 시작 함수 호출
    onNext();
  };

  return (
    <div className="medicine-registration-step">
      <div className="content-wrapper">
        {/* 이미지 분석 섹션 */}
        <div className="image-analysis-section">
          <h3>1. 이미지 분석</h3>
          <div
            className="image-display-box"
            style={{
              backgroundImage: medicineImage ? `url(${medicineImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: medicineImage ? "transparent" : "#f0f0f0",
              minHeight: "150px",
            }}
          >
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
          <h3>2. 의약품 리스트 확정</h3>
          <div className="medicine-list">
            {recognizedMedicines.map((med) => (
              <div
                key={med.id}
                className={`medicine-item ${med.isValidated ? "validated" : "unvalidated"}`}
              >
                <input
                  placeholder="이름을 입력하고 체크버튼을 눌러 확정"
                  type="text"
                  className="medicine-input"
                  value={med.name}
                  onChange={(e) => handleMedicineNameChange(med.id, e.target.value)}
                  disabled={med.isValidated}
                />

                <button
                  className="button-edit"
                  onClick={() => {
                    setSelectedMedicineId(med.id);
                    setSearchModalOpen(true);
                  }}
                  disabled={med.isValidated}
                >
                  {med.isValidated ? "✓" : "✓"}
                </button>
                <button className="button-delete" onClick={() => handleMedicineDelete(med.id)}>
                  x
                </button>
              </div>
            ))}
          </div>
          <p>※ 인식되지 않은 약/영양제는 아래의 추가 버튼을 눌러 등록해주세요 </p>
          <button className="button-add" onClick={handleMedicineAdd}>
            추가
          </button>
        </div>
      </div>
      <div className="bottom-box">
        <p className="guidance-text-bottom">
          ※ 처방전이나 약봉투에 기재되어 있는 이름이 다를경우 의약품 이름을 수정 해 주세요.
        </p>

        <button className="button-next" onClick={handleAnalyzeStart}>
          상호작용 분석 시작
        </button>
      </div>

      {/* 검색 모달 (기존 SearchModal 재사용) */}
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
                    id: med.id, // 기존 ID 유지
                    name: selectedItem.name,
                    ingredients: selectedItem.ingredients || med.ingredients,
                    korName: selectedItem.korName || med.korName,
                    isValidated: true,
                  }
                : med
            )
          );
          setSearchModalOpen(false);
        }}
        apiEndpoint="/aiAnalyze/medicine/search"
        type="meds"
      />
    </div>
  );
};

export default MedicineRegistrationStep;
