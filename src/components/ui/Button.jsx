import "./Button.css"

/**
 * Button Component
 *
 * 재사용 가능한 공통 버튼 컴포넌트입니다.
 * 
 * variant, disabled, className 등의 속성을 조합하여 
 * 다양한 버튼 스타일을 만들 수 있습니다.
 *
 * 사용 예시:
 * ```jsx
 * import Button from "../components/ui/Button";
 * 
 * <Button variant="primary" onClick={handleSubmit}>
 *   저장
 * </Button>
 * 
 * <Button variant="outline" disabled>
 *   비활성화 버튼
 * </Button>
 * 
 * <Button variant="danger" className="fullWidth">
 *   삭제하기
 * </Button>
 * ```
 *
 * @component
 * @param {object} props
 * @param {React.ReactNode} props.children - 버튼 내부에 표시할 텍스트나 요소
 * @param {function} [props.onClick] - 클릭 시 실행할 함수
 * @param {string} [props.type="button"] - 버튼 타입 ('button', 'submit', 'reset')
 * @param {"primary"|"secondary"|"outline"|"text"|"danger"} [props.variant="primary"] - 버튼 스타일 종류
 * @param {boolean} [props.disabled=false] - 비활성화 여부
 * @param {string} [props.className] - 추가 커스텀 클래스명
 * 
 * @returns {JSX.Element} Button element
 */

const Button = ({
  children, 
  onClick, 
  type="button", 
  variant = "primary", 
  disabled = false, 
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button