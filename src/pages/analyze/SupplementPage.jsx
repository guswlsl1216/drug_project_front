import React, {useEffect, useState} from "react";
import SearchModal from "../../components/ui/SearchModal";
import "../../styles/MedicinePage.css";
import requestHandler from "../../utils/requestHandler";
import UseNavi from "../../utils/UseNavi";
import { useLocation } from "react-router-dom";

// --- 세션 관리 유틸리티 ---
const ResultDataKey = "ANALYSIS_RESULT_DATA";
const MedicineDataKey = "MEDICINE_LIST_TO_SEND";
const SupplementDataKey = "SUPPLEMENT_LIST_TO_SEND";



const saveAnalysisResult = (data) => {
  try {
    sessionStorage.setItem(ResultDataKey, JSON.stringify(data));
    console.log("분석 결과 데이터 세션 저장 완료.");
  } catch (error) {
    console.error("세션 저장 오류:", error);
  }
};

// 영양제 목록을 세션에 저장하는 함수 추가
const saveSupplementList = (data) => {
  try {
    sessionStorage.setItem(SupplementDataKey, JSON.stringify(data));
    console.log("영양제 목록 세션 저장 완료.");
  } catch (error) {
    console.error("세션 저장 오류:", error);
  }
};

const loadSupplementList = () => {
  try {
    const serializedData = sessionStorage.getItem(SupplementDataKey);
    if (serializedData) {
      const loadedData = JSON.parse(serializedData);
      // isValidated 필드가 없으면 false로 초기화
      return loadedData.length > 0
        ? loadedData.map((supp) => ({...supp, isValidated: supp.isValidated || false}))
        : [{id: 1, name: "", ingredients: [], isValidated: false}];
    }
    return [{id: 1, name: "", ingredients: [], isValidated: false}];
  } catch (error) {
    console.error("영양제 목록 세션 불러오기 오류:", error);
    return [{id: 1, name: "", ingredients: [], isValidated: false}];
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
  const {goTo} = UseNavi()
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedSupplementId, setSelectedSupplementId] = useState(null);

  // 추가 - 분석 요청한 의약품 이미지 파일 전송용
  const location = useLocation();
  const { uploadedFile } = location.state
    ? location.state
    : '';

  // 상태 초기값: ingredients는 배열(string[])로 관리
  const [recognizedSupplements, setRecognizedSupplements] = useState(loadSupplementList());

  // useEffect(() => {
  //   // 탭 이동이나 다른 페이지로 이동하여 컴포넌트가 언마운트될 때 호출됨
  //   return () => {
  //     saveSupplementList(recognizedSupplements);
  //     console.log("자동 저장 완료: 탭 이동/페이지 이탈 전 영양제 데이터 저장됨.");
  //   };
  // }, [recognizedSupplements]);

  const handleSupplementNameChange = (id, newName) => {
    setRecognizedSupplements(
      recognizedSupplements.map((supp) =>
        supp.id === id ? {...supp, name: newName, isValidated: false} : supp
      )
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
      {id: newId, name: "", ingredients: [], isValidated: false}, // ingredients는 배열로 초기화
    ]);
  };

  const handleNext = async () => {
    // 이미지 파일 url 세션 삭제
    sessionStorage.removeItem("uploadedFile");

    // 분석 이미지 파일 임시 저장
    let publicImageUrl = '';

    if (uploadedFile) {
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile, uploadedFile.name );

        await requestHandler({
          method: "post",
          url: "/aiAnalyze/images/temp",
          payload: formData,
          userImage: true,
          onSuccess: (data) => {
            publicImageUrl = data.image_url;
            sessionStorage.setItem("uploadedFile", publicImageUrl);
          },
          onError: (msg) => {
            console.error("임시 파일 업로드 요청 중 오류 발생 : ", msg);
          }
        })
      } catch (e) {
        console.error("임시 파일 업로드 중 오류 발생 : ", e);
        return;
      }
    }
    
    const medicineList = loadMedicineList();
    const hasUnvalidatedMedicineInSession = medicineList.some((med) => med.isValidated === false);

    if (hasUnvalidatedMedicineInSession) {
      alert(
        "의약품 목록에  등록되지 않은 (미확정된) 항목이 남아있습니다. \n\n이전 단계로 돌아가 모든 의약품을 삭제하거나 '✓' 버튼을 눌러 확정해야 분석 결과를 볼 수 있습니다."
      );
      // 의약품 목록에 문제가 있으면 페이지 이동을 중단하고 의약품 페이지로 돌려보내는 것을 고려해볼 수 있습니다.
      // navigate("/analyze/medicine");
      return;
    }
    // 1. 유효한(DB 등록된) 영양제(isValidated: true)가 목록에 하나라도 있는지 확인
    const hasValidatedSupplement = recognizedSupplements.some((supp) => supp.isValidated === true);

    // 2. 미확정 항목 (isValidated: false)이 하나라도 남아있는지 확인
    const hasAnyUnvalidatedSupplement = recognizedSupplements.some(
      (supp) => supp.isValidated === false
    );

    // [필수 검사] 유효한 항목이 아예 없는 경우
    if (!hasValidatedSupplement) {
      alert(
        "다음 단계로 진행하려면 영양제를 1개 이상 등록해야 합니다.\n영양제를 입력하고 '✓' 버튼을 눌러 정확한 영양제 정보를 확정해주세요."
      );
      return;
    }

    // [차단 검사] 미확정 항목(isValidated: false)이 목록에 하나라도 남아있는 경우
    if (hasAnyUnvalidatedSupplement) {
      alert(
        "등록된 영양제 목록에 유효하지 않은 (미확정된) 항목이 남아있습니다. \n모든 항목을 삭제하거나 '✓' 버튼을 눌러 영양제 정보를 확정해야 결과보기가 가능합니다."
      );
      return;
    }

    // 유효성 검사 로직 추가 끝
    

    // 2. 서버에 전송할 최종 데이터 구성:
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

      const noDetectionBox = medicineList.every(med => !med.detection_box);
      if (noDetectionBox) {
        sessionStorage.removeItem("uploadedFile");
      }

      // 5. 결과 페이지로 이동
      goTo("/analyze/result");
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
              <div key={supp.id} className={`medicine-item ${supp.isValidated ? "validated" : "unvalidated"}`}>
                <input
                  type="text"
                  placeholder="제품명을 입력하고 체크버튼을 눌러 등록"
                  className="medicine-input"
                  value={supp.name}
                  onChange={(e) => handleSupplementNameChange(supp.id, e.target.value)}
                  onKeyDown={(e) => {
                    if(e.key === "Enter") {
                      setSelectedSupplementId(supp.id);
                      setSearchModalOpen(true);
                    }
                  }}
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
                  x
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
                    isValidated: true,
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
