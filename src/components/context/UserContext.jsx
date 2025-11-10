import { children, createContext, useContext, useState } from "react";

// Context 생성
const UserContext = createContext();

// Provider 생성
export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null); // 로그인 한 유저 정보

  const isLoggedIn = () => !!user;

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

// Context 사용 훅
export const useUser = () => useContext(UserContext);

// 모든 컴포넌트에서 useUser()를 사용해서 로그인 상태와 사용자 정보를 가져 올 수 있음