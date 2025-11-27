import mainImage from "../images/main01.png";
import pill from "../images/pill.png";
import "../styles/Mainpage.css";
import Rectangle20 from "../images/Rectangle20.png"
import Rectangle18 from "../images/Rectangle18.png"
import ExpandArrow from "../images/ExpandArrow.png"
import step1 from "../images/step1.png"
import step2 from "../images/step2.png"
import step3 from "../images/step3.png"
import step4 from "../images/step4.png"
import { useEffect, useRef } from "react";


function Mainpage() {
  const pillRef = useRef(null);

 useEffect(() => {
    const maxLineHeight = 5600; // 선이 최대 내려갈 픽셀값 (원하면 조정)
    const scrollRange = 5000;   // 시작~끝 스크롤 범위 (원하면 조정)

    const onScroll = () => {
      if (!pillRef.current) return;

      const rect = pillRef.current.getBoundingClientRect();
      const wrapperTopPageY = window.scrollY + rect.top;
      const start = wrapperTopPageY - window.innerHeight * 0.5; // 시작 스크롤 위치(조정 가능)
      const end = start + scrollRange;
      const y = window.scrollY;

      let progress = (y - start) / (end - start);
      progress = Math.max(0, Math.min(1, progress));

      // active 클래스 토글 (작게 움직일 때도 보이게 하고 싶다면 임계값 변경)
      if (progress > 0.02) pillRef.current.classList.add("active");
      else pillRef.current.classList.remove("active");

      // 선 높이 제어 (스크롤에 따라 내려감)
      const lineEl = pillRef.current.querySelector(".pill_line");
      if (lineEl) {
        const height = Math.round(progress * maxLineHeight);
        lineEl.style.height = `${height}px`;
      }

      // 알갱이 위치/투명도 실시간 제어 (스크롤에 따라 자연스럽게 떨어지는 효과)
      const drops = pillRef.current.querySelectorAll(".pill_drops .drop");
      drops.forEach((d, i) => {
        // 각 drop을 약간씩 다른 속도로 내려 보내 중앙으로 모이는 연출
        const dropFactor = 0.8 + i * 0.08;
        const dropY = Math.round(progress * maxLineHeight * dropFactor);
        d.style.transform = `translateX(-50%) translateY(${dropY}px)`;
        d.style.opacity = progress; // 0 ~ 1
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // 초기 상태 계산
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".info_contents");
    if (!els.length) return;

    const animateCount = (el, from, to, duration) => {
      if (!el) return;
      const start = performance.now();
      const diff = to - from;
      const run = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const val = Math.floor(from + diff * t);
        el.textContent = val;
        if (t < 1) requestAnimationFrame(run);
        else el.textContent = String(to);
      };
      requestAnimationFrame(run);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target;
          
          if (entry.isIntersecting) {
            // 화면에 들어올 때
            target.classList.add("in-view");

            // 캘린더 내부 숫자 애니메이션 시작
            const calendar = target.querySelector(".calendar");
            if (calendar) {
              const counterEl = calendar.querySelector(".calendar_count");
              if (counterEl) {
                // 매번 1부터 다시 카운트
                counterEl.textContent = "1";
                animateCount(counterEl, 1, 31, 1400);
              }
            }
          } else {
            // 화면 밖으로 나갈 때
            target.classList.remove("in-view");
            
            // 캘린더 숫자 초기화
            const calendar = target.querySelector(".calendar");
            if (calendar) {
              const counterEl = calendar.querySelector(".calendar_count");
              if (counterEl) {
                counterEl.textContent = "1";
              }
            }
          }
        });
      },
      { threshold: 0.9 } // 요소 25% 보이면 활성화
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);


  return (
    <>
      <main className="wrapper">
        <section className="main_contents">
          <div className="main_text">
            <p className="sub_title">안전한 의약품 관리의 시작</p>
            <h1 className="main_title">Medi.Check!</h1>
            <p className="scroll_text">아래로 스크롤 하여 탐색하기</p>
            <div className="scroll_arrow">
              <img src={ExpandArrow} 
              alt="스크롤 안내" 
              className="scroll_img" />
              </div>
            <div className="pill_wrapper" ref={pillRef}>
              <div className="pill_top">
                <img src={Rectangle20} alt="pill top" />
              </div>
              <div className="pill_btm">
                <img src={Rectangle18} alt="pill bottom" />
              </div>

              <div className="pill_line" />

              <div className="pill_drops" aria-hidden="true">
              <span className="drop d1" />
              <span className="drop d2" />
              <span className="drop d3" />
              <span className="drop d4" />
              <span className="drop d5" />
              <span className="drop d6" />
              <span className="drop d7" />
              <span className="drop d8" />
              <span className="drop d9" />
              <span className="drop d10" />
              <span className="drop d11" />
              <span className="drop d12" />
              <span className="drop d13" />
              <span className="drop d14" />
              <span className="drop d15" />
              <span className="drop d16" />
              <span className="drop d17" />
              <span className="drop d18" />
              <span className="drop d19" />
              <span className="drop d20" />
            </div>
            </div>
          </div>
        </section>
        <section className="intro">
        </section>
        <section className="info">
          <div className="info_section">
            <div className="info_contents info_left_sec1">
              <div className="info_text_box">
                <h2>STEP.01</h2>
                <h2>사진 인식을 통해 의약품을 체크합니다</h2>
                <p>여러 약물의 성분을 동시에 검색하고 분석하여 약물 간 상호작용을 확인할 수 있습니다. 위험, 주의, 양호 등급으로 명확하게 안내합니다.</p>
              </div>
              
            </div>
            <div className="info_contents info_right_sec1">
              <img src={step1} alt="" srcset="" />
            </div>
          </div>

          <div className="info_section">
            <div className="info_contents info_left_sec2">
              <img src={step2} alt="" srcset="" />
              
            </div>
            <div className="info_contents info_right_sec2">
              <div className="info_text_box">
                <h2>STEP.02</h2>
                <h2>의약품 및 영양제를 비교, 분석합니다</h2>
                <p>의약품들과 영양제의 성분을 분석하여 약물 간 상호작용을 확인할 수 있습니다. 위험, 주의, 양호  등급으로 명확하게 안내합니다. </p>
              </div>
            </div>
          </div>
          <div className="info_section">
            <div className="info_contents info_left_sec3">
              <div className="info_text_box">
                <h2>STEP.03</h2>
                <h2>복용 루틴을 체크하세요</h2>
                <p>매일 먹는 약과 영양제를 기록하고 관리할 수 있습니다. 복용 시간을 놓치지 않도록 알림을 받고, 건강한 습관을 만들어가세요.</p>
              </div>
            </div>
            <div className="info_contents info_right_sec3">
              <div className="calendar">
                <img src={step3} alt="calendar" />
                <div className="calendar_overlay" aria-hidden="true">
                  <span className="calendar_count">1</span>
                </div>
              </div>
            </div>
          </div>
          <div className="info_section">
            <div className="info_contents info_left_sec4">
              <img src={step4} alt="" srcset="" />
            </div>
            <div className="info_contents info_right_sec4">
              <div className="info_text_box">
                <h2>STEP.04</h2>
                <h2>내가 먹는 성분과 비교하며 구매하세요</h2>
                <p>Medi.Check의 성분분석 기능이 포함된 쇼핑몰에서 내가 복용하는 성분과 비교하며 안전하게 구매하세요.</p>
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
