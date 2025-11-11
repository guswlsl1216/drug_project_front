import './App.css'
import Routers from './Route'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { UserProvider, useUser } from './components/context/UserContext'

const AppContent = () => {
  const {loading} = useUser();

  if (loading) return <div>Loading...</div>; // 새로고침 시 체크 완료까지 기다림

  return (
    <>
      <Header/>
      <Routers/>
      <Footer/>
    </>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppContent/>
    </UserProvider>
  );
};

export default App
