import axios from "axios";

/**
 * axiosInstance
 * 
 * Axios를 프로젝트 전역에서 재사용할 수 있도록 기본 설정을 지정한 인스턴스.  
 * 모든 API 요청에 공통적으로 적용되는 `baseURL`, `headers`, `withCredentials` 옵션을 포함.
 * 
 * 주요 설정:
 * - `baseURL`: 환경변수(`VITE_SERVER_URL`)에서 불러와 서버 기본 주소를 지정  
 * - `headers`: 모든 요청에 기본 Content-Type을 JSON으로 지정  
 * - `withCredentials`: 쿠키 기반 인증(세션/JWT) 사용 시 필요 (CORS 허용)
 * 
 * 사용 예시:
 * ```js
 * import axiosInstance from "../utils/axiosInstance";
 * 
 * // GET 요청
 * const res = await axiosInstance.get("/user/info");
 * 
 * // POST 요청
 * const res = await axiosInstance.post("/auth/login", { email, password });
 * 
 * console.log(res.data);
 * ```
 * 
 * @constant
 * @type {import("axios").AxiosInstance}
 * @property {string} baseURL - API 서버 기본 경로
 * @property {object} headers - 모든 요청에 적용되는 HTTP 헤더
 * @property {boolean} withCredentials - 쿠키 기반 인증 허용 여부
 */

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
  headers: { 
    'Content-Type': 'application/json; charset=utf-8'
  },
  withCredentials: true
})

export default axiosInstance