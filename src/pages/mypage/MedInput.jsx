import React, { useEffect, useState } from "react";
import "../../styles/MyDrugs.css";
import requestHandler from "../../utils/requestHandler";
import UseNavi from "../../utils/UseNavi";
import { useUser } from "../../components/context/UserContext"; 
import useLoginRedirect from "../../utils/useLoginRedirect";  


const MedInput = ( {setActiveTab, loadDrugs }) => {
  const { isLoggedIn } = useUser();         // ✅ 로그인 상태 확인
  const { requireLogin } = useLoginRedirect(); 

  const [titleInput, settitleInput] = useState("");
  const [loading, setLoading] = useState(false);
  const {goTo} = UseNavi();

  useEffect(() => {
    requireLogin(() => {
    console.log("✅ 로그인 상태 확인됨");
    }, true); // replace = true → 뒤로가기 방지
  }, []);

  const [formData, setFormData] = useState({
       
      name : "",
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


  // input 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 약 이름 입력
  const handleTitleChange = (e) => {
    settitleInput(e.target.value);
    setFormData((prev) => ({
      ...prev,
      name : e.target.value
    }));
  };

  // 폼 유효성 검사
  const validateForm = () => {
    if (!formData.name) {
      alert("복용하시는 약을 입력해 주세요.")
      return false;
    }
    if (!formData.start_date || !formData.end_date)
      alert("복용 시작일과 종료일을 모두 입력해주세요.")
    return true;
  }

 const saveDrugs = async () => {
    if (!validateForm()) return false;

    const drugData = {
      
      name : formData.name,
      eattime : formData.eattime,
      start_date : formData.start_date,
      end_date : formData.end_date,
      note : formData.note
    }

    const res = await requestHandler({
      method : "post",
      url : "/routine/addRoutine",
      payload : drugData,
      setLoading,
      onError : (msg) => alert("저장실패 : " + msg),
    });

    return res.ok;
  }

    // 저장 후 목록 보기
  const handleSave = async () => {
    const success = await saveDrugs();
    if (success) {
      alert("✅ 저장 완료! 목록으로 이동합니다.")
      resetForm();
      setActiveTab('list')
      loadDrugs()
    }
  }

  // 폼 초기화 
  const resetForm = () => {
    setFormData({
      name : "",
      eattime : [false, false, false],
      note : "",
      start_date : "",
      end_date : ""
    })
  }
  

  return (
  <>
  
    <div className="supp-input-view">
        <h3 className="content-title">💊 복용약 등록</h3>
        <p className="info-text">
            복용약을 상세 설정하여 알림 설정 및 관리에 활용해보세요!
        </p>

        <form className="input-form" onSubmit={(e) => e.preventDefault()}>
             
            <label htmlFor="supp-name" className="input-label"> 복용하시는 약의 타이틀을 입력해주세요</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
                type="text" 
                id="med-title"
                className="input-field"
                style={{ marginBottom: 0, flex:1 }}
                value={titleInput}
                onChange={handleTitleChange}              
                placeholder="예: 감기약, 탈모약"
                required
                
            />
            </div>

            {/* --- 복용 상세 옵션 그룹 --- */}
            <div className="status-box mt-5 p-5">
                <h4 className="section-heading-small">복용약 상세 설정</h4>

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

                <div className="button-group">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="action-btn"
                    disabled={loading} 
                  >
                  저장하기</button>
                </div>
            </div>
        </form>
    </div>
  
  

  </>
  
  )
}

export default MedInput
