import React from "react";
import Button from "../../components/ui/Button";
import { formatDateKorean } from '../../utils/dateFormatter';

const DrugList = ({ meds, supps, onEdit, onRemove }) => {

  const ListItemCard = ({ item, type }) => {
    
    return (
      <div className={`list-item ${type}`}>
        <div className="item-details">
          <div className="item-name">{item.drugName}</div>
          <div className="intem-seltime" style={{ fontSize: "0.75rem" , margin : "4px 0"}}>
            - 내가 설정한 하루 복용량 : {item.selectTime}</div>

           <div className="intem-seltime" style={{ fontSize: "0.65rem" , margin : "4px 0"}}>
            - 설정된 복용 기간 : {formatDateKorean(item.start_date)} ~ {formatDateKorean(item.end_date)}</div>         

          {/* 영양제 일때만 섭취 방법 표시 */} 
          {type === "supp" && item.method && (
            <div className="item-howto" style={{ fontSize: "0.70rem", color: "#555" }} >
            - 섭취 방법 : {item.method}
          </div> 
        )} 
  
          {item.note && <div className="item-note"  style={{ fontSize: "0.65rem", color: "#555" }}
          >- 메모: {item.note}</div>}

            <span className={`item-type-tag ${type}` }>
              {type === "med" ? "복용약" : "영양제"}
            </span>         
        </div>

        <div className="item-actions">
          <Button variant="text" className="action-btn delete" onClick={() => onRemove(item)}>🗑️ 삭제</Button>
          <Button variant="primary" className="action-btn" style={{backgroundColor: "#4a4a4a",  color: "#fff", border: "1px solid #4a4a4a" }} 
           onClick={() => onEdit(item)}>✍️ 수정</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="med-list-view">
      <h3 className="section-heading">💊 복용약 ({meds.length}개)</h3>
      <div className="med-list-container">
        {meds.length > 0 ? meds.map((med, i) => <ListItemCard key={i} item={med} type="med" />)
          : <p className="no-item-msg">등록된 복용약이 없습니다.</p>}
      </div>

      <hr className="list-divider" />

      <h3 className="section-heading">🌿 영양제 ({supps.length}개)</h3>
      <div className="med-list-container">
        {supps.length > 0 ? supps.map((supp, i) => <ListItemCard key={i} item={supp} type="supp" />)
          : <p className="no-item-msg">등록된 영양제가 없습니다.</p>}
      </div>
    </div>
  )
}

export default DrugList;
