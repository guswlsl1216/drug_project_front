import '../../styles/analyze/AnalyzeResultDisplay.css'
import '../../styles/utils/analysisStatus.css'
import ANALYSIS_STATUS_MAPPING from "../../utils/analysisStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import DrugInfo from './DrugInfo';

const AnalyzeResultDisplay = ({ result }) => {
  const { status_label, status_message, status_color, status_fontAwesome } = ANALYSIS_STATUS_MAPPING[result.status]

  const [isOpen, setIsOpen] = useState(false);
  const [drugId, setDrugId] = useState(null);
  const [drugType, setDrugType] = useState(null);

  return (
    <>
      <section className='analyze_result_content'>
        <div className='analyze_result_summary'>
          <FontAwesomeIcon icon={status_fontAwesome} size='3x' style={{color: status_color}} />
          <h3 style={{color: status_color}}>{status_label}</h3>
          <p>{status_message}</p>
        </div>

        <div className='analyze_result_warnings analyze_result_bg'>
          <h4>병용섭취 주의사항</h4>
          <p>※전문적인 판단이 아니므로 자세한 내용은 전문 의약사와 상담하세요.</p>
          {
            result.interactions.map((item, i) => {
              const { status_label, status_className } = ANALYSIS_STATUS_MAPPING[item.level]

              return (
                <div key={i} className='analyze_result_warning_item'>
                  <div className={`${status_className} warning_item_level`}>{status_label}</div>
                  <div className="warning_item_box_container">
                    <div className='warning_item_box'>
                      <p className="warning_item_name">{item.product1_name}</p>
                      <p className="warning_item_ingredient">
                        {item.ingredient1}
                      </p>
                    </div>
                    <div className='warning_item_box'>
                      <p className="warning_item_name">{item.product2_name}</p>
                      <p className="warning_item_ingredient">
                        {item.ingredient2}
                      </p>
                    </div>
                  </div>
                  <div className='warning_item_message'>{item.message}</div>
                </div>
              )
            })
          }
        </div>

        <div className='analyze_result_duplicates analyze_result_bg'>
          <h4>중복 성분</h4>
          <p>아래 성분들을 과다 섭취하지 않도록 주의하세요.</p>
          <div className="duplicate_ingredients_container">
          {
            result.duplicates.map((item, i) => {
              return (
                <p className='duplicate_ingredient' key={i}>{item}</p>
              )
            })
          }
          </div>
        </div>

        <div className='analyze_result_meds analyze_result_bg'>
          <h4>의약품 목록</h4>
          <div className="drugs_box_container">
          {
            result.meds.map((med, i) => {
              return (
                <div className='drugs_box' key={i}>
                  <p className='meds_box_image'>약이미지</p>
                  <p title={med.name} className='drugs_box_name ellipsis'>{med.name}</p>
                  <p className='show_details_icon'><FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => {
                    setIsOpen(true);
                    setDrugId(med.id);
                    setDrugType(0);
                  }} /></p>
                </div>
              )
            })
          }
          </div>

        </div>

        <div className='analyze_result_supps analyze_result_bg'>
          <h4>영양제 목록</h4>
          <div className="drugs_box_container">
          {
            result.supps.map((supp, i) => {
              return (
                <div className='drugs_box' key={i}>
                  <p title={supp.name} className='drugs_box_name ellipsis'>{supp.name}</p>
                  <p className='show_details_icon'><FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => {
                    setIsOpen(true);
                    setDrugId(supp.id);
                    setDrugType(1);
                  }} /></p>
                </div>
              )
            })
          }
          </div>
        </div>
        
        <DrugInfo
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          drugId={drugId}
          drugType={drugType}
        />
      </section>
    </>
  )
}

export default AnalyzeResultDisplay;