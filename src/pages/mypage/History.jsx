import '../../styles/mypage/History.css';
import Button from "../../components/ui/Button";
import requestHandler from '../../utils/requestHandler';
import { useEffect, useState } from 'react';
import '../../styles/utils/analysisStatus.css';
import ANALYSIS_STATUS_MAPPING from '../../utils/analysisStatus';
import UseNavi from '../../utils/UseNavi';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from '../../utils/LoadingSpinner';
import useLoginRedirect from '../../utils/useLoginRedirect';

const History = () => {
  const { requireLogin } = useLoginRedirect();
  const [loading, setLoading] = useState(false);
  const [historyList, setHistoryList] = useState([]); // 분석 결과 목록

  const [has_prev, setHas_prev] = useState(false);  // 이전 페이지 유무
  const [has_next, setHas_next] = useState(false);  // 다음 페이지 유무
  const [pageNumbers, setPageNumbers] = useState(null); // 페이지 버튼에 보여줄 번호 리스트

  const { goTo } = UseNavi();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get('page'), 10);
  // page=NaN 혹은 page=-1 등의 잘못된 값 처리 -> page=1로 변환
  const safeInitialPage = (isNaN(initialPage) || initialPage < 1) ? 1 : initialPage;

  const [currentPage, setCurrentPage] = useState(safeInitialPage);  // 현재 페이지 번호
  
  useEffect(() => {
    requireLogin(() => {
      requestHandler({
        method: "get",
        url: "/result/history",
        params: { page: currentPage },
        setLoading,
        onSuccess: (data) => {
          if(data.history.length === 0 && currentPage !== 1) {
            setCurrentPage(1);
            goTo("/mypage/history", null, true);
            return;
          }
          setHistoryList(data.history);
          setHas_prev(data.has_prev);
          setHas_next(data.has_next);
          setPageNumbers(data.pageNumbers);
        },
        onError: (msg) => alert(msg),
      })
    }, true)
  }, [currentPage, location]);
  
  const historyCard = (history) => {
    const { status_label, status_className } = ANALYSIS_STATUS_MAPPING[history.status]
    const fullDateTime = history.analysis_date;
    const dateOnlySlice = fullDateTime.slice(0, 10);
    
    return (
      <article className="history_card">
        <div className="history_cardInfo">
          <div className={`history_cardInfo_logo ${status_className}`}>
            <p>{status_label}</p>
          </div>
          <div className="history_cardInfo_content">
            <h3>{dateOnlySlice}</h3>
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
            goTo(`/mypage/history/detail/${history.id}`, {history: history} )
          }}>상세보기</Button>
        </div>
      </article>
    )
  }
  
  return (
    <>
      <main>
        <section className="history_container">
          <div className="history_title">
            <h2>분석 결과 내역</h2>
          </div>

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
              <ul className="history_cardlist">
                {
                  historyList.map((history, i) => {

                    return (
                      <li key={i}>{historyCard(history)}</li>
                    )
                  })
                }
              </ul>
            }

            <div className="history_pagination">
              <ul className="history_pagination_list">
                {
                  has_prev &&
                  <li className='history_pagination_prev' onClick={() => {
                    setCurrentPage(currentPage - 1)
                    goTo(`/mypage/history?page=${currentPage - 1}`)
                  }}>&lt;</li>
                }
                {
                  pageNumbers &&
                  pageNumbers.map((page, i) => {
                    if(page) {
                      return (
                        <li
                        key={i}
                        className={currentPage == page ? 'history_active' : '' }
                        onClick={() => {
                          setCurrentPage(page)
                          goTo(`/mypage/history?page=${page}`)
                        }}
                        >{page}</li>
                      )
                    } else {
                      return <p key={i}>...</p>
                    }
                  })
                }
                {
                  has_next &&
                  <li className='history_pagination_next' onClick={() => {
                    setCurrentPage(currentPage + 1)
                    goTo(`/mypage/history?page=${currentPage + 1}`)
                  }}>&gt;</li>
                }
              </ul>
            </div>
            </>
          }

        </section>
      </main>
    </>
  )
}

export default History;