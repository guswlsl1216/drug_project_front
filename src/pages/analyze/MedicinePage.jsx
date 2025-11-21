import React, { useEffect, useState } from "react";
import UseNavi from "../../utils/UseNavi";
import SearchModal from "../../components/ui/SearchModal";
import "../../styles/MedicinePage.css";
import axios from "axios";

const ResultDataKey = "ANALYSIS_RESULT_DATA"; // 결과 데이터 키 (사용하지 않더라도 일관성을 위해 유지)
const MedicineDataKey = "MEDICINE_LIST_TO_SEND"; // 약물 목록 저장 키
const ImageUrlKey = "ORIGINAL_IMAGE_URL";

const saveImageUrl = (url) => {
  // ⭐ 새로 추가
  sessionStorage.setItem(ImageUrlKey, url);
  console.log("원본 이미지 URL 세션 저장 완료.");
};

// 입력된 약물 목록을 세션에서 불러옴
const loadMedicineList = () => {
  try {
    const serializedData = sessionStorage.getItem(MedicineDataKey); // 데이터가 있으면 파싱하고, 없거나 오류가 나면 기본값 ([{id: 1, name: "", ingredients: [], korName: ""}])을 반환합니다.
    if (serializedData) {
      const loadedData = JSON.parse(serializedData); // 데이터가 비어있지 않은 배열인지 확인합니다.

      // 💡 불러온 데이터에 isValidated 필드가 없으면 false로 초기화
      return loadedData.length > 0
        ? loadedData.map((med) => ({...med, isValidated: med.isValidated || false}))
        : [{id: 1, name: "", ingredients: [], korName: "", isValidated: false}];
    } // 세션에 데이터가 없으면 초기 빈 상태를 반환합니다.
    // 초기 상태에도 isValidated: false 추가
    return [{id: 1, name: "", ingredients: [], korName: "", isValidated: false}];
  } catch (error) {
    console.error("약물 목록 세션 불러오기 오류:", error);
    return [{id: 1, name: "", ingredients: [], korName: "", isValidated: false}];
  }
};

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
  const {goTo} = UseNavi();
  // 이미지 파일 객체 자체를 저장할 상태 추가
  const [uploadedFile, setUploadedFile] = useState(null);
  // 이미지 미리보기를 위한 상태 (URL)
  const [medicineImage, setMedicineImage] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);

  const [recognizedMedicines, setRecognizedMedicines] = useState(
    loadMedicineList()
  );

  useEffect(() => {
    // 탭 이동이나 다른 페이지로 이동하여 컴포넌트가 언마운트될 때 호출됨
    return () => {
      // 컴포넌트가 사라지기 직전에 현재 데이터를 세션에 저장합니다.
      saveMedicineList(recognizedMedicines);
      console.log("자동 저장 완료: 탭 이동/페이지 이탈 전 의약품 데이터 저장됨.");
    };
  }, [recognizedMedicines]);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  // ★★★ API 호출 함수 (새로 추가)
  const callDetectApi = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      // ★★★ 순수 axios를 사용하여 BASE_URL과 경로를 직접 조합
      const response = await axios.post(
        `${SERVER_URL}/result/detect`, // 예: http://localhost:5000/result/detect
        formData // 바디에 FormData 객체 전달
        // 헤더를 명시적으로 설정하지 않아 axios가 'multipart/form-data'를 자동 생성하도록 합니다.
      );
      return response.data;
    } catch (error) {
      // 💡 3. axios 에러 처리 방식 사용 (error.response를 통해 상세 정보 확인 가능)
      console.error("이미지 분석 API 오류:", error.response?.data || error.message);

      // 사용자에게 오류 메시지를 더 구체적으로 보여줍니다.
      alert(`이미지 분석 실패: ${error.response?.data?.message || error.message}`);
      return null;
    }
  };

  const handleImageUpload = (event) => {
    // 이미지 업로드 로직 (선택된 파일 처리)
    console.log("handleImageUpload 함수 호출됨");
    const file = event.target.files[0];
    event.target.value = null;
    if (file) {
      setMedicineImage(URL.createObjectURL(file));

      // ★★★ 수정: 실제 파일 객체를 저장합니다.
      setUploadedFile(file);
      console.log("이미지 파일 저장:", file);
    } else {
      // ★★★ 진단용 로그: 파일이 선택되지 않고 취소되었는지 확인
      console.log("파일 선택 취소됨 또는 파일 없음");
    }
  };

  const handleMedicineNameChange = (id, newName) => {
    setRecognizedMedicines(
      recognizedMedicines.map((med) =>
        med.id === id ? {...med, name: newName, isValidated: false} : med
      )
    );
  };

  const handleMedicineDelete = (id) => {
    setRecognizedMedicines(recognizedMedicines.filter((med) => med.id !== id));
  };

  const handleMedicineAdd = () => {
    const newId = Math.max(...recognizedMedicines.map((med) => med.id)) + 1;
    setRecognizedMedicines([
      ...recognizedMedicines,
      {id: newId, name: "", ingredients: [], korName: "", isValidated: false},
    ]);
  };

  const handleSearch = async () => {
    console.log(" '검사' 버튼 클릭 - 이미지 분석 시작");
    
    // 1. 파일이 선택되었는지 확인
    if (!uploadedFile) {
        alert("이미지 파일을 먼저 업로드해주세요.");
        return;
    }

    if (medicineImage) {
      saveImageUrl(medicineImage);
    }
    
    // 2. API 호출
    const result = await callDetectApi(uploadedFile); // ★★★ uploadedFile 사용
    
    if (result && result.detections) {
      if (result.detections.length > 0) {
        // API 응답(detections)을 recognizedMedicines 상태로 변환 및 업데이트
        const newMedicines = result.detections.map((detection, index) => ({
          id: detection.class_id,
          name: detection.product_name,
          ingredients: [],
          korName: "",
          isValidated: true,
          detection_box: detection.box || [],
        }));

        setRecognizedMedicines(newMedicines);
        console.log("인식된 약물 목록 업데이트 완료:", newMedicines);
        alert("이미지 분석 및 목록 업데이트가 완료되었습니다.");
      } else {
        // 탐지 결과가 없을 경우
        alert("이미지에서 인식된 약물이 없습니다. 직접 추가해 주세요.");
        setRecognizedMedicines([]); // 목록 비우기
      }
    }
  };

  const handleNext = () => {
    // 현재 데이터를 저장하고 다음 페이지로 이동
    console.log("--- handleNext 함수 시작 ---");
    // 유효성 검사: 등록된 의약품이 있는지 확인
    // name 필드가 공백을 제외하고 1글자 이상인 항목이 하나라도 있는지 isValidated가 true인 항목이 있는지 확인
    const hasValidatedMedicine = recognizedMedicines.some((med) => med.isValidated === true);

    const hasAnyUnvalidatedMedicine = recognizedMedicines.some((med) => med.isValidated === false);

    console.log("유효성 검사 결과 (hasValidatedMedicine):", hasValidatedMedicine);

    
    if (!hasValidatedMedicine) {
      alert(
        "다음 단계로 진행하려면 DB에 존재하는 의약품을 1개 이상 등록해야 합니다.\n의약품을 입력하고 '✓' 버튼을 눌러 정확한 의약품 정보를 확정해주세요."
      );
      return;
    } // [차단 검사] 미확정 항목(isValidated: false)이 목록에 하나라도 남아있는 경우

    if (hasAnyUnvalidatedMedicine) {
      alert(
        "등록된 의약품 목록에 유효하지 않은 (미확정된) 항목이 남아있습니다. \n모든 항목을 삭제하거나 '✓' 버튼을 눌러 의약품 정보를 확정해야 다음으로 진행할 수 있습니다."
      );
      return;
    } // 모든 검사를 통과했을 때만 실행

    saveMedicineList(recognizedMedicines);
    console.log("의약품 데이터 저장:", recognizedMedicines);
    // 여기에 최종 의약품 리스트를 서버에 저장하는 로직 추가
    goTo("/analyze/supplement"); // SupplementPage로 이동
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
              <div
                key={med.id}
                className={`medicine-item ${med.isValidated ? "validated" : "unvalidated"}`}
              >
                <input
                  placeholder="의약품을 입력하고 체크버튼을 눌러 등록"
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
                  x
                </button>
              </div>
            ))}
          </div>
          <p>※ 인식되지 않은 의약품은 아래의 추가 버튼을 눌러 등록해주세요 </p>
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

export default MedicinePage;


