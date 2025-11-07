import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import SearchModal from "../../components/ui/SearchModal";
import "../../styles/MedicinePage.css";

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
    // 💡 저장된 약물 목록 (meds) 구조를 반환
    return serializedData ? JSON.parse(serializedData) : [];
  } catch (error) {
    console.error("약물 목록 세션 불러오기 오류:", error);
    return [];
  }
};
// -----------------------------

const SupplementPage = () => {
  const navigate = useNavigate(); // 👇🏼 상태명 변경: medicine -> supplement
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedSupplementId, setSelectedSupplementId] = useState(null); // 👇🏼 상태명 변경 및 초기값 변경 (제품명 + 영문 성분명 구조 반영)
  //  영양제의 ingredients는 배열(string[]) 구조
  const [recognizedSupplements, setRecognizedSupplements] = useState([
    {id: 1, name: "영양제를 입력하세요", ingredients: ["성분 1"]},
    {id: 2, name: "영양제를 입력하세요", ingredients: ["성분 2"]},
    {id: 3, name: "영양제를 입력하세요", ingredients: ["성분 3"]},
    {id: 4, name: "영양제를 입력하세요", ingredients: ["성분 4"]},
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
    const newId = Math.max(...recognizedSupplements.map((supp) => supp.id)) + 1; // 새로운 영양제도 ingredients 필드를 배열로 포함
    setRecognizedSupplements([
      ...recognizedSupplements,
      {id: newId, name: "새로운 영양제", ingredients: []},
    ]);
  };

  const handleNext = async () => {
    // 1. MedicinePage에서 임시 저장된 약물 목록 불러오기
    const medicineList = loadMedicineList(); // 2. 서버에 전송할 최종 데이터 구성

    const finalDataToSend = {
      meds: medicineList,
      supps: recognizedSupplements,
    };

    console.log("--- 서버 전송 최종 데이터 ---", finalDataToSend); // 3. 서버 전송 및 결과 수신 로직 (가정)

    // 실제로는 여기에 axios.post(...) 호출이 들어갑니다.
    // const response = await axios.post('/api/analyze', finalDataToSend);
    // const analysisResult = response.data;
    // 👇🏼 💡 서버 응답 예시 (Duplicates와 Interactions 구조 포함)
    const analysisResult = {
      status: 2,
      meds: [
        {id: 158, name: "로그펜정400밀리그람(이부프로펜)(수출용)", ingredients: "이부프로펜"},
        {id: 1330, name: "제클라정(클래리트로마이신)", ingredients: "클래리트로마이신"},
        {id: 4865, name: "심바로드정20밀리그램(심바스타틴)", ingredients: "심바스타틴"},
      ],
      supps: [
        {id: 100850, name: "베지 오메가-3", ingredients: ["EPA 및 DHA 함유 유지 (오메가-3)"]},
        {
          id: 100963,
          name: "눈촉촉 오메가3 오리지널",
          ingredients: ["EPA 및 DHA 함유 유지 (오메가-3)"],
        },
      ],
      // 👇🏼 중복 성분 데이터
      duplicates: [
        {
          ingredient: "EPA 및 DHA 함유 유지 (오메가-3)",
          names: ["베지 오메가-3", "눈촉촉 오메가3 오리지널"],
        },
      ],
      // 👇🏼 상호작용 데이터
      interactions: [
        {
          product1_name: "로그펜정400밀리그람(이부프로펜)(수출용)",
          ingredient1: "이부프로펜",
          product2_name: "베지 오메가-3",
          ingredient2: "EPA 및 DHA 함유 유지 (오메가-3)",
          level: 1,
          message: "출혈의 위험을 증가시킬 수 있어요!",
        },
        {
          product1_name: "제클라정(클래리트로마이신)",
          ingredient1: "클래리트로마이신",
          product2_name: "심바로드정20밀리그램(심바스타틴)",
          ingredient2: "심바스타틴",
          level: 2,
          message: "근병증, 횡문근융해의 위험증가",
        },
      ],
    };

    // 4. 분석 결과를 세션에 저장
    // ResultPage는 이 세션 데이터를 loadAnalysisResult()로 불러 사용합니다.
    saveAnalysisResult(analysisResult);

    // 5. 결과 페이지로 이동
    navigate("/analyze/result");
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
        onSelect={(selectedItem) => {
          setRecognizedSupplements(
            recognizedSupplements.map((supp) =>
              supp.id === selectedSupplementId
                ? {
                    ...supp,
                    name: selectedItem.name,
                    // 💡 SearchModal에서 ingredients를 배열로 받아 업데이트 가정
                    ingredients: selectedItem.ingredients || supp.ingredients,
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
