import '../../styles/mypage/History.css';
import Button from "../../components/ui/Button";
import requestHandler from '../../utils/requestHandler';
import { useEffect, useState } from 'react';

const History = () => {
  const [historyList, setHistoryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 번호
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(3);  // 화면에서 보여줄 총 페이지 번호
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i+1); // 화면에서 보여줄 총 페이지 번호 수에 따른 배열

  const status_color = {
    '정상' : 'history_normal',
    '주의' : 'history_warning',
    '위험' : 'history_danger'
  }

  // test
  useEffect(() => {
    setHistoryList([
    {
      status: '주의',
      analysis_date: '2025.11.01',
      meds_ingredients: ['약1', '약2', '약3'],
      supps:[
        {
          "name": "홍삼정 에브리타임",
          "ingredients": ["진세노사이드", "나트륨", "카페인"]
        },
        {
          "name": "오메가3 프리미엄",
          "ingredients": ["EPA", "DHA", "비타민 E"]
        },
      ]
    },
    {
      status: '정상',
      analysis_date: '2025.10.26',
      meds_ingredients: ['약1', '약2', '약3'],
      supps:[
        {
          "name": "홍삼정 에브리타임",
          "ingredients": ["진세노사이드", "나트륨", "카페인"]
        },
        {
          "name": "오메가3 프리미엄",
          "ingredients": ["EPA", "DHA", "비타민 E"]
        },
      ]
    },
    {
      status: '주의',
      analysis_date: '2025.10.15',
      meds_ingredients: ['약1', '약2', '약3'],
      supps:[
        {
          "name": "홍삼정 에브리타임",
          "ingredients": ["진세노사이드", "나트륨", "카페인"]
        },
        {
          "name": "오메가3 프리미엄",
          "ingredients": ["EPA", "DHA", "비타민 E"]
        },
      ]
    },
    {
      status: '위험',
      analysis_date: '2025.10.08',
      meds_ingredients: ['약1', '약2', '약3'],
      supps:[
        {
          "name": "홍삼정 에브리타임",
          "ingredients": ["진세노사이드", "나트륨", "카페인"]
        },
        {
          "name": "오메가3 프리미엄",
          "ingredients": ["EPA", "DHA", "비타민 E"]
        },
      ]
    }
  ])
  }, [currentPage]);

  // useEffect(() => {
  //   requestHandler({
  //     method: "get",
  //     url: "/history",
  //     params: { page: currentPage, size: 10 },
  //     setLoading,
  //     onSuccess: (data) => setHistoryList(data),
  //     onError: (msg) => alert(msg),
  //   })
  // }, []);

  if(loading) return <p>불러오는 중...</p>

  
  function historyCard(history) {
    return (
      <article className="history_card">
        <div className="history_cardInfo">
          <div className={`history_cardInfo_logo ${status_color[history.status]}`}>
            <p>{history.status}</p>
          </div>
          <div className="history_cardInfo_content">
            <h3>{history.analysis_date}</h3>
            <p className='ellipsis'><span>[의약품]</span> {
              history.meds_ingredients.map(med => med).join(', ')
            }</p>
            <p className='ellipsis'><span>[건강기능식품]</span> {
              history.supps.map(
                // supp => `${supp.name}(${supp.ingredients.map(ing => ing).join(', ')})` => 성분까지 표시
                supp => supp.name
              ).join(', ')
            }</p>
          </div>
        </div>
        <div className="history_cardBtn">
          <Button variant="primary">상세보기</Button>
        </div>
      </article>
    )
  }
  
  return (
    <>
      <main>
        <section className="history_container">
          <div className="history_title">
            <h2>분석결과내역 페이지</h2>
          </div>

          <ul className="history_cardlist">
            {
              historyList.map((history, i) => {
                return (
                  <li key={i}>{historyCard(history)}</li>
                )
              })
            }
          </ul>

          <div className="history_pagination">
            <ul className="history_pagination_list">
              {}
              <li onClick={() => setCurrentPage(currentPage - 1)}>&lt;</li>
              {
                pageNumbers.map((page, i) => (
                  <li
                    key={i}
                    className={currentPage == page ? 'history_active' : '' }
                    onClick={() => setCurrentPage(page)}
                  >{page}</li>
                ))
              }
              <li onClick={() => setCurrentPage(currentPage + 1)}>&gt;</li>
            </ul>
          </div>
        </section>
      </main>
    </>
  )
}

export default History;