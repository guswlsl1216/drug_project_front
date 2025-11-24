import { createContext, useContext, useEffect, useState } from "react";
import requestHandler from "../../utils/requestHandler";
import axiosInstance from "../../utils/axiosInstance";

// Context 생성
export const UserContext = createContext();

// Provider 생성
export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null); // 로그인 한 유저 정보
  const [loading, setLoading] = useState(true); // 로그인 한 유저 정보
  const [verified, setVerified] = useState(false); // 회원정보 인증하면 저장

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axiosInstance.get("login/check"); // 쿠키 포한 자동 전송

        if (res.data.logged_in) {
          setUser(res.data.user); // nickname, id 등 전체 user 정보
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("로그인 상태 확인 실패:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  useEffect(() => { // 로그아웃하면 인증을 fasle로 바꿨는데 다시 로그인을 하면 남아있어서 user가 null이 되는 경우 자동으로 초기화 추가
    if (!user) {
      setVerified(false);
    }
  }, [user]);

  const isLoggedIn = !!user;
    
  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, loading, verified, setVerified }}>
      {children}
    </UserContext.Provider>
  );
};

// Context 사용 훅
export const useUser = () => useContext(UserContext);

// 모든 컴포넌트에서 useUser()를 사용해서 로그인 상태와 사용자 정보를 가져 올 수 있음