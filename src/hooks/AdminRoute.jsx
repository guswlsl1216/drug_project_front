import useLoginRedirect from "../utils/useLoginRedirect";
import { useEffect } from "react";

export const AdminRoute = ({ children }) => {
  const { requireAdmin } = useLoginRedirect();

  useEffect(() => {
    requireAdmin()
  }, [])


  // 관리자일 때만 children 렌더
  return children
}