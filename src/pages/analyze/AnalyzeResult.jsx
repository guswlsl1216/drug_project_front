import '../../styles/analyze/AnalyzeResult.css'
import AnalyzeResultDisplay from '../../components/analyze/AnalyzeResultDisplay';
import Button from '../../components/ui/Button'
import requestHandler from '../../utils/requestHandler';
import { useEffect, useState } from 'react';
import useLoginRedirect from '../../utils/useLoginRedirect';

const AnalyzeResult = () => {
  const { requireLogin } = useLoginRedirect();
  const [loading, setLoading] = useState(false);
  const [isSave, setIsSave] = useState(false);  // 결과 저장 여부
  
  // 세션스토리지에서 불러오기
  const result = JSON.parse(sessionStorage.getItem('result'))
  
  const saveResult = () => {
    requireLogin(() => {
      if (sessionStorage.getItem('isSave') === result.analysis_uid) {
        alert('이미 저장되어 있습니다.');
        return;
      } else if (isSave) {
        alert('저장 중입니다. 잠시만 기다려주세요.');
        return;
      } else {
        requestHandler({
          method: "post",
          url: "/result/save",
          payload: result,
          setLoading,
          onSuccess: (data) => {
            alert(data.message);
            setIsSave(data.isSave);
            // 결과 저장 성공 시, 해당 결과 고유 번호가 세션(isSave)에 저장됨
            // 세션에 저장된 isSave의 값이 현재 결과 고유 번호와 같으면 저장 버튼 비활성화
            // 만약 테스트를 위해 버튼 활성화가 필요한 경우 세션 삭제 바람
            sessionStorage.setItem('isSave', result.analysis_uid)
          },
          onError: (msg) => {
            alert(msg);
            sessionStorage.removeItem('isSave');
          }
        })
      }
    });

  }

  useEffect(() => {
    if(sessionStorage.getItem('isSave') === result.analysis_uid) {
      setIsSave(true);
    }
  }, [])
  
  return (
    <>
      <div className="wrapper analyze_result">
        <div className='analyze_result_header'>
          <h1>분석 결과</h1>
        </div>

        <AnalyzeResultDisplay result={result} />
      
        <div className='analyze_result_actions'>
          <Button variant='primary' onClick={saveResult} disabled={loading || isSave}>
            {
              loading ? '저장 중...' : (isSave ? '저장 완료' : '마이페이지에 결과 저장')
            }
            </Button>
          <Button variant='primary' onClick={() => {
            requireLogin(() => alert("루틴 페이지로 이동"))
          }}>복용 루틴 설정</Button>
        </div>
      </div>
    </>
  );
}

export default AnalyzeResult;