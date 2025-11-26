import React, {useEffect, useState} from "react";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance.js";
import SearchModal from "./SearchModal";
// SearchModal.css 파일은 제공되지 않았으므로 그대로 둡니다.
import "../../styles/SearchModal.css";
import requestHandler from "../../utils/requestHandler.js";
import AnalysisResultModal from "./AnalysisResultModal";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const SuppsDataKey = "SUPPLEMENT_DATA_TO_ANALYZE"; // 영양제 데이터 키
const MedicineDataKey = "MEDICINE_LIST_TO_SEND";

const loadSupplementData = () => {
  try {
    const serializedData = sessionStorage.getItem(SuppsDataKey);
    if (serializedData) {
      const loadedData = JSON.parse(serializedData);
      // ingredients가 문자열이면 배열로 변환
      if (loadedData && loadedData.ingredients && typeof loadedData.ingredients === "string") {
        loadedData.ingredients = loadedData.ingredients
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
      }
      return loadedData;
    }
    return null; // 세션에 데이터가 없으면 null 반환
  } catch (error) {
    console.error("영양제 데이터 세션 불러오기 오류:", error);
    return null;
  }
};

// 영양제 데이터를 세션에 저장
const saveSupplementData = (data) => {
  try {
    sessionStorage.setItem(SuppsDataKey, JSON.stringify(data));
    console.log("영양제 데이터 세션 저장 완료.");
  } catch (error) {
    console.error("영양제 데이터 세션 저장 오류:", error);
  }
};

// 의약품 목록을 세션에서 불러옴 (MedicinePage의 loadMedicineList와 동일)
const loadMedicineList = () => {
  try {
    const serializedData = sessionStorage.getItem(MedicineDataKey);
    if (serializedData) {
      const loadedData = JSON.parse(serializedData);
      return loadedData.length > 0
        ? loadedData.map((med) => ({...med, isValidated: med.isValidated || false}))
        : [{id: 1, name: "", ingredients: [], korName: "", isValidated: false}];
    }
    return [{id: 1, name: "", ingredients: [], korName: "", isValidated: false}];
  } catch (error) {
    console.error("약물 목록 세션 불러오기 오류:", error);
    return [{id: 1, name: "", ingredients: [], korName: "", isValidated: false}];
  }
};

// 의약품 목록을 세션에 저장 (MedicinePage의 saveMedicineList와 동일)
const saveMedicineList = (data) => {
  try {
    sessionStorage.setItem(MedicineDataKey, JSON.stringify(data));
    console.log("약물 목록 세션 저장 완료.");
  } catch (error) {
    console.error("세션 저장 오류:", error);
  }
};

const MedicineRegistrationStep = ({onNext, initialSuppsId = null}) => {
  // 상태 관리
  const [uploadedFile, setUploadedFile] = useState(null);
  const [medicineImage, setMedicineImage] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);
  const [supplementData, setSupplementData] = useState(loadSupplementData);
  const [recognizedMedicines, setRecognizedMedicines] = useState(loadMedicineList);
  const [resultModalOpen, setResultModalOpen] = useState(false); // 결과 모달 표시 상태
  const [analysisResult, setAnalysisResult] = useState(null); // 분석 결과 저장 상태


  useEffect(() => {
    // 등록된 의약품 목록이 변경될 때마다 세션에 저장 (상태 유지)
    saveMedicineList(recognizedMedicines);
  }, [recognizedMedicines]);

  useEffect(() => {
    // 영양제 데이터가 변경될 때마다 세션에 저장
    if (supplementData) {
      saveSupplementData(supplementData);
    }
  }, [supplementData]);


  useEffect(() => {
    if (initialSuppsId) {
      const fetchInitialSupplement = async () => {
        try {
          // 백엔드 API 호출 (이전 응답에서 추가한 엔드포인트)
          const response = await axiosInstance.get(
            `${SERVER_URL}/goods/aiAnalyze/supplements/detail/${initialSuppsId}`
          );

          const suppData = response.data;

          if (suppData && suppData.id) {
            // 성분 데이터를 프론트엔드 상태 구조에 맞게 배열로 변환
            const ingredientsArray =
              typeof suppData.ingredients === "string"
                ? suppData.ingredients
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s)
                : suppData.ingredients;

            const initialSupp = {
              id: suppData.id,
              name: suppData.name,
              ingredients: ingredientsArray, // 성분 배열로 저장
              korName: suppData.korName || suppData.name,
              isValidated: true, // DB에서 가져온 데이터이므로 확정 상태
            };

            // ⭐ 영양제 상태에 저장 (recognizedMedicines에 넣지 않음)
            setSupplementData(initialSupp);
            console.log("초기 영양제 데이터 로드 완료:", initialSupp);
          }
        } catch (error) {
          console.error("초기 영양제 데이터 로딩 오류:", error.response?.data || error.message);
          // 실패 시, supplementData는 null로 유지
        }
      };

      fetchInitialSupplement();
    }
  }, [initialSuppsId]);

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
      ingredients: [], // 초기 성분 배열 추가
      korName: "", // 초기 한국어 이름 추가
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
  const handleAnalyzeStart = async () => {
    // 1. 유효한 의약품 목록 필터링 (이름이 비어있지 않은 항목)
    const validMeds = recognizedMedicines.filter((med) => med.name.trim() !== "");

    // 유효성 검사 (의약품 목록만 검사)
    const hasValidatedMedicine = validMeds.some((med) => med.isValidated === true);
    const hasAnyUnvalidatedMedicine = validMeds.some((med) => med.isValidated === false);

    // [추가] 영양제 데이터가 로드되지 않은 경우 분석 불가능
    if (!supplementData) {
      alert("분석을 시작할 영양제 정보가 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    if (validMeds.length === 0) {
      alert("분석을 시작하려면 의약품을 1개 이상 등록해야 합니다.");
      return;
    }

    // 모든 항목이 확정되어야 분석 가능
    if (hasAnyUnvalidatedMedicine) {
      alert(
        "등록된 의약품 목록에 유효하지 않은 (미확정된) 항목이 남아있습니다. \n모든 항목을 삭제하거나 '✓' 버튼을 눌러 의약품 정보를 확정해야 분석을 시작할 수 있습니다."
      );
      return;
    }

    // 확정된 (isValidated: true) 의약품만 서버 전송을 위해 성분 문자열로 변환
    const finalMedsToSend = validMeds
      .filter((med) => med.isValidated)
      .map((med) => {
        // ingredients 배열을 쉼표 문자열로 변환 (서버 전송 형식)
        let safeIngredients = "";
        if (med.ingredients) {
          safeIngredients = Array.isArray(med.ingredients)
            ? med.ingredients.join(", ")
            : med.ingredients; // 이미 문자열일 경우 그대로 사용
        }

        return {
          // id, name, korName, ingredients만 전송 (isValidated는 서버에 불필요)
          id: med.id,
          name: med.name,
          ingredients: safeIngredients,
          korName: med.korName || med.name,
        };
      });;

    // 영양제 데이터도 성분 배열을 쉼표 문자열로 변환
    const suppsToSend = supplementData
      ? {
          ...supplementData,
          ingredients: Array.isArray(supplementData.ingredients)
            ? supplementData.ingredients.join(", ")
            : supplementData.ingredients,
        }
      : null;

    const finalDataToSend = {
      meds: finalMedsToSend, // 의약품 목록 (배열)
      supps: suppsToSend ? [suppsToSend] : [], // 영양제 목록 (단일 항목 배열)
    };

    // ⭐ 서버 전송 직전, 데이터 구조 확인을 위한 로그 추가
    console.log("--- 상호작용 분석 시작 Payload 확인 ---");
    console.log("finalDataToSend (서버로 전송될 최종 데이터):", finalDataToSend);
    console.log("--- Payload 확인 종료 ---");

    // 상위 컴포넌트의 분석 시작 함수에 최종 데이터를 전달
//     onNext(finalDataToSend);

    try {
      const response = await requestHandler({
        method: "post",
        url: "/aiAnalyze/analyze/result",
        payload: finalDataToSend,
      });

      const analysisResult = response.data; // 서버에서 받은 분석 결과

      console.log("--- 서버 수신 분석 결과 ---", analysisResult);

      setAnalysisResult(analysisResult);
      setResultModalOpen(true);

    } catch (error) {
      console.error("분석 결과 요청 중 오류 발생:", error);
      alert("분석 요청 중 오류가 발생했습니다. 콘솔을 확인해 주세요.");
    }
  };

  return (
    <div className="medicine-registration-step">
      <div className="content-wrapper">
        {/* ⭐ 영양제 정보 표시 (옵션): 사용자에게 현재 분석 대상임을 알림 */}
        {supplementData && (
          <div
            style={{
              marginBottom: "20px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              background: "#f9f9f9",
            }}
          >
            <p style={{fontWeight: "bold", margin: 0}}>
                <span role="img" aria-label="supplement"></span>
                현재 분석 대상 영양제: {supplementData.name} (확정됨)
            </p>
          </div>
        )}
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
          <button className="button-search" onClick={handleSearch} disabled={!uploadedFile}>
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

                {/* 확정 버튼 클릭 시 SearchModal을 열어 정확한 약 정보를 검색/확정 */}
                <button
                  className="button-edit"
                  onClick={() => {
                        if (!med.isValidated) {
                            setSelectedMedicineId(med.id);
                            setSearchModalOpen(true);
                        } else {
                            // 이미 확정된 경우 (재확인 기능은 구현하지 않음)
                            alert("이미 확정된 의약품입니다. 수정하려면 삭제 후 다시 등록해주세요.");
                        }
                  }}
                  disabled={med.name.trim() === ""} // 이름이 없으면 확정 불가
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
          병용섭취 분석 시작
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
                    id: selectedItem.id, // ID 업데이트 (DB ID로)
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
      <AnalysisResultModal
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        resultData={analysisResult}
      />
    </div>
  );
};

export default MedicineRegistrationStep;