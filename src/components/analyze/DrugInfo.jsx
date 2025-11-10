import { useEffect, useState } from "react";
import requestHandler from "../../utils/requestHandler";
import "../../styles/analyze/DrugInfo.css"
import LoadingSpinner from "../../utils/LoadingSpinner";

const DrugInfo = ({ isOpen, setIsOpen, drugId, drugType  }) => {
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
        <p>{drugData.additive_name.map((data, i) => {
          return (
            <span key={i}>{`${data}${i < drugData.additive_name.length-1 ? ', ' : ''}`}</span>
          )
        })}</p>
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
    )
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
    {
      isOpen &&
      <div className="drug_info_popup" onClick={closePopup}>
        <section className="drug_info_content" onClick={(e) => e.stopPropagation()}>
        {loading  || !drugData
          ? LoadingSpinner({label:"약 정보 불러오는 중..."})
          :
          <>
          <div className="drug_info_header">
            <p className="drug_info_close_btn" onClick={closePopup}>×</p>
            <h2>약 상세</h2>
          </div>

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

          {
            drugType == 0
            ?
            medData()
            :
            suppData()
          }

          </>
          }
        </section>
      </div>
    }
    </>
  )
}

export default DrugInfo;