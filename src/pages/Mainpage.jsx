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
            <p className="sub_title">AI가 알려주는 약 복용정보</p>
          </div>
        </section>
        <section className="intro">
          <div className="intro_img">
            <img src={pill} alt="" srcset="" />
          </div>
          <div className="intro_text">
            <p>
              우리는 영양제 선택을 복잡하지 않고, 안전하며, 무엇보다 당신에게 효과적이도록 만듭니다. <br />
              그래서 당신은 건강 걱정을 덜고, 삶의 더 즐겁고 멋진 일들에 집중할 수 있도록 합니다.
            </p>
          </div>
        </section>
        <section className="info">
          <div className="info_section">
            <div className="info_contents info_left_sec1">이미지</div>
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
                <h2>AI 조합 분석</h2>
                <p>약·영양제 조합의 상호작용 위험도를 AI가 실시간으로 분석합니다.</p>
              </div>
            </div>
            <div className="info_contents info_right_sec2">이미지</div>
          </div>
          <div className="info_section">
            <div className="info_contents info_left_sec3">이미지</div>
            <div className="info_contents info_right_sec3">
              <div className="info_text_box">
                <h2>AI 조합 분석</h2>
                <p>약·영양제 조합의 상호작용 위험도를 AI가 실시간으로 분석합니다.</p>
              </div>
            </div>
          </div>
          <div className="info_section">
            <div className="info_contents info_left_sec4">
              <div className="info_text_box">
                <h2>AI 조합 분석</h2>
                <p>약·영양제 조합의 상호작용 위험도를 AI가 실시간으로 분석합니다.</p>
              </div>
            </div>
            <div className="info_contents info_right_sec4">이미지</div>
          </div>
          <div className="info_section">
            <div className="info_contents info_left_sec5">이미지</div>
            <div className="info_contents info_right_sec5">
              <div className="info_text_box">
                <h2>AI 조합 분석</h2>
                <p>약·영양제 조합의 상호작용 위험도를 AI가 실시간으로 분석합니다.</p>
              </div>
            </div>
          </div>
          <div className="info_section">
            <div className="info_contents info_left_sec6">
              <div className="info_text_box">
                <h2>AI 조합 분석</h2>
                <p>약·영양제 조합의 상호작용 위험도를 AI가 실시간으로 분석합니다.</p>
              </div>
            </div>
            <div className="info_contents info_right_sec6">이미지</div>
          </div>
        </section>
        <section className="contact"></section>
      </main>
    </>
  );
}

export default Mainpage;
