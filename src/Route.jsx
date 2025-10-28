import { Route, Routes } from "react-router-dom"
import Mainpage from "./pages/Mainpage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Meds from "./pages/Meds";
import Analyze from "./pages/Analyze";

const Routers = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/meds" element={<Meds />} />
        <Route path="/analyze" element={<Analyze />} />
      </Routes>
    </>
  );
}

export default Routers