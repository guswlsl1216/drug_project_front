import { Route, Routes } from "react-router-dom"
import Mainpage from "./pages/Mainpage";

const Routers = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Mainpage />} />
      </Routes>
    </>
  );
}

export default Routers