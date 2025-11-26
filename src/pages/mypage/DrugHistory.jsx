import React, { useEffect, useState } from "react"
import requestHandler from "../../utils/requestHandler"
import { useUser } from "../../components/context/UserContext"; 
import "../../styles/DrugHistory.css";
import useLoginRedirect from "../../utils/useLoginRedirect";
import LoadingSpinner from "../../utils/LoadingSpinner";

const DrugHistory = ({ }) => {
  const { user } = useUser();
  const { requireLogin } = useLoginRedirect();
  const userId = user?.id;

  const [history, setHistory] = useState([])
  const [totalAchievement, setTotalAchievement] = useState(0);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    requireLogin(); 
    }, []);
  
  useEffect(() => {
  if (!userId) return; 

    requestHandler({
      method: "get",
      url: `/routine/getDrugHistory/${userId}`,
      setLoading,
      onSuccess: (res) => {
        if (res.ok) {
          setHistory(res.history || []);
          setTotalAchievement(res.total_achievement || 0);
        } else {
          alert(res.message || "히스토리 불러오기 실패");
        }
      },
      onError: (msg) => alert("히스토리 요청 실패: " + msg),
    });
  }, [userId]);

if (loading) {
  return (
    <div className="drug-history-container" >
      <LoadingSpinner label="히스토리 불러오는 중..." size={88} />
    </div>
  );
}
  
return (

  <div className="drug-history-container">
    <h2> 📘 약/영양제 복용 히스토리</h2> 
  <div className="total-achievement" >전체 달성률: {totalAchievement}%</div>
      <div className="history-cards">
        {history.length > 0 ? (
          history.map((item, idx) => (
            <div className="history-card" key={idx}>
              <div className="drug-name">{item.drug_name}</div>
              <div className="drug-period">{item.period}</div>
              <div className="drug-achievement">달성률: {item.achievement}%</div>
            </div>
          ))
        ) : (
          <div className="no-history">완료된 루틴이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default DrugHistory