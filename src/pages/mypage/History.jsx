import '../../styles/mypage/History.css';
import Button from "../../components/ui/Button";
import requestHandler from '../../utils/requestHandler';
import { useEffect, useState } from 'react';
import '../../styles/utils/analysisStatus.css';
import ANALYSIS_STATUS_MAPPING from '../../utils/analysisStatus';
import UseNavi from '../../utils/UseNavi';
import LoadingSpinner from '../../utils/LoadingSpinner';
import useLoginRedirect from '../../utils/useLoginRedirect';
import '../../styles/analyze.css'
import Pagination from '../../components/ui/Pagination';
import time from '../../utils/time';

const History = () => {
  const { goTo } = UseNavi();
  const { requireLogin } = useLoginRedirect();
  const [loading, setLoading] = useState(false);
  const [historyList, setHistoryList] = useState([]); // 분석 결과 목록

  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(5)
  
  useEffect(() => {
    requireLogin(() => {
      requestHandler({
        method: "get",
        url: "/result/history",
        params: { page: page, per_page: perPage },
        setLoading,
        onSuccess: (data) => {
          if(data.history.length === 0 && page !== 1) {
            setHistoryList([]);
            setTotal(0);
            setPages(1);
            goTo("/mypage/history", null, true);
            return;
          }
          setHistoryList(data.history);
          setTotal(typeof data.total === "number" ? data.total : 0);
          setPages(typeof data.pages === "number" ? data.pages : 1);
          setPerPage(typeof data.per_page === "number" ? data.per_page : 10);
        },
        onError: (msg) => {
          alert(msg);
          setHistoryList([]);
          setTotal(0);
          setPages(1);
        },
      })
    }, true)
  }, [page, perPage]);
  
  const historyCard = (history) => {
    const { status_label, status_className } = ANALYSIS_STATUS_MAPPING[history.status]
    const fullDateTime = history.analysis_date;
    
    return (
      <article className="history_card">
        <div className="history_cardInfo">
          <div className={`history_cardInfo_logo ${status_className}`}>
            <p>{status_label}</p>
          </div>
          <div className="history_cardInfo_content">
            <h3>{time(fullDateTime)}</h3>
            <p className='ellipsis'><span>[의약품]</span> {
              history.meds.map(med => med.name).join(', ')
            }</p>
            <p className='ellipsis'><span>[영양제]</span> {
              history.supps.map(supp => supp.name).join(', ')
            }</p>
          </div>
        </div>
        <div className="history_cardBtn">
          <Button variant="primary" onClick={() => {
            goTo(`/history/detail/${history.id}`, {history: history} )
          }}>상세보기</Button>
        </div>
      </article>
    )
  }
  
  return (
    <>
      <main className="wrapper">
        <section className="main_bg">
          <div className="bg_text">
            <h1 className="bg_main_title">분석 결과 내역</h1>
          </div>
        </section>
        <section className="history_container analyze-tab-content">
          {
            loading
            ?
            LoadingSpinner({size:70})
            :
            <>
            {
              historyList.length == 0
              ?
              <div className='no_history'>
                <div className="no_history_title">
                  <h3>아직 분석 결과가 없어요...</h3>
                </div>
                <div className="no_history_description">
                  <p>지금 복용 중인 영양제와 약을 입력하고,</p>
                  <p>성분 간의 상호작용 위험을 확인해 보세요!</p>
                </div>
                <Button variant='primary' onClick={() => goTo("/analyze/medicine")}>분석하러 가기</Button>
              </div>
              :
              <>
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
                <Pagination
                  page={page}
                  pages={pages}
                  loading={loading}
                  onChange={(num) => setPage(num)}
                />
              </div>
              </>
            }

            </>
          }

        </section>
      </main>
    </>
  )
}

export default History;