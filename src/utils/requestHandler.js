import axiosInstance from "./axiosInstance"

/**
 * 공통 요청 헬퍼
 * @param {("get"|"post"|"put"|"patch"|"delete")} method
 * @param {string} url
 * @param {object|FormData} [payload]
 * @param {(data:any)=>void} [onSuccess]
 * @param {(msg:string, err:any)=>void} [onError]
 * @param {(v:boolean)=>void} [setLoading]
 * @param {object} [params] - GET 쿼리스트링 분리해서 쓰고 싶을 때
 * @returns {Promise<{ok:boolean, data?:any, message?:string}>}
 */

const requestHandler = async ({
  method = "post",
  url,
  payload = {},
  onSuccess,
  onError,
  setLoading,
  params,
}) => {
  const m = method?.toLowerCase?.() || "get"

  try {
    setLoading?.(true)

    let res
    if (m === "get") {
      res = await axiosInstance.get(url, {params: params ?? payload})
    } else if ( m === "delete") {
      res = await axiosInstance.delete(url, {data: payload})
    } else {
      res = await axiosInstance[m](url, payload)
    }

    onSuccess?.(res.data)
    return {ok: true, data:res.data}
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "요청 처리 중 오류가 발생했습니다."

      onError?.(msg, err)
      return { ok:false, message:msg }
  } finally {
    setLoading?.(false)
  }
}

export default requestHandler