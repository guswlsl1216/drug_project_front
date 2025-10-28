import "./Spinner.css"

/**
 * Spinner (알약 모양 로딩 컴포넌트)
 * 
 * 공통으로 사용할 수 있는 알약(캡슐) 형태의 로딩 스피너입니다.  
 * `size`, `color`, `label`, `showLabel` 등의 props로 자유롭게 커스터마이징할 수 있습니다.
 * 
 * 주요 특징
 * - 알약(캡슐) 형태의 회전 애니메이션
 * - 접근성(ARIA) 속성 포함 (`aria-label`, `role="status"`)
 * - `showLabel` 옵션으로 "로딩 중..." 텍스트 표시 가능
 * 
 * 사용 예시
 * ```jsx
 * import Spinner from "../components/ui/Spinner";
 * 
 * // 기본 사용
 * <Spinner />
 * 
 * // 크기 & 색상 지정
 * <Spinner size={60} color="#6b4ef3" />
 * 
 * // 로딩 문구 표시
 * <Spinner size={50} color="#00e2ff" showLabel label="불러오는 중..." />
 * 
 * // 버튼 안에서 사용
 * <Button disabled={loading}>
 *   {loading ? <Spinner size={20} color="#fff" /> : "로그인"}
 * </Button>
 * 
 * // 페이지 오버레이로 사용
 * {loading && (
 *   <div className="overlay">
 *     <Spinner size={70} color="#fff" showLabel label="잠시만 기다려주세요..." />
 *   </div>
 * )}
 * ```
 * 
 * @component
 * @param {object} props
 * @param {number} [props.size=28] - 스피너 크기(px)
 * @param {string} [props.color="currentColor"] - 스피너 색상
 * @param {string} [props.label="Loading..."] - 접근성용 텍스트 (ARIA)
 * @param {string} [props.className=""] - 추가 커스텀 클래스명
 * @param {boolean} [props.showLabel=false] - 로딩 문구 표시 여부
 * @returns {JSX.Element} 알약 모양의 로딩 스피너
 */

const Spinner = ({
  size = 28,            // px
  color = "currentColor",    
  label = "Loading...",  // 접근성 텍스트
  className = "",
  showLabel = false
}) => {
  const style = {
    "--size": `${size}px`,
    "--color": color
  }
  
  return (
    <span className={`spinner-wrap ${className}`}>
      <span
        className="spinner pill"
        style={style}
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={label}   // 접근성 유지
      />
      {showLabel && <span className="spinner-label">{label}</span>}
    </span>
  )
}

export default Spinner