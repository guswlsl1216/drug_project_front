import { useEffect } from "react";
import mainImage from "../images/main01.png";
import pill from "../images/pill.png";
import "../styles/Mainpage.css";

function Mainpage() {
  useEffect(() => {
    document.title = 'Medi.Check! | 홈 화면';
  }, [])
  
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
            <div className="info_contents info_left_sec1"></div>
            <div className="info_contents info_right_sec1">
              <div className="info_text_box">
                <a href="/analyze/medicine" className="info_button_link">
                  <h2>AI 조합 분석</h2>
                </a>
                <p>약·영양제 조합의 상호작용 위험도를 AI가 실시간으로 분석합니다.</p>
              </div>
            </div>
          </div>

          <div className="info_section">
            <div className="info_contents info_left_sec2">
              <div className="info_text_box">
                <a href="/history" className="info_button_link">
                  <h2>나의 분석 결과</h2>
                </a>
                <p>이전에 진행했던 약/영양제 조합 분석 결과들을 날짜별로 저장하고, 필요할 때마다 다시 확인하여 안전하고 현명한 선택에 활용하세요.</p>
              </div>
            </div>
            <div className="info_contents info_right_sec2"></div>
          </div>
          <div className="info_section">
            <div className="info_contents info_left_sec3"></div>
            <div className="info_contents info_right_sec3">
              <div className="info_text_box">
                <a href="/routine" className="info_button_link">
                  <h2>루틴 관리</h2>
                </a>
                <p>현재 섭취 중인 약과 영양제 목록을 한눈에 확인하고, 복용 시간을 간편하게 기록하여 빠짐없이 건강을 챙길 수 있습니다.</p>
              </div>
            </div>
          </div>

          <div className="info_section">
            <div className="info_contents info_left_sec4">
              <div className="info_text_box">
                <a href="/store/allgoods" className="info_button_link">
                  <h2>쇼핑하기</h2>
                </a>
                <p>선택하신 제품 간의 상호작용 위험을 진단하여, 안심하고 구매할 수 있도록 안전성을 꼼꼼하게 검증합니다.</p>
              </div>
            </div>
            <div className="info_contents info_right_sec4"></div>
          </div>

        </section>
        <section className="contact"></section>
      </main>
    </>
  );
}

export default Mainpage;
