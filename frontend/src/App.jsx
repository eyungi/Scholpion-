import LogIn from "./pages/LogIn";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ForgotPwd from "./pages/ForgotPwd";
import TestList from "./pages/TestList";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/testlist" element={<TestList />} />
        <Route path="/forgotpwd" element={<ForgotPwd />} />
      </Routes>
    </>
  );
}

export default App;
