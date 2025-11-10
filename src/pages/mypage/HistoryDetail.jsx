import '../../styles/analyze/AnalyzeResult.css'
import { useEffect, useState } from "react";
import { replace, useLocation, useParams } from "react-router-dom";
import AnalyzeResultDisplay from "../../components/analyze/AnalyzeResultDisplay";
import Button from "../../components/ui/Button";
import loadingSpinner from '../../utils/loadingSpinner';
import requestHandler from '../../utils/requestHandler';
import UseNavi from '../../utils/UseNavi';

const HistoryDetail = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const { goTo } = UseNavi();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(state) {
      setResult(state.history)
    }
    else {
      requestHandler({
        method: "get",
        url: `/result/history/detail/${id}`,
        onSuccess: (data) => {
          setResult(data.result);
        },
        onError: (msg) => {
          alert(msg);
          goTo("/mypage/history", null, true);
        }
      })
    }
  }, [id, state])

  const deleteHistory = () => {
    if (confirm("분석 결과 내역을 삭제하시겠습니까?")) {
      requestHandler({
        method: "delete",
        url: `/result/history/detail/${id}`,
        setLoading,
        onSuccess: (data) => {
          alert(data.message);
          goTo("/mypage/history", null, true)
        },
        onError: (msg) => {
          alert(msg);
        }
      })
    } else {
      return;
    }
  }

  return (
    <>
      <div className='analyze_result_header'>
        <h1>분석 결과</h1>
        {result && <p>{result.analysis_date}</p>}
      </div>

      {
        result
        ?
        <AnalyzeResultDisplay result={result} />
        :
        loadingSpinner({size:70})
      }

      <div className='analyze_result_actions'>
        <Button variant='danger' onClick={deleteHistory} disabled={loading}>{loading ? "삭제 중..." : "결과 내역 삭제"}</Button>
        <Button variant='primary' onClick={() => goTo("/mypage/history")}>목록</Button>
      </div>
    </>
  )
}

export default HistoryDetail;