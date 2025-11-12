import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import SearchModal from "../../components/ui/SearchModal";
import "../../styles/MedicinePage.css";
import requestHandler from "../../utils/requestHandler";

// --- 세션 관리 유틸리티 ---
const ResultDataKey = "ANALYSIS_RESULT_DATA";
const MedicineDataKey = "MEDICINE_LIST_TO_SEND";

const saveAnalysisResult = (data) => {
  try {
    sessionStorage.setItem(ResultDataKey, JSON.stringify(data));
    console.log("분석 결과 데이터 세션 저장 완료.");
  } catch (error) {
    console.error("세션 저장 오류:", error);
  }
};

const loadMedicineList = () => {
  try {
    const serializedData = sessionStorage.getItem(MedicineDataKey);
    // 저장된 약물 목록 (meds) 구조를 반환
    return serializedData ? JSON.parse(serializedData) : [];
  } catch (error) {
    console.error("약물 목록 세션 불러오기 오류:", error);
    return [];
  }
};
// -----------------------------

const SupplementPage = () => {
  const navigate = useNavigate();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedSupplementId, setSelectedSupplementId] = useState(null);

  // 상태 초기값: ingredients는 배열(string[])로 관리
  const [recognizedSupplements, setRecognizedSupplements] = useState([
    {id: 1, name: "영양제를 입력하세요", ingredients: []},
    {id: 2, name: "영양제를 입력하세요", ingredients: []},
    {id: 3, name: "영양제를 입력하세요", ingredients: []},
  ]);

  const handleSupplementNameChange = (id, newName) => {
    setRecognizedSupplements(
      recognizedSupplements.map((supp) => (supp.id === id ? {...supp, name: newName} : supp))
    );
  };

  const handleSupplementDelete = (id) => {
    setRecognizedSupplements(recognizedSupplements.filter((supp) => supp.id !== id));
  };

  const handleSupplementAdd = () => {
    // ID 생성 로직 개선 (가장 큰 ID + 1, 목록이 비어있으면 1)
    const newId =
      recognizedSupplements.length > 0
        ? Math.max(...recognizedSupplements.map((supp) => supp.id)) + 1
        : 1;

    setRecognizedSupplements([
      ...recognizedSupplements,
      {id: newId, name: "새로운 영양제", ingredients: []}, // ingredients는 배열로 초기화
    ]);
  };

  const handleNext = async () => {
    // 1. MedicinePage에서 임시 저장된 약물 목록 불러오기
    const medicineList = loadMedicineList();

    // ⭐ 2. 서버에 전송할 최종 데이터 구성:
    // 백엔드의 analyze_result 함수는 영양제 ingredients가 '문자열'인 것을 가정하므로,
    // 여기서 배열을 쉼표로 구분된 문자열로 변환해야 합니다.
    const suppsToSend = recognizedSupplements
      .map((supp) => ({
        id: supp.id,
        name: supp.name,
        // **핵심 수정: ingredients 배열을 쉼표 문자열로 변환하여 백엔드 로직에 맞춤**
        ingredients: Array.isArray(supp.ingredients)
          ? supp.ingredients.join(", ")
          : supp.ingredients,
      }))
      .filter((supp) => supp.name && supp.name !== "새로운 영양제"); // 이름 없는 항목은 제외

    const finalDataToSend = {
      meds: medicineList,
      supps: suppsToSend, // 변환된 영양제 목록 사용
    };

    console.log("--- 서버 전송 최종 데이터 ---", finalDataToSend);

    // ⭐ 3. 서버 전송 및 결과 수신 로직 (실제 통신 로직 사용)
    try {
      const response = await requestHandler({
        method: "post",
        url: "/aiAnalyze/analyze/result",
        payload: finalDataToSend,
      });

      const analysisResult = response.data; // 서버에서 받은 분석 결과
      
      console.log("--- 서버 수신 분석 결과 ---", analysisResult);

      // 4. 분석 결과를 세션에 저장
      saveAnalysisResult(analysisResult);

      // 5. 결과 페이지로 이동
      navigate("/analyze/result");


    } catch (error) {
      console.error("분석 결과 요청 중 오류 발생:", error);
      alert("분석 요청 중 오류가 발생했습니다. 콘솔을 확인해 주세요.");
    }
  };


  return (
    <div className="medicine-page-container">
      <div className="content-wrapper">
        <div className="recognized-list-section">
          <h3>영양제 리스트</h3>
          <div className="medicine-list">
            {recognizedSupplements.map((supp) => (
              <div key={supp.id} className="medicine-item">
                <input
                  type="text"
                  className="medicine-input"
                  value={supp.name}
                  onChange={(e) => handleSupplementNameChange(supp.id, e.target.value)}
                />
                <button
                  className="button-edit"
                  onClick={() => {
                    setSelectedSupplementId(supp.id);
                    setSearchModalOpen(true);
                  }}
                >
                  ✓
                </button>
                <button className="button-delete" onClick={() => handleSupplementDelete(supp.id)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
          <button className="button-add" onClick={handleSupplementAdd}>
            추가
          </button>
        </div>
      </div>
      <p className="guidance-text"> ※ 복용하는 영양제의 제품명을 입력해 주세요. </p>
      <button className="button-next" onClick={handleNext}>
        결과보기
      </button>
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        searchTerm={
          selectedSupplementId
            ? recognizedSupplements.find((supp) => supp.id === selectedSupplementId)?.name
            : ""
        }
        // ⭐ onSelect 수정: 검색 결과의 성분 문자열을 배열로 변환하여 상태에 저장
        onSelect={(selectedItem) => {
          // 검색 결과의 ingredients가 문자열(e.g., "성분A, 성분B")일 경우, 배열로 변환
          const ingredientsArray =
            typeof selectedItem.ingredients === "string"
              ? selectedItem.ingredients
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s)
              : [String(selectedItem.ingredients)].filter((s) => s);

          setRecognizedSupplements(
            recognizedSupplements.map((supp) =>
              supp.id === selectedSupplementId
                ? {
                    ...supp,
                    id: selectedItem.id,
                    name: selectedItem.name,
                    // 성분 정보를 배열로 업데이트
                    ingredients: selectedItem.ingredients,
                  }
                : supp
            )
          );
          setSearchModalOpen(false);
        }}
        apiEndpoint="/aiAnalyze/supplements/search"
        type="supps"
      />
    </div>
  );
};

export default SupplementPage;
