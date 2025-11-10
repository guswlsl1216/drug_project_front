import { useNavigate } from "react-router-dom"

/**
 * UseNavi Hook
 * 
 * React Router의 useNavigate를 감싸서 
 * 페이지 이동을 쉽게 처리할 수 있는 커스텀 훅입니다.
 * 
 * 사용 예시:
 * ```jsx
 * const { goIndex, goTo, goBack} = UseNavi()
 * goIndex(); // "/"로 이동
 * goTo("/detail", { id: 5 });    // 지정한 경로로 이동
 * goBack();                      // 이전 페이지로 이동
 * 
 * 필요한 함수만 선택적으로 사용할 수 있습니다.
 * ```
 * 
 * @returns {{ goIndex: Function, goTo: Function, goBack: Function }}
 */

const UseNavi = () => {
  const navigate = useNavigate()

  /**
   * 홈("/")으로 이동
   * @example
   * goIndex()
   */
  const goIndex = () => {
    navigate('/')
  }

  /**
   * 지정한 경로로 이동
   * @param {string} path - 이동할 경로 (예: "/product/detail")
   * @param {object} [state] - 함께 전달할 상태 객체 (선택)
   * @param {boolean} [replace] - 현재 히스토리를 교체할지 여부 (선택)
   * @example
   * goTo("/detail", { id: 3, name: "비타민C" })
   */
  const goTo = (path, state, replace=false) => {
    navigate(path, {state, replace})
  }

  /**
   * 이전 페이지로 이동
   * (히스토리 스택의 바로 이전 페이지로 이동합니다)
   * @example
   * goBack()
   */
  const goBack = () => {
    navigate(-1)
  }

  return {goIndex, goTo, goBack}
}

export default UseNavi