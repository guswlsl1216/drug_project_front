import React, {useState} from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import SearchModal from "./SearchModal"; // 기존 SearchModal 재사용
import MedicineRegistrationStep from "./MedicineRegistrationStep"; // 1단계 약물 등록 컴포넌트 (아래에 정의)
import "../../../styles/Modal.css"; // 모달 스타일은 별도 파일로 관리

const InteractionAnalysisModal = ({isOpen, onClose, supplementInfo}) => {
  if (!isOpen) return null;

  // 단계 상태: 'register' (약물 등록), 'result' (분석 결과)
  const [step, setStep] = useState("register");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 약물 등록 단계에서 사용할 상태 (세션 스토리지 대신 모달 내부에서 관리)
  // MedicineRegistrationStep 컴포넌트로 전달될 recognizedMedicines 상태
  const [recognizedMedicines, setRecognizedMedicines] = useState([]);

  // 상호작용 분석 API 호출 함수
  const analyzeInteraction = async () => {
    setLoading(true);
    try {
      // ⭐ 유효성 검사: 확정된 약물만 필터링
      const validatedMedicines = recognizedMedicines.filter((med) => med.isValidated);

      if (validatedMedicines.length === 0) {
        alert("분석을 진행하려면 DB에 확정된 의약품이 1개 이상 필요합니다.");
        setLoading(false);
        return;
      }

      // 서버로 보낼 데이터 구조 (예시)
      const requestData = {
        supplement: supplementInfo, // 영양제 정보
        medicines: validatedMedicines.map((med) => ({
          name: med.name,
          ingredients: med.ingredients,
          // 기타 약물 정보
        })),
      };

      // /analyze/interaction 엔드포인트 호출 (가정)
      const response = await axiosInstance.post(`/analyze/interaction`, requestData);

      // 응답 데이터 구조: { result: '위험', summary: '...', details: [...] } 가정
      setAnalysisResult(response.data);
      setStep("result"); // 2단계 결과 보기로 전환
    } catch (error) {
      console.error("상호작용 분석 오류:", error.response?.data || error.message);
      alert(`상호작용 분석 실패: ${error.response?.data?.message || "서버 오류"}`);
    } finally {
      setLoading(false);
    }
  };

  // 모달 닫힘 시 초기화
  const handleClose = () => {
    setStep("register");
    setAnalysisResult(null);
    setRecognizedMedicines([]);
    onClose();
  };

  const renderContent = () => {
    if (step === "register") {
      return (
        <MedicineRegistrationStep
          recognizedMedicines={recognizedMedicines}
          setRecognizedMedicines={setRecognizedMedicines}
          onNext={analyzeInteraction} // 검사 시작 버튼 역할
        />
      );
    } else if (step === "result" && analysisResult) {
      // 2단계: 분석 결과 표시
      const resultText = analysisResult.result; // '양호', '주의', '위험'
      const resultClass =
        resultText === "위험" ? "danger" : resultText === "주의" ? "warning" : "safe";

      return (
        <div className="analysis-result-section">
          <h3>"{supplementInfo.name}" 섭취 안전성 분석 결과</h3>
          <div className={`analysis-summary ${resultClass}`}>
            <span className="result-indicator">{resultText}</span>
            <p>{analysisResult.summary || "상호작용 분석 결과 요약"}</p>
          </div>

          {/* 상세 정보 */}
          <h4>영양제 성분과 약물의 잠재적 상호작용</h4>
          {analysisResult.details &&
            analysisResult.details.map((detail, index) => (
              <p key={index} className="interaction-detail">
                <strong
                  className={
                    detail.severity === "위험"
                      ? "danger"
                      : detail.severity === "주의"
                      ? "warning"
                      : "safe"
                  }
                >
                  [{detail.severity}]
                </strong>
                {detail.medicine} (약물) & {detail.supplement_component} (성분): {detail.reason}
              </p>
            ))}
          <button className="button-close" onClick={handleClose}>
            닫기
          </button>
        </div>
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <button className="modal-close-btn" onClick={handleClose}>
          ×
        </button>
        <h2>상호작용 섭취 여부 확인</h2>

        {loading && <div className="loading-overlay">분석 중...</div>}

        {renderContent()}

        {/* 1단계에서 다음 버튼은 MedicineRegistrationStep 내부에서 처리 */}
        {/* 2단계에서만 닫기 버튼이 보입니다. */}
      </div>
    </div>
  );
};

export default InteractionAnalysisModal;
