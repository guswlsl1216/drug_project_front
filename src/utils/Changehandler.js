/**
 * ChangeHandler
 * 
 * input, textarea 등 폼 요소의 onChange 이벤트를 간단하게 처리할 수 있도록 돕는 유틸 함수입니다.
 * 
 * React의 `useState`로 관리하는 객체형 상태에서  
 * `name` 속성을 key로, `value` 속성을 값으로 자동 갱신합니다.
 * 
 * 사용 예시:
 * ```jsx
 * const [form, setForm] = useState({ email: "", password: "" });
 * 
 * <input name="email" value={form.email} onChange={ChangeHandler(setForm)} />
 * <input name="password" value={form.password} onChange={ChangeHandler(setForm)} />
 * 
 * // 입력 시 자동으로 form 상태 업데이트:
 * // { email: "입력값", password: "입력값" }
 * ```
 *
 * @function ChangeHandler
 * @param {Function} setState - React의 setState 함수 (예: setForm)
 * @returns {(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} 
 *          onChange 이벤트 핸들러 함수
 */

const Changehandler = (setState) => (e) => {
  setState((prev) => ({
    ...prev,
    [e.target.name] : e.target.value
  }))
}

export default Changehandler