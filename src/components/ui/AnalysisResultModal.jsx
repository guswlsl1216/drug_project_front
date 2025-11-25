import React from "react";
// CSS 파일은 프로젝트 경로에 맞게 적절히 지정해주세요.
import "./AnalysisResultModal.css";

// 컴포넌트 이름은 AnalysisResultModal로 지정합니다.
const AnalysisResultModal = ({isOpen, onClose, resultData}) => {
  // 모달 기능: isOpen이 false이거나 resultData가 없으면 null 반환
  if (!isOpen || !resultData) return null; // 서버 응답 구조를 기반으로 데이터 추출 // meds, supps가 null일 수 있으므로 빈 배열로 기본값 설정

  const {status, meds, supps, interactions, analysis_uid} = resultData; // 1. status 값에 따른 위험도 텍스트 및 클래스 결정

  let riskText;
  let riskClass; // CSS 클래스 이름

  switch (status) {
    case 0:
      riskText = "양호";
      riskClass = "risk-safe";
      break;
    case 1:
      riskText = "주의";
      riskClass = "risk-caution";
      break;
    case 2:
      riskText = "위험";
      riskClass = "risk-danger";
      break;
    default:
      riskText = "분석 정보 없음";
      riskClass = "risk-unknown";
  } // 2. 상호작용 세부 정보 표시 준비

  const hasInteractions = interactions && interactions.length > 0; // 3. 복용 중인 의약품/영양제 목록 합치기

  const allItems = [...(meds || []), ...(supps || [])];

  // 4. 상호작용 세부 정보를 Display 구조로 표시하는 함수
  const renderInteractions = () => {
    // 주의: ANALYSIS_STATUS_MAPPING이 외부 스코프에 정의되어 있지 않아 임시로 처리합니다.
    return (
      <div className="analyze_result_warnings analyze_result_bg">
        <h4 className="section-title">병용섭취 주의사항</h4>
        <p>※전문적인 판단이 아니므로 자세한 내용은 전문 의약사와 상담하세요.</p>

        {interactions.map((item, i) => {
          // item.level 값에 따라 CSS 클래스와 라벨을 임시로 설정
          const status_label = item.level === 2 ? "위험" : item.level === 1 ? "주의" : "정보";
          const status_className =
            item.level === 2 ? "danger" : item.level === 1 ? "warning" : "info";

          // 이전에 제공하신 데이터 구조(product1_name, message 등)를 기반으로 필드 이름을 추정하여 사용합니다.
          return (
            <div key={i} className="analyze_result_warning_item">
              <div className={`${status_className} warning_item_level`}>{status_label}</div>

              <div className="warning_item_box_container">
                <div className="warning_item_box">
                  <p className="warning_item_name">
                    {item.product1_name || item.korName || "의약품 1"}
                  </p>
                  <p className="warning_item_ingredient">{item.ingredient1 || "성분 정보 없음"}</p>
                </div>

                <div className="warning_item_box">
                  <p className="warning_item_name">
                    {item.product2_name || item.medB || "의약품 2"}
                  </p>
                  <p className="warning_item_ingredient">{item.ingredient2 || "성분 정보 없음"}</p>
                </div>
              </div>

              <div className="warning_item_message">
                {item.message || item.summary || "요약 정보 없음"}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      
      <div className="modal-content">
        {/* 모달 헤더 (닫기 버튼 유지) */}
        <div className="modal-header">
          <h2 className="modal-title"> 의약품-영양제 병용섭취 분석 결과</h2>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        {/* 1. 종합 위험도 평가 */}
        <div className={`analysis-result-summary ${riskClass}`}>
           <h3 className="summary-title"> 분석 종합 결과</h3>
          <p className="summary-risk-text">{riskText}</p>
          {status === 2 && (
            <p className="summary-danger-message">
            함께 복용하면 위험한 성분이 있어요! 반드시 전문가와 상담하세요.
              
            </p>
          )}
          
        </div>
        <h3 className="section-title">분석 대상 목록 ({allItems.length}개)</h3>
        {allItems.length > 0 ? (
          <div className="item-list-container analyze_result_bg" style={{padding: "15px"}}>
            {allItems.map((item, index) => (
              <span
                key={index}
                className={`analysis-item-tag ${item.ingredients ? "type-supps" : "type-meds"}`}
              >
                {item.ingredients
                  ? ` ${item.name || item.korName}`
                  : ` ${item.name || item.korName}`}
              </span>
            ))}
          </div>
        ) : (
          <p>분석 대상 목록이 없습니다.</p>
        )}
        {hasInteractions ? (
          renderInteractions() // 상호작용 상세 구조 렌더링 함수 호출
        ) : (
          <p className="interactions-safe-message">
            ✅ 분석된 의약품 및 영양제 간에 **특이한 상호작용은 발견되지 않았습니다.**
          </p>
        )}
        <div className="modal-footer">
          <button className="button-close" onClick={onClose}>
             닫기 
          </button>
          
        </div>
        
      </div>
      <div className="modal-content-spacer"></div> {" "}
    </div>
  );
};

// AnalysisResultModal로 export 합니다.
export default AnalysisResultModal;
