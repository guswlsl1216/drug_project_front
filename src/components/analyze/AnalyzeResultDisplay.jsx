import "../../styles/analyze/AnalyzeResultDisplay.css";
import "../../styles/utils/analysisStatus.css";
import ANALYSIS_STATUS_MAPPING from "../../utils/analysisStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import DrugInfo from "./DrugInfo";

const ImageUrlKey = "ORIGINAL_IMAGE_URL";

const loadImageUrl = () => {
  return sessionStorage.getItem(ImageUrlKey) || null;
};

const DrugImageCropper = ({ box }) => {
  const canvasRef = useRef(null);
  const originalImageUrl = loadImageUrl(); // 세션에서 원본 URL 로드

  useEffect(() => {
    if (!originalImageUrl || !box || box.length !== 4) return;

    const canvas = canvasRef.current;
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

      // 원본 이미지에서 [x_min, y_min] 위치에서 width, height 크기만큼 잘라,
      // 캔버스에 그립니다.
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
      // 이미지 로드 실패 시 대체 텍스트나 아이콘을 표시할 수 있습니다.
    };
  }, [originalImageUrl, box]); // 원본 URL이나 좌표가 바뀌면 다시 그림

  // 원본 URL이 없거나 좌표가 이상하면 대체 UI를 표시
  if (!originalImageUrl || box.length !== 4) {
    return <p className="meds_box_image">이미지 없음</p>;
  }

  return <canvas ref={canvasRef} className="meds_box_image" />;
};

const AnalyzeResultDisplay = ({ result }) => {
  const { status_label, status_message, status_color, status_fontAwesome } = ANALYSIS_STATUS_MAPPING[result.status];

  const [isOpen, setIsOpen] = useState(false);
  const [drugId, setDrugId] = useState(null);
  const [drugType, setDrugType] = useState(null);
  const [drugBox, setDrugBox] = useState(null);

  // interactions 내림차순 정렬
  const sortedInteractions = result.interactions.slice().sort((a, b) => {
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
          const { status_label, status_className } = ANALYSIS_STATUS_MAPPING[item.level];

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
    return (
      <div className="analyze_result_duplicates analyze_result_bg">
        <h4>중복 성분</h4>
        <p>아래 성분들을 과다 섭취하지 않도록 주의하세요.</p>
        <div className="duplicate_container">
          {result.duplicates.map((item, i) => {
            return (
              <div className="duplicate_box" key={i}>
                <p className="duplicate_ingredient">{item.ingredient}</p>
                <div className="duplicate_names_group">
                  {item.names.map((pdt_name, i) => {
                    return (
                      <p className="duplicate_names" key={i}>
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
    return (
      <div className="analyze_result_meds analyze_result_bg">
        <h4>의약품 목록</h4>
        <div className="drugs_box_container">
          {result.meds.map((med, i) => {
            return (
              <div className="drugs_box" key={i}>
                <DrugImageCropper
                  box={med.detection_box} // MedicinePage에서 추가한 좌표 사용
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
    return (
      <div className="analyze_result_supps analyze_result_bg">
        <h4>영양제 목록</h4>
        <div className="drugs_box_container">
          {result.supps.map((supp, i) => {
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

  const analyzeResultContent = [result.interactions, result.duplicates, result.meds, result.supps];

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
          <FontAwesomeIcon icon={status_fontAwesome} size="3x" style={{ color: status_color }} />
          <h3 style={{ color: status_color }}>{status_label}</h3>
          <p>{status_message}</p>
        </div>

        {analyzeResultContent.map((content, i) => {
          if (content.length == 0) {
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

        {isOpen && <DrugInfo isOpen={isOpen} setIsOpen={setIsOpen} drugId={drugId} drugType={drugType} drugBox={{ drugBox }} />}

        <div className="analysis_sources">
          <p className="sources_disclaimer">본 분석 결과는 다음 공신력 있는 기관 및 데이터베이스를 기반으로 합니다. 자세한 내용은 각 사이트를 참조하십시오.</p>

          <div className="sources_list">
            {ANALYSIS_SOURCES.map((source, i) => (
              <div key={i} className="source_item">
                <h5 className="source_name">{source.name}</h5>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="source_link_button" title={source.title}>
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
