import '../../styles/analyze/AnalyzeResult.css'
import AnalyzeResultDisplay from '../../components/analyze/AnalyzeResultDisplay';
import Button from '../../components/ui/Button'
import requestHandler from '../../utils/requestHandler';
import { useState } from 'react';

const AnalyzeResult = () => {
  // 아래 임시 코드들은 분석 기능 구현 완료 후 제거 예정
  // 결과 데이터(임시)
  const result_test = {
    "status": 2,
    "meds": [
      {
        "id": 158,
        "name": "로그펜정400밀리그람(이부프로펜)(수출용)",
        "ingredients": "이부프로펜",
      },
      {
        "id": 1330,
        "name": "제클라정(클래리트로마이신)",
        "ingredients": "클래리트로마이신"
      },
      {
        "id": 4865,
        "name": "심바로드정20밀리그램(심바스타틴)",
        "ingredients": "심바스타틴"
      },
    ],
    "supps": [
      {
        "id": 100850,
        "name": "베지 오메가-3",
        "ingredients": ["EPA 및 DHA 함유 유지 (오메가-3)"]
      },
      {
        "id": 100963,
        "name": "눈촉촉 오메가3 오리지널",
        "ingredients": ["EPA 및 DHA 함유 유지 (오메가-3)"]
      },
    ],
    "duplicates": [
        {
          "ingredient": "EPA 및 DHA 함유 유지 (오메가-3)",
          "names": ["베지 오메가-3", "눈촉촉 오메가3 오리지널"]
        },
        {
          "ingredient": "EPA 및 DHA 함유 유지 (오메가-3)",
          "names": ["베지 오메가-3", "눈촉촉 오메가3 오리지널"]
        },
      ],
    "interactions": [ 
      {
        "product1_name": "로그펜정400밀리그람(이부프로펜)(수출용)",
        "ingredient1": "이부프로펜",
        "product2_name": "베지 오메가-3",
        "ingredient2": "EPA 및 DHA 함유 유지 (오메가-3)",
        "level": 1,
        "message": "출혈의 위험을 증가시킬 수 있어요!"
      },
      {
        "product1_name": "제클라정(클래리트로마이신)",
        "ingredient1": "클래리트로마이신",
        "product2_name": "심바로드정20밀리그램(심바스타틴)",
        "ingredient2": "심바스타틴",
        "level": 2,
        "message": "근병증, 횡문근융해의 위험증가"
      },
    ]
  }
  // 세션스토리지에 저장(임시)
  sessionStorage.setItem('result', JSON.stringify(result_test))

  const [loading, setLoading] = useState(false);
  
  
  // 세션스토리지에서 불러오기
  const result = JSON.parse(sessionStorage.getItem('result'))
  
  const saveResult = () => {
    requestHandler({
      method: "post",
      url: "/result/save",
      payload: result,
      setLoading,
      onSuccess: (data) => {
        alert(data.message);
      },
      onError: (msg) => {
        alert(msg);
      }
    })
  }
  
  return (
    <>
      <div className="wrapper analyze_result">
        <div className='analyze_result_header'>
          <h1>분석 결과</h1>
        </div>

        <AnalyzeResultDisplay result={result} />

        <div className='analyze_result_actions'>
          <Button variant='primary' onClick={saveResult} disabled={loading}>{loading ? '저장 중...' : '결과 저장'}</Button>
          <Button variant='primary' onClick={() => alert('루틴 페이지 이동')}>복용 루틴 설정</Button>
        </div>
      </div>
    </>
  );
}

export default AnalyzeResult;