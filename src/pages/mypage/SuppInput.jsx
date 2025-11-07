import React, { useEffect, useState } from "react";
import SearchModal from "../../components/ui/SearchModal";
import "../../styles/MyDrugs.css";
import requestHandler from "../../utils/requestHandler";
import UseNavi from "../../utils/UseNavi";


const SuppInput = ( {setActiveTab }) => {

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSeachTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const {goTo} = UseNavi();

  const [userid, setUserId] = useState(null);
 
  useEffect( () => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser){
      try {
        const parsed_user = JSON.parse(storedUser);
        setUserId(parsed_user);
      } catch (e) {
        console.error("유저 정보 파싱 실패", e)
      }
    }

  }, [])


  const [formData, setFormData] = useState({
      author_id : 1, // 나중에 수정해야함 ( 로그인 기능 구현되면 )
      drug_id : "",
      eattime : [false, false, false],
      note : "",
      start_date : "",
      end_date : ""
  });

  const timeOptions = [
    '아침', '점심', '저녁' ];

  

  // 아침, 점심, 저녁 버튼 고정 핸들러 (false, false, false)
  const handleTimeChange = (index) => {
    setFormData((prev) => {
      const updated = [...prev.eattime];
      updated[index] = !updated[index];
      return { ...prev, eattime : updated}
    })
  }

  // 검색어 입력 핸들러   
  const handleSearchInputChange = (e) => {
  setSearchInput(e.target.value);
  };


  // 검색 버튼 클릭
  const handleSearchClick = () => {
    if (!searchInput.trim()) {
      alert("검색어를 입력해 주세요")
      return;
    }
    setSeachTerm(searchInput.trim())
    setSearchModalOpen(true)
  }

  // 모달에서 영양제 선택 반영
  const handleSelectSupps = (selectedItem) => {
    setFormData(prev=> ({
      ...prev,
      drug_id : selectedItem.id,
      name : selectedItem.name
    }))
    setSearchInput(selectedItem || "");
    setSearchModalOpen(false)
  } 
  // input 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 유효성 검사
  const validateForm = () => {
    if (!formData.drug_id) {
      alert("영양제를 검색 후 선택해 주세요.")
      return false;
    }
    if (!formData.start_date || !formData.end_date)
      alert("복용 시작일과 종료일을 모두 입력해주세요.")
    return true;
  }

  // 폼 초기화 
  const resetForm = () => {
    setFormData({
      author_id : 1, // 나중에 수정해야함 ( 로그인 기능 구현되면 )
      drug_id : "",
      eattime : [false, false, false],
      note : "",
      start_date : "",
      end_date : "",
      name : ""
    })
    setSearchInput("");
  }

  // 저장 요청 공통 저장 ( 두 버튼이 공유 )
  const saveSupps = async () => {
    if (!validateForm()) return false;

    const supplementData = {
      author_id : 1,
      drug_id : formData.drug_id,
      eattime : formData.eattime,
      start_date : formData.start_date,
      end_date : formData.end_date,
      note : formData.note
    }

    const res = await requestHandler({
      method : "post",
      url : "/routine/addRoutine",
      payload : supplementData,
      setLoading,
      onError : (msg) => alert("저장실패 : " + msg),
    });

    return res.ok;
  }

  const handleSaveAndContinue = async () => {
    const success = await saveSupps();
    if (success) {
      alert("✅ 저장 완료! 계속 입력할 수 있습니다.")
      resetForm();
    }
  }
  // 저장 후 목록 보기
  const handleSaveandView = async () => {
    const success = await saveSupps();
    if (success) {
      alert("✅ 저장 완료! 목록으로 이동합니다.")
      setActiveTab('list')
    }
  }

  return (
  <>
  
    <div className="supp-input-view">
        <h3 className="content-title">🌿 영양제 등록</h3>
        <p className="info-text">
            영양제 복용 정보를 상세하게 기록하여 알림 설정 및 관리에 활용해보세요!
        </p>

        <form className="input-form" onSubmit={(e) => e.preventDefault()}>
             {/* 영양제 검색 버튼 */}
            <label htmlFor="supp-name" className="input-label">영양제 검색:</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
                type="text" 
                id="supp-search"
                className="input-field"
                style={{ marginBottom: 0, flex:1 }}
                value={formData.name}
                onChange={handleSearchInputChange}              
                placeholder="예: 종합 비타민, 오메가3"
                required
                
            />
            <button 
              type="button"
              onClick={handleSearchClick}
              className="action-btn primary"
              disabled={loading}
              style={{
                whiteSpace: 'rowrap',
                padding : '10px 20px',
                height : 'fit-content'
              }}
            >   🔍 검색 </button>
            </div>

            {/* --- 복용 상세 옵션 그룹 --- */}
            <div className="status-box mt-5 p-5">
                <h4 className="section-heading-small">영양제 상세 설정</h4>

                {/* 2. 복용 시간 선택 */}
                <label className="input-label">복용 시간 (중복 선택 가능)</label>
                <div className="time-options">
                    {timeOptions.map((label, index)=> (
                        <label key={label} 
                               className={`time-option ${formData.eattime[index] ? "active" : ""}`}>
                            <input type="checkbox" 
                                checked={formData.eattime[index]} 
                                onChange={() => handleTimeChange(index)}
                                className="hidden-checkbox" 
                            />
                            {label}
                        </label>               
                    ))}
                </div>

                <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
                  <div style={{ flex: 1 }}>
                    <label className="input-label">시작일</label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="input-label">종료일</label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <label htmlFor="supp-note" className="input-label">추가 메모 (선택 사항):</label>
                <textarea
                  id="supp-note"
                  name="note"
                  className="input-field"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="주의사항, 특이사항을 입력하세요."
                  rows="3"
                />
              <SearchModal
                  isOpen={searchModalOpen  }
                  onClose={() => setSearchModalOpen(false)}
                  searchTerm={searchTerm}
                  onSelect={handleSelectSupps}
                  apiEndpoint="/routine/search"
                  type='supps'
                />
                <div className="button-group">
                  <button
                    type="button"
                    onClick={handleSaveAndContinue}
                    className="action-btn"
                    disabled={loading} 
                  >
                  저장하고 계속 입력하기</button>
                
                  <button
                    type="button"
                    onClick={handleSaveandView}
                    className="action-btn"
                    disabled={loading} 
                  >
                  저장하고 목록 보기</button>
                </div>
            </div>
        </form>
    </div>
  
  

  </>
  
  )
}

export default SuppInput