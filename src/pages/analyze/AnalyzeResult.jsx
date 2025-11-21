import '../../styles/analyze/AnalyzeResult.css'
import AnalyzeResultDisplay from '../../components/analyze/AnalyzeResultDisplay';
import Button from '../../components/ui/Button'
import requestHandler from '../../utils/requestHandler';
import { useEffect, useState } from 'react';
import useLoginRedirect from '../../utils/useLoginRedirect';
import UseNavi from '../../utils/UseNavi';

const AnalyzeResult = () => {
  const { goTo } = UseNavi();
  const { requireLogin } = useLoginRedirect();
  const [loading, setLoading] = useState(false);
  const [isSave, setIsSave] = useState(false);  // 결과 저장 여부
  const [croppedImages, setCroppedImages] = useState([]); // 크롭된 의약품 사진
  const [medImages, setMedImages] = useState([]); // 크롭된 의약품 사진의 파일명

  // 새로운 Blob을 배열에 추가하는 함수
  const addCroppedImages = (newBlob, newMed) => {
    setCroppedImages(prevImages => [...prevImages, newBlob]);
    setMedImages(prevMeds => [...prevMeds, newMed]);
  };
  
  const result = JSON.parse(sessionStorage.getItem("ANALYSIS_RESULT_DATA"));
  // console.log("세션에서 불러온 분석 결과:", result);
  
  const saveResult = () => {
    requireLogin(() => {
      if (sessionStorage.getItem('isSave') === result.analysis_uid) {
        alert('이미 저장되어 있습니다.');
        return;
      } else if (isSave) {
        alert('저장 중입니다. 잠시만 기다려주세요.');
        return;
      } else {
        const formData = new FormData();
        formData.append('result', result);
        croppedImages.forEach((imageBlob, index) => {
          const filename = medImages[index];
          formData.append('drug_images', imageBlob, filename);
        });

        for (let p of formData.entries()) {
          console.log(p);
        }

        requestHandler({
          method: "post",
          url: "/result/save",
          payload: formData,
          userImage: true,
          setLoading,
          onSuccess: (data) => {
            alert(data.message);
            setIsSave(data.isSave);
            // 결과 저장 성공 시, 해당 결과 고유 번호가 세션(isSave)에 저장됨
            // 세션에 저장된 isSave의 값이 현재 결과 고유 번호와 같으면 저장 버튼 비활성화
            // 만약 테스트를 위해 버튼 활성화가 필요한 경우 세션 삭제 바람
            sessionStorage.setItem('isSave', result.analysis_uid)
            console.log(data.images)
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

        <AnalyzeResultDisplay
          result={result}
          onCropComplete={addCroppedImages}
        />
      
        <div className='analyze_result_actions'>
          <Button variant='primary' onClick={saveResult} disabled={loading || isSave}>
            {
              loading ? '저장 중...' : (isSave ? '저장 완료' : '결과 내역에 저장')
            }
            </Button>
          <Button variant='primary' onClick={() => {
            requireLogin(() => goTo("/routine"))
          }}>복용 루틴 설정</Button>
        </div>
      </div>
    </>
  );
}

export default AnalyzeResult;