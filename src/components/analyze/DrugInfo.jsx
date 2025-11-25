import { useEffect, useState } from "react";
import requestHandler from "../../utils/requestHandler";
import "../../styles/analyze/DrugInfo.css"
import LoadingSpinner from "../../utils/LoadingSpinner";
import {useRef} from "react";
import { useLocation } from "react-router-dom";

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

const DrugImageCropper = ({box, result}) => {
  const canvasRef = useRef(null);
  const originalImageUrl = loadImageUrl(result); // 세션에서 원본 URL 로드

  const coordinates = Array.isArray(box)
    ? box
    : box && Array.isArray(box.drugBox)
    ? box.drugBox
    : null;

  console.log("DrugImageCropper - 최종 coordinates:", coordinates);
  
  useEffect(() => {
    if (!originalImageUrl || !coordinates || coordinates.length !== 4) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = originalImageUrl;

    img.onload = () => {
      const [x_min, y_min, x_max, y_max] = coordinates;
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
  }, [originalImageUrl, coordinates]); // 원본 URL이나 좌표가 바뀌면 다시 그림

  // 원본 URL이 없거나 좌표가 이상하면 대체 UI를 표시
  if (!originalImageUrl || !coordinates || coordinates.length !== 4) {
    return '';  // 이미지 분석으로 등록하지 않은 의약품 대응
  }

  return <canvas ref={canvasRef} className="meds_box_image" />;
};

const DrugInfo = ({ isOpen, setIsOpen, drugId, drugType, drugBox, result  }) => {
  const [drugData, setDrugData] = useState(null);
  const [loading, setLoading] = useState(false);

  const closePopup = () => {
    setIsOpen(false);
    setDrugData(null);
  }

  useEffect(() => {
    if(!isOpen) {
      setDrugData(null);
      return;
    }

    if(drugId != null) {
      requestHandler({
        method: "get",
        url: `/result/info/${drugId}`,
        params: { type: drugType },
        setLoading,
        onSuccess: (data) => {
          setDrugData(data.info_data);
        },
        onError: (msg) => {
          alert(msg);
        }
      })
    }
  }, [isOpen, drugId, drugType])

  useEffect(() => {
    const body = document.body;

    if(isOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto'
    }

    return () => {
      body.style.overflow = 'auto'
    }
  }, [isOpen]);

  const medData = () => {
    return (
      <>
        <div className="drugInfo_box">
          <h3>유효성분</h3>
          <p>{drugData.main_ingredient}</p>
        </div>
        <div className="drugInfo_box">
          <h3>첨가제</h3>
          <p>
            {drugData.additive_name.map((data, i) => {
              return (
                <span key={i}>{`${data}${i < drugData.additive_name.length - 1 ? ", " : ""}`}</span>
              );
            })}
          </p>
        </div>
        <div className="drugInfo_box">
          <h3>저장방법</h3>
          <p>{drugData.storage_method}</p>
        </div>
        <div className="drugInfo_box">
          <h3>용법용량</h3>
          <p className="drugInfo_box_msg">*다운로드 클릭 시 PDF 파일이 다운로드 됩니다.</p>
          <a href={drugData.intake_method_doc}>용법용량 문서 다운로드</a>
        </div>
        <div className="drugInfo_box">
          <h3>효능효과</h3>
          <p className="drugInfo_box_msg">*다운로드 클릭 시 PDF 파일이 다운로드 됩니다.</p>
          <a href={drugData.effect_doc}>효능효과 문서 다운로드</a>
        </div>
        <div className="drugInfo_box">
          <h3>주의사항</h3>
          <p className="drugInfo_box_msg">*다운로드 클릭 시 PDF 파일이 다운로드 됩니다.</p>
          <a href={drugData.caution_doc}>주의사항 문서 다운로드</a>
        </div>
      </>
    );
  }

  const suppData = () => {
    return (
      <>
      <div className="drugInfo_box">
        <h3>원재료</h3>
        <p>{drugData.ingredient}</p>
      </div>
      <div className="drugInfo_box">
        <h3>섭취 방법</h3>
        <p>{drugData.intake_method_doc}</p>
      </div>
      <div className="drugInfo_box">
        <h3>주된 기능성</h3>
        <p>{drugData.effect_doc}</p>
      </div>
      <div className="drugInfo_box">
        <h3>섭취 시 주의사항</h3>
        <p>{drugData.caution_doc}</p>
      </div>
      </>
    )
  }
  
  return (
    <>
      {isOpen && (
        <div className="drug_info_popup" onClick={closePopup}>
          <section className="drug_info_content" onClick={(e) => e.stopPropagation()}>
            {loading || !drugData ? (
              LoadingSpinner({label: "약 정보 불러오는 중..."})
            ) : (
              <>
                <div className="drug_info_header">
                  <p className="drug_info_close_btn" onClick={closePopup}>
                    ×
                  </p>
                  <h2>약 상세</h2>
                </div>
                {drugType == 0 && (
                  <div className="drugInfo_image_container">
                    {" "}
                    {/* 이미지를 담을 컨테이너 추가 */}
                    <DrugImageCropper
                      box={drugBox}
                      result={result}
                    />
                  </div>
                )}
                <div className="drugInfo_box">
                  <h3>제품명</h3>
                  <p>{drugData.product_name}</p>
                </div>

                <div className="drugInfo_box">
                  <h3>제조/판매사</h3>
                  <p>{drugData.manufacturer}</p>
                </div>

                <div className="drugInfo_box">
                  <h3>유효기간/소비기한</h3>
                  <p>{drugData.expiry_info}</p>
                </div>

                <div className="drugInfo_box">
                  <h3>성상/형태</h3>
                  <p>{drugData.appearance}</p>
                </div>

                {drugType == 0 ? medData() : suppData()}
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}

export default DrugInfo;