import { NavLink, Outlet } from 'react-router-dom';
import '../../styles/mainbg.css'
import '../../styles/analyze.css'
// 복용 약 & 영양제 분석 페이지

const Analyze = () => {
  return (
    <>
      <div className="wrapper">
        <section className="main_bg">
          <div className="bg_text">
            <h1 className="bg_main_title">AI 분석 페이지</h1>
            <p className="bg_sub_title">AI가 분석합니다.</p>
          </div>
        </section>
        <section className='analyze-tab-contents'>
          <nav className="analyze-tabs">
            <NavLink to="medicine" className="medicine-tab">의약품</NavLink>
            <NavLink to="supplement" className="supplement-tab">영양제</NavLink>
          </nav>

          <div className="analyze-tab-content">
            <Outlet />
          </div>
        </section>
      </div>
    </>
  );
}

export default Analyze;
