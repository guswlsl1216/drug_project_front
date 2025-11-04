import './App.css'
import Routers from './Route'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { useState } from 'react'
import ChatbotDock from './components/chatbot/ChatbotDock'
import ChatbotButton from './components/ui/ChatbotButton'

function App() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])

  return (
    <>
      <Header />
      <Routers />
      <ChatbotButton onClick={() => setOpen(true)} />
      <Footer />
      <ChatbotDock
        open={open} 
        onClose={() => setOpen(false)}  
        messages={messages} // 자식에게 메세지 넘기기
        setMessages={setMessages} // 업데이트 함수도 넘기기
        onNewChat={() => setMessages([])} // 새 대화시 초기화
      />
    </>
  )
}

export default App
