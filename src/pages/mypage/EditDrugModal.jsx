import React, { useState, useEffect } from "react";
import "../../styles/MyDrugs.css";
import requestHandler from "../../utils/requestHandler";
import { useUser } from "../../components/context/UserContext";
import useLoginRedirect from "../../utils/useLoginRedirect";

const EditDrugModal = ({
  editing,
  form,
  setForm,
  setEditing,
  setSuccessMessage,
  loadDrugs,
}) => {
  const { requireLogin } = useLoginRedirect();
  const [loading, setLoading] = useState(false);

  if (!editing) return null; // ← 컴포넌트 함수 내부 OK

  useEffect(() => {
    requireLogin(() => {}, true);
  }, []);

  const timeOptions = ["아침", "점심", "저녁"];

  /** 복용 시간 toggle */
  const toggleTime = (index) => {
    setForm((prev) => {
      const newTimes = [...prev.eattime];
      newTimes[index] = !newTimes[index];
      return { ...prev, eattime: newTimes };
    });
  };

  /** input 변경 핸들러 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** 유효성 검사 */
  const validateForm = () => {
    if (!form.start_date || !form.end_date) {
      alert("시작일/종료일을 입력해 주세요.");
      return false;
    }
    return true;
  };

  /** 수정 저장 */
  const handleSave = async () => {
    if (!validateForm()) return;

    const res = await requestHandler({
      method: "put",
      url: `/routine/updateRoutine/${editing.id}`,
      payload: {
        eattime: form.eattime,
        start_date: form.start_date,
        end_date: form.end_date,
        note: form.note,
      },
      setLoading,
    });

    if (res.ok) {
      setSuccessMessage("수정 완료!");
      setEditing(null);
      loadDrugs();
    }
  };


  return (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3 className="content-title">📆 내 루틴 수정하기</h3>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* 복용 시간 */}
        <label className="input-label">복용 시간</label>
        <div className="time-options">
          {timeOptions.map((label, i) => (
            <label
              key={label}
              className={`time-option ${form.eattime[i] ? "active" : ""}`}
            >
              <input
                type="checkbox"
                checked={form.eattime[i]}
                onChange={() => toggleTime(i)}
                className="hidden-checkbox"
              />
              {label}
            </label>
          ))}
        </div>

        {/* 날짜 */}
        <div style={{ display: "flex", gap: 10, margin: "20px 0" }}>
          <div style={{ flex: 1 }}>
            <label className="input-label">시작일</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div style={{ flex: 1 }}>
            <label className="input-label">종료일</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        {/* 메모 */}
        <label className="input-label">메모</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          className="input-field"
          rows="3"
        />

        {/* 버튼 */}
        <div className="button-group">
          <button type="button" onClick={handleSave} disabled={loading}>
            저장
          </button>
          <button type="button" onClick={() => setEditing(null)}>
            취소
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default EditDrugModal;
