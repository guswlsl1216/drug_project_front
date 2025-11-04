import React from 'react';
//복용약 및 영양제 목록을 카드 형식으로 표시 (순수 목록 역할)
const DrugList = ({ meds, supps, onRemove }) => { 
    
    // 목록 아이템 컴포넌트 
    // 카드 형식으로 개별 약 또는 영양제 정보를 표시합
    const ListItemCard = ({ item, type }) => (
        <div className={`list-item ${type}`}>
            <div className="item-details">
                
                <div className="item-name">{item.name}</div>
                {/* 복용 방법 및 구분 (복용약/영양제) */}
                <div className="item-howto">
                    {item.dosage} 
                    <span className={`item-type-tag ${type}`}>
                        {type === 'med' ? '복용약' : '영양제'}
                    </span>
                </div>
                {/* 영양제에만 있는 추가 메모 (있을 경우만 표시) */}
                {type === 'supp' && item.note && (
                    <div className="item-note">
                        메모: {item.note}
                    </div>
                )}
            </div>
            {/* 관리/삭제 버튼 영역 */}
            <div className="item-actions">
                <button 
                    className="action-btn delete"
                    onClick={() => onRemove(item.id, type)} 
                >
                    <span role="img" aria-label="삭제">🗑️</span> 삭제
                </button>
                <button className="action-btn primary">
                    <span role="img" aria-label="수정">✍️</span> 수정
                </button>
            </div>
        </div>
    ); 
    
    return (
        <div className="med-list-view">
            
            {/* 1. 복용약 목록 영역 */}
            <h3 className="section-heading">💊 복용약 ({meds.length}개)</h3>
            
            <div className="med-list-container">
                {meds.length > 0 ? (
                    // meds 배열을 순회하며 ListItemCard를 생성
                    meds.map((med) => (
                        <ListItemCard key={med.id} type="med" />
                    ))
                ) : (
                    <p className="no-item-msg">현재 등록된 복용약이 없습니다. '복용약 등록' 탭에서 등록해주세요.</p>
                )}
            </div>

            <hr className="list-divider" />

            {/* 2. 영양제 목록 영역 */}
            <h3 className="section-heading">🌿 영양제 ({supps.length}개)</h3>
            
            <div className="med-list-container">
                {supps.length > 0 ? (
                    // supps 배열을 순회하며 ListItemCard를 생성
                    supps.map((supp) => (
                        <ListItemCard key={supp.id} item={supp} type="supp" />
                    ))
                ) : (
                    <p className="no-item-msg">현재 등록된 영양제가 없습니다. '영양제 등록' 탭에서 등록해주세요.</p>
                )}
            </div>
        </div>
    );
};

export default DrugList;