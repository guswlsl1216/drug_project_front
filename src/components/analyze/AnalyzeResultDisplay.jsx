import "../../styles/analyze/AnalyzeResultDisplay.css";
import "../../styles/utils/analysisStatus.css";
import ANALYSIS_STATUS_MAPPING from "../../utils/analysisStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import DrugInfo from './DrugInfo';
import { useLocation } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_SERVER_URL;
const ImageUrlKey = "ORIGINAL_IMAGE_URL";

const loadImageUrl = (result) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const detailPathRegex = /^\/history\/detail\/\d+$/;
  const isDetailPage = detailPathRegex.test(currentPath);

  let imageUrl = sessionStorage.getItem(ImageUrlKey) || null;
  
  if (isDetailPage) {
    imageUrl = `${BASE_URL}${result.image_url}`;
  };

  return imageUrl;
};

const DrugImageCropper = ({ box, result }) => {
  const canvasRef = useRef(null);
  const originalImageUrl = loadImageUrl(result); // 세션에서 원본 URL 로드
  const didProcessRef = useRef(false);

  useEffect(() => {
    if (didProcessRef.current) return;
    if (!originalImageUrl || !box || box.length !== 4) return;
    didProcessRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return; // 캔버스 ref 방어 코드

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = originalImageUrl;

    img.onload = () => {
      const [x_min, y_min, x_max, y_max] = box;
      const width = x_max - x_min;
      const height = y_max - y_min;

      // 캔버스 크기를 자를 영역 크기에 맞춥니다.
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(
        img,
        x_min,
        y_min,
        width,
        height, // 원본 이미지의 소스 영역
        0,
        0,
        width,
        height // 캔버스에 그릴 대상 영역
      );
    };

    img.onerror = () => {
      console.error("이미지 로드 실패 또는 CORS 오류");
    };
    
  }, [originalImageUrl, box]); // 원본 URL이나 좌표가 바뀌면 다시 그림

  // 원본 URL이 없거나 좌표가 이상하면 대체 UI를 표시
  if (!originalImageUrl || !box || box.length !== 4) {
    return '';  // 이미지 분석으로 등록하지 않은 의약품 대응
  }

  return <canvas ref={canvasRef} className="meds_box_image" />;
};

const AnalyzeResultDisplay = ({result}) => {
  // 1. 데이터 방어 코드: result가 없으면 렌더링 하지 않음
  if (!result) return null;

  // 2. 상태 매핑 안전하게 가져오기 (status가 0,1,2 범위를 벗어날 경우 대비)
  const statusInfo = ANALYSIS_STATUS_MAPPING[result.status] || {
    status_label: "분석 완료",
    status_message: "결과를 확인해주세요.",
    status_color: "#333",
    status_fontAwesome: faMagnifyingGlass,
  };
  const {status_label, status_message, status_color, status_fontAwesome} = statusInfo;

  const [isOpen, setIsOpen] = useState(false);
  const [drugId, setDrugId] = useState(null);
  const [drugType, setDrugType] = useState(null);
  const [drugBox, setDrugBox] = useState(null);

  // 3. interactions 안전한 정렬 (배열이 없을 경우 빈 배열 처리)
  const interactionsData = result.interactions || [];
  const sortedInteractions = interactionsData.slice().sort((a, b) => {
    return b.level - a.level;
  });

  // 분석 근거
  const ANALYSIS_SOURCES = [
    {
      name: "건강기능식품 종합정보 서비스(식품의약품안전처)",
      url: "https://data.mfds.go.kr/hid/main/main.do",
      title: "건강기능식품 종합정보 서비스",
    },
    {
      name: "한국의약품안전관리원",
      url: "https://www.drugsafe.or.kr/",
      title: "한국의약품안전관리원",
    },
  ];

  const show_interactions = () => {
    return (
      <div className="analyze_result_warnings analyze_result_bg">
        <h4>병용섭취 주의사항</h4>
        <p>※전문적인 판단이 아니므로 자세한 내용은 전문 의약사와 상담하세요.</p>
        {sortedInteractions.map((item, i) => {
          // item.level 매핑 시 방어 코드 추가
          const mapInfo = ANALYSIS_STATUS_MAPPING[item.level] || {
            status_label: "주의",
            status_className: "warning",
          };
          const {status_label, status_className} = mapInfo;

          return (
            <div key={i} className="analyze_result_warning_item">
              <div className={`${status_className} warning_item_level`}>{status_label}</div>
              <div className="warning_item_box_container">
                <div className="warning_item_box">
                  <p className="warning_item_name">{item.product1_name}</p>
                  <p className="warning_item_ingredient">{item.ingredient1}</p>
                </div>
                <div className="warning_item_box">
                  <p className="warning_item_name">{item.product2_name}</p>
                  <p className="warning_item_ingredient">{item.ingredient2}</p>
                </div>
              </div>
              <div className="warning_item_message">{item.message}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const show_duplicates = () => {
    const duplicatesData = result.duplicates || []; // 안전 처리

    return (
      <div className="analyze_result_duplicates analyze_result_bg">
        <h4>중복 성분</h4>
        <p>아래 성분들을 과다 섭취하지 않도록 주의하세요.</p>
        <div className="duplicate_container">
          {duplicatesData.map((item, i) => {
            return (
              <div className="duplicate_box" key={i}>
                <p className="duplicate_ingredient">{item.ingredient}</p>
                <div className="duplicate_names_group">
                  {item.names.map((pdt_name, j) => {
                    return (
                      <p className="duplicate_names" key={j}>
                        {pdt_name}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const show_meds = () => {
    const medsData = result.meds || []; // 안전 처리

    return (
      <div className="analyze_result_meds analyze_result_bg">
        <h4>의약품 목록</h4>
        <div className="drugs_box_container">
          {medsData.map((med, i) => {
            return (
              <div className="drugs_box" key={i}>
                <DrugImageCropper
                  box={med.detection_box} // MedicinePage에서 추가한 좌표 사용
                  result={result}
                />
                <p title={med.name} className="drugs_box_name ellipsis">
                  {med.name}
                </p>
                <p className="show_details_icon">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    onClick={() => {
                      setIsOpen(true);
                      setDrugId(med.id);
                      setDrugType(0);
                      setDrugBox(med.detection_box);
                    }}
                  />
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const show_supps = () => {
    const suppsData = result.supps || []; // 안전 처리

    return (
      <div className="analyze_result_supps analyze_result_bg">
        <h4>영양제 목록</h4>
        <div className="drugs_box_container">
          {suppsData.map((supp, i) => {
            return (
              <div className="drugs_box" key={i}>
                <p title={supp.name} className="drugs_box_name ellipsis">
                  {supp.name}
                </p>
                <p className="show_details_icon">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    onClick={() => {
                      setIsOpen(true);
                      setDrugId(supp.id);
                      setDrugType(1);
                    }}
                  />
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 4. 배열 안전 처리
  const analyzeResultContent = [
    result.interactions || [],
    result.duplicates || [],
    result.meds || [],
    result.supps || [],
  ];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <section className="analyze_result_content">
        <div className="analyze_result_summary">
          <FontAwesomeIcon icon={status_fontAwesome} size="3x" style={{color: status_color}} />
          <h3 style={{color: status_color}}>{status_label}</h3>
          <p>{status_message}</p>
        </div>

        {analyzeResultContent.map((content, i) => {
          if (!content || content.length === 0) {
            return null;
          } else {
            return (
              <div key={i}>
                {i === 0 && show_interactions()}
                {i === 1 && show_duplicates()}
                {i === 2 && show_meds()}
                {i === 3 && show_supps()}
              </div>
            );
          }
        })}

        {isOpen && (
          <DrugInfo
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            drugId={drugId}
            drugType={drugType}
            drugBox={drugBox}
            result={result}
          />
        )}

        <div className="analysis_sources">
          <p className="sources_disclaimer">
            본 분석 결과는 다음 공신력 있는 기관 및 데이터베이스를 기반으로 합니다. 자세한 내용은 각
            사이트를 참조하십시오.
          </p>

          <div className="sources_list">
            {ANALYSIS_SOURCES.map((source, i) => (
              <div key={i} className="source_item">
                <h5 className="source_name">{source.name}</h5>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source_link_button"
                  title={source.title}
                >
                  사이트 바로가기
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AnalyzeResultDisplay;
