import React, {useState} from "react";
import axiosInstance from "../../utils/axiosInstance.js";
// MedicineRegistrationStep 컴포넌트를 사용합니다.
import MedicineRegistrationStep from "./MedicineRegistrationStep";
import "./InteractionAnalysisModal.css";
// ANALYSIS_STATUS_MAPPING은 외부 파일에서 가져옵니다.
import ANALYSIS_STATUS_MAPPING from "../../utils/analysisStatus.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons"; // 예시로 남겨둡니다.


// 임시 매핑은 삭제하고, ANALYSIS_STATUS_MAPPING을 사용합니다.
const RESULT_MAPPING = {
  위험: {label: "위험", color: "var(--color-danger)", icon: "⚠️"},
  주의: {label: "주의", color: "var(--color-warning)", icon: "❗"},
  양호: {label: "양호", color: "var(--color-safe)", icon: "✅"},
};

const InteractionAnalysisModal = ({isOpen, onClose, supplementInfo}) => {
  if (!isOpen) return null;

  // console.log("supplementInfo:", supplementInfo); // 디버깅용

  if (!supplementInfo || !supplementInfo.id || !supplementInfo.name) {
    // 영양제 정보 누락 시 에러 표시 및 닫기 버튼만 제공
    return (
      <div className="modal-overlay">
        <div className="modal-content large-modal">
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
          <p style={{color: "var(--color-danger)", textAlign: "center", padding: "20px"}}>
            ❌ 영양제 정보가 누락되어 상호작용 분석을 시작할 수 없습니다.
          </p>
          <button onClick={onClose} className="button-close" style={{width: "100%"}}>
            확인
          </button>
        </div>
      </div>
    );
  }

  const [step, setStep] = useState("register");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 모달 닫힘 시 상태 초기화
  const handleClose = () => {
    setStep("register");
    setAnalysisResult(null);
    onClose();
  };

  // 상호작용 분석 API 호출 함수
  const analyzeInteraction = async (finalDataToSend) => {
    // console.log("최종 데이터 전송 전:", finalDataToSend); // 디버깅용
    setLoading(true);
    try {
      if (finalDataToSend.meds.length === 0 || finalDataToSend.supps.length === 0) {
        alert("분석을 진행하려면 의약품과 영양제 정보가 모두 필요합니다.");
        setLoading(false);
        return;
      }

      const requestData = {
        supps: finalDataToSend.supps,
        meds: finalDataToSend.meds,
      };

      // /aiAnalyze/analyze/result 엔드포인트 호출
      const response = await axiosInstance.post(`/aiAnalyze/analyze/result`, requestData);
      // console.log("분석 응답:", response.data); // 디버깅용

      // 백엔드 응답을 프론트엔드 analysisResult 구조에 맞게 변환
      const mappedResult = {
        // 백엔드 status (숫자 0, 1, 2)를 그대로 저장합니다.
        result: response.data.status,

        summary: response.data.message || "분석 결과를 받아오지 못했습니다.",

        details:
          response.data.interactions?.map((item) => ({
            // item.level (숫자 1, 2)를 사용하여 매핑 객체에서 레이블을 가져옵니다.
            severity: ANALYSIS_STATUS_MAPPING[item.level]?.status_label || "양호",

            // 백엔드 순서에 맞게 수정: product1=supp, product2=med
            medicine: item.product2_name, // 의약품 이름
            supplement_component: item.ingredient1, // 영양제 성분
            reason: item.message,
          })) || [],
        // 최종 전송된 meds, supps 목록을 결과에 포함하여 표시
        meds: finalDataToSend.meds,
        supps: finalDataToSend.supps,
      };

      setAnalysisResult(mappedResult);
      setStep("result"); // 분석 결과를 받으면 결과 단계로 전환
    } catch (error) {
      console.error("상호작용 분석 오류:", error.response?.data || error.message);
      alert(`상호작용 분석 실패: ${error.response?.data?.message || "서버 오류"}`);
    } finally {
      setLoading(false);
    }
  };

  // InteractionAnalysisModal.js 파일 내 renderContent 함수
  const renderContent = () => {
    if (step === "register") {
      return (
        <>
          {/* 1. 의약품 등록 단계 (MedicineRegistrationStep) */}
          <MedicineRegistrationStep
            initialSuppsId={supplementInfo?.id}
            onNext={analyzeInteraction} // 분석 시작 시 analyzeInteraction 호출
          />

          {/* ⭐ 닫기 버튼 추가 (등록 단계 하단) */}
          <div style={{textAlign: "center"}}>
            <button
              className="button-close"
              onClick={handleClose}
              style={{marginTop: "20px", width: "20%", padding: "10px"}}
            >
              닫기
            </button>
        </div>
        </>
      );
    } else if (step === "result" && analysisResult) {
      // 2. 분석 결과 표시 단계
      const resultStatus = analysisResult.result; // 이 값은 숫자 (0, 1, 2)
      const statusData = ANALYSIS_STATUS_MAPPING[resultStatus] || ANALYSIS_STATUS_MAPPING[0];

      return (
        <div className="analysis-result-section">
          <h3>"{supplementInfo.name}" 섭취 안전성 분석 결과</h3>

          {/* 분석 결과 요약 */}
          <div className="analyze_result_summary">
            <span style={{fontSize: "3rem", color: statusData.status_color}}>
              {statusData.status_fontAwesome ? (
                <FontAwesomeIcon icon={statusData.status_fontAwesome} />
              ) : (
                statusData.status_label.slice(0, 1)
              )}
            </span>
            <h3 style={{color: statusData.status_color}}>{statusData.status_label}</h3>
            <p>{analysisResult.summary}</p>
            <p className="sources_disclaimer" style={{marginTop: "15px"}}>
              ※전문적인 판단이 아니므로 자세한 내용은 전문 의약사와 상담하세요.
            </p>
          </div>

          <hr style={{margin: "20px 0"}} />

          {/* 의약품/영양제 목록 */}
          <div className="analyze_result_meds_supps analyze_result_bg">
            <h4>등록된 목록</h4>
            <div style={{display: "flex", gap: "20px"}}>
              <div style={{flex: 1}}>
                <h5>💊 의약품 ({analysisResult.meds.length}개)</h5>
                <ul style={{listStyleType: "none", padding: 0}}>
                  {analysisResult.meds.map((med, i) => (
                    <li key={i} style={{padding: "5px 0", borderBottom: "1px dotted #ddd"}}>
                      {med.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{flex: 1}}>
                <h5>🌿 영양제 ({analysisResult.supps.length}개)</h5>
                <ul style={{listStyleType: "none", padding: 0}}>
                  {analysisResult.supps.map((supp, i) => (
                    <li key={i} style={{padding: "5px 0", borderBottom: "1px dotted #ddd"}}>
                      {supp.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 병용섭취 주의사항 (세부 상호작용) */}
          {analysisResult.details.length > 0 && (
            <div className="analyze_result_warnings analyze_result_bg" style={{marginTop: "20px"}}>
              <h4>병용섭취 주의사항</h4>
              {analysisResult.details.map((detail, index) => {
                // detail.severity (문자열)을 숫자로 변환하여 ANALYSIS_STATUS_MAPPING에서 가져옵니다.
                const severityMap = {"위험": 2, "주의": 1, "양호": 0};
                const detailStatusData = ANALYSIS_STATUS_MAPPING[severityMap[detail.severity]] || ANALYSIS_STATUS_MAPPING[0];

                return (
                  <div
                    key={index}
                    className="analyze_result_warning_item"
                    style={{
                      border: `1px solid ${detailStatusData.status_color || "#ccc"}`,
                      padding: "10px",
                      margin: "10px 0",
                      borderRadius: "5px",
                    }}
                  >
                    <p style={{fontWeight: "bold"}}>
                      <span style={{color: detailStatusData.status_color || "#000"}}>
                        [{detail.severity}]
                      </span>
                      &nbsp;{detail.medicine} (약물) & {detail.supplement_component} (성분)
                    </p>
                    <p style={{fontSize: "0.9em", color: "#555"}}>{detail.reason}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* ⭐ 닫기 버튼 추가 (결과 단계 하단) */}
          <button
            className="button-close"
            onClick={handleClose}
            style={{marginTop: "30px", width: "100%", padding: "10px"}}
          >
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
        <h2 className="shop-modal-header">병용섭취 여부 확인</h2>
        {step === "register" && (
          <p className="shop-modal-subtitle">
             영양제와의 벙용섭취 분석을 위해 복용 중인 의약품을 등록 해 주세요.
          </p>
        )}
        {loading && <div className="loading-overlay">분석 중...</div>}

        {renderContent()}
      </div>
    </div>
  );
};

export default InteractionAnalysisModal;