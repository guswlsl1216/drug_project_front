import React, { useState } from "react";

const SuppInput = ({ onDataSubmit = () => console.error("onDataSubmit 함수 누락!") }) => {
  const [formData, setFormData] = useState({
    name : '',
    dosageFrequency : '1일 1회',
    times : [], // 복용 시간 배열
    count : 1, // 1회 복용량
    note : '' //apah
  });

  const timeOptions = [
    '아침 식전', '아침 식후', '점심 식전', '점심 직후',
    '저녁 식전', '저녁 식후', '취침 전', '기타 시간'

  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
    ...prevData,
    [name] : value,
    }));

  };

  // 식전, 식후, 아침, 점심, 저녁 버튼을 위한 핸들러
  const handleTimeChange = (time) => {
    setFormData(prevData => {
      const newTimes = prevData.times.includes(time)
      ? prevData.times.filter(t => t !== time)
      : [...prevData.times, time];
      return { ...prevData, times: newTimes }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.name.trim() === '') {
      console.error('새로 등록할 영양제 이름을 입력해 주세요')
    }
      // 복용 방법 조합해주기 (한 줄로 뿌려줘야 하니까)
    const combinedDosage = `${formData.dosageFrequency}, 1회 ${formData.count}정/캡슐, 시간 : ${formData.times.join(', ') || '미정'}`;

    onDataSubmit({
      name : formData.name,
      dosage : combinedDosage,
      note : formData.note
    });

    // 그 다음 초기화
    setFormData({
      name : '',
      dosageFrequency : '1일 1회',
      times : [],
      count : 1,
      note : ''
  });

  }


  return (
  <>
  
    <div className="supp-input-view">
        <h3 className="content-title">🌿 영양제 등록</h3>
        <p className="info-text">
            영양제 복용 정보를 상세하게 기록하여 알림 설정 및 관리에 활용해보세요!
        </p>

        <form onSubmit={handleSubmit} className="input-form">
            <label htmlFor="supp-name" className="input-label">영양제 이름:</label>
            <input 
                type="text" 
                id="supp-name"
                name="name"
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                placeholder="예: 종합 비타민, 오메가3"
                required
            />

            {/* --- 복용 상세 옵션 그룹 --- */}
            <div className="status-box mt-5 p-5">
                <h4 className="section-heading-small">상세 복용 설정</h4>

                {/* 1. 하루 복용 횟수 */}
                <label className="input-label !mt-0">하루 복용 횟수</label>
                <div className="dosage-frequency-options">
                    {['1일 1회', '1일 2회', '1일 3회', '1일 4회 이상'].map(f => (
                        <label key={f} className={`dosage-option ${formData.dosageFrequency === f ? 'active' : ''}`}>
                            <input type="radio" 
                                name="dosageFrequency" 
                                value={f}
                                checked={formData.dosageFrequency === f} 
                                onChange={handleChange}
                                className="hidden-radio"
                            />
                            {f}
                        </label>
                    ))}
                </div>

                {/* 2. 복용 시간 선택 */}
                <label className="input-label">복용 시간 (중복 선택 가능)</label>
                <div className="time-options">
                    {timeOptions.map(time => (
                        <label key={time} 
                               className={`time-option ${formData.times.includes(time) ? 'active' : ''}`}>
                            <input type="checkbox" 
                                checked={formData.times.includes(time)} 
                                onChange={() => handleTimeChange(time)}
                                className="hidden-checkbox" 
                            />
                            {time}
                        </label>
                    ))}
                </div>

                {/* 3. 1회 복용량 */}
                <label className="input-label">1회 복용량 (정/캡슐)</label>
                <div className="count-input-group">
                    <input 
                        type="number" 
                        name="count"
                        value={formData.count} 
                        onChange={(e) => setFormData({...formData, count: Math.max(1, parseInt(e.target.value) || 1)})}
                        className="count-input-field" 
                        min="1"
                    /> 
                    <span className="unit-text">정/캡슐</span>
                </div>
            </div>

            <label htmlFor="supp-note" className="input-label">추가 메모 (선택 사항):</label>
            <textarea
                id="supp-note"
                name="note"
                className="input-field"
                value={formData.note}
                onChange={handleChange}
                placeholder="주의사항, 특이사항, 부작용 등을 입력하세요."
                rows="3"
            />
            
            <button type="submit" className="save-btn">
                영양제 등록 완료
            </button>
        </form>
    </div>
  
  

  </>
  
  )
}

export default SuppInput