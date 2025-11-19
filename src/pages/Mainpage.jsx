import mainImage from "../images/main01.png";
import pill from "../images/pill.png";
import "../styles/Mainpage.css";

function Mainpage() {
  return (
    <>
      <main className="wrapper">
        <section className="main_contents">
          <div className="main_text">
            <h1 className="main_title">Medi.Check!</h1>
            <p className="sub_title">AI 분석을 통한 똑똑한 복약의 시작</p>
          </div>
        </section>
        <section className="intro">
          <div className="intro_img">
            <img src={pill} alt="" srcset="" />
          </div>
          <div className="intro_text">
            <p>
              Medi.Check는 AI분석을 통해 의약품, 영양제의 성분을 체크하여 <br />
              사용자들이 조금 더 쉽고 안전하게 복약 할 수 있도록 도와줍니다. <br />
              의약품 데이터 분석을 통해 약물의 오남용을 막고 <br />
              사용자가 궁금한 복약 정보를 간편하게 제공합니다.
            </p>
          </div>
        </section>
        <section className="info">
          <div className="info_section">
            <div className="info_contents info_left_sec1"></div>
            <div className="info_contents info_right_sec1">
              <div className="info_text_box">
                <h2>AI 조합 분석</h2>
                <p>약·영양제 조합의 상호작용 위험도를 AI가 실시간으로 분석합니다.</p>
              </div>
            </div>
          </div>

          <div className="info_section">
            <div className="info_contents info_left_sec2">
              <div className="info_text_box">
                <h2>루틴 관리</h2>
                <p>내가 먹는 의약품, 영양제들을 루틴에 등록해 관리합니다.</p>
              </div>
            </div>
            <div className="info_contents info_right_sec2"></div>
          </div>
          <div className="info_section">
            <div className="info_contents info_left_sec3"></div>
            <div className="info_contents info_right_sec3">
              <div className="info_text_box">
                <h2>스토어</h2>
                <p>영양제와 내가 먹는약을 분석해서 구매하세요.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="contact"></section>
      </main>
    </>
  );
}

export default Mainpage;
