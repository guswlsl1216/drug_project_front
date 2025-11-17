import React from "react";

const DrugList = ({ meds, supps, onEdit, onRemove }) => {

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const ListItemCard = ({ item, type }) => {
    const now = getTodayDate();
    
    return (
      <div className={`list-item ${type}`}>
        <div className="item-details">
          <div className="item-name">{item.drugName}</div>
          <div className="item-howto">
            {item.method}
            <span className={`item-type-tag ${type}`}>
              {type === "med" ? "복용약" : "영양제"}
            </span>
          </div>
          {item.note && <div className="item-note">메모: {item.note}</div>}
          


        </div>

        <div className="item-actions">
          <button className="action-btn delete" onClick={() => onRemove(item)}>🗑️ 삭제</button>
          <button className="action-btn primary" onClick={() => onEdit(item)}>✍️ 수정</button>
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
