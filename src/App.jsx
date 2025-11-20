import './App.css'
import Routers from './Route'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { useState } from 'react'
import ChatbotButton from './components/ui/ChatbotButton'
import ChatbotDock from './components/chatbot/ChatbotDock'
import { UserProvider, useUser } from './components/context/UserContext'
import useScrollToTop from './utils/useScrollToTop'

const AppContent = () => {
  const {loading} = useUser();
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])

  if (loading) return <div>Loading...</div>; // 새로고침 시 체크 완료까지 기다림

  return (
    <>
      <Header/>
      <Routers/>
      <ChatbotButton onClick={() => setOpen(true)} />
      <Footer/>
      <ChatbotDock
        open={open}
        onClose={() => setOpen(false)}  
        messages={messages} // 자식에게 메세지 넘기기
        setMessages={setMessages} // 업데이트 함수도 넘기기
        onNewChat={() => setMessages([])} // 새 대화시 초기화
      />
    </>
  );
};

const App = () => {
  useScrollToTop();
  return (
    <UserProvider>
      <AppContent/>
    </UserProvider>
  );
};

export default App
