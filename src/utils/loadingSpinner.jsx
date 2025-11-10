import Spinner from "../components/ui/Spinner";

/**
 * 로딩 스피너 컴포넌트를 감싸는 Wrapper 함수.
 * DrugInfo 팝업 내에서 데이터를 로드할 때 사용됩니다.
 *
 * @param {object} props - 컴포넌트에 전달되는 속성 객체.
 * @param {number} [props.size=50] - 스피너의 크기 (px). 기본값은 50입니다.
 * @param {string} [props.color="#00e2ff"] - 스피너의 색상 (CSS 색상 코드). 기본값은 파란색 계열입니다.
 * @param {string} [props.label] - 스피너 아래에 표시될 텍스트 라벨.
 * @returns {JSX.Element} 로딩 스피너 UI.
 */

const loadingSpinner = ({size=50, color="#00e2ff", label}) =>{
  return (
    <div className="drug_info_loadingSpinner">
      <div className="overlay">
        <Spinner size={size} color={color} showLabel label={label ? label : ''} />
      </div>
    </div>
  )
}

export default loadingSpinner;