import { useUser } from "../components/context/UserContext";
import UseNavi from "./UseNavi";

/**
 * useLoginRedirect
 * 
 * 로그인 필요 기능 접근 시, 로그인 여부를 확인하고
 * 필요하면 로그인 페이지로 리다이렉트 시키는 훅
 * 
 * 사용 예시:
 * const { requireLogin } = useLoginRedirect();
 * 
 * // 1. 단순 기능 실행
 * requireLogin(() => {
 *   saveResult(); // 로그인 되어 있을 때만 실행
 * });
 * 
 * // 2. replace 옵션 사용
 * // 로그인 페이지로 이동할 때 뒤로가기 시 이전 페이지로 돌아가지 않도록 처리
 * requireLogin(() => {
 *   saveResult();
 * }, true);
 * 
 * @returns {object} { requireLogin }
 *   - requireLogin: 로그인 확인 후 콜백 실행 함수
 */

const useLoginRedirect = () => {
  const { isLoggedIn } = useUser();
  const { goTo } = UseNavi();

  const requireLogin = (callback, replace = false) => {
    if(!isLoggedIn) {
      alert("로그인이 필요합니다")
      goTo("/login", null, replace);
      return;
    }
    callback?.(); // 로그인된 경우 실행
  };

  return { requireLogin };
};

export default useLoginRedirect;