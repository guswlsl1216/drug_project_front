import '../../styles/mypage/History.css';
import Button from "../../components/ui/Button";

const History = () => {
  
  function historyCard() {
    return (
      <article className="history_card">
        <div className="history_cardInfo">
          <div className="history_cardInfo_logo">
            <p>주의</p>
          </div>
          <div className="history_cardInfo_content">
            <h3>2025.10.30</h3>
            <p>아스피린 ↔ 오메가3영양제이름</p>
          </div>
        </div>
        <div className="history_cardBtn">
          <Button variant="primary">상세보기</Button>
        </div>
      </article>
    )
  }

  // function historyCard() {
  //   return (
  //     <article className="history_card">
  //       <div className="history_cardInfo">
  //         <h3>2025.10.30</h3>
  //         <p>아스피린 | 오메가3영양제이름</p>
  //         <p>주의</p>
  //       </div>
  //       <div className="history_cardBtn">
  //         <Button variant="primary">상세보기</Button>
  //       </div>
  //     </article>
  //   )
  // }

  return (
    <>
      <main>
        <section className="history_container">
          <div className="history_title">
            <h2>분석결과내역 페이지</h2>
          </div>

          <ul className="history_cardlist">
            <li>{historyCard()}</li>
            <li>{historyCard()}</li>
            <li>{historyCard()}</li>
            <li>{historyCard()}</li>
          </ul>
        </section>
      </main>
    </>
  )
}

export default History;