import './App.css'
import Routers from './Route'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { UserProvider } from './components/context/UserContext'

function App() {

  return (
    <UserProvider>
      <Header />
      <Routers />
      <Footer />
    </UserProvider>
  )
}

export default App
