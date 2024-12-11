import LogIn from "./pages/LogIn";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ForgotPwd from "./pages/ForgotPwd";
import TestList from "./pages/TestList";
import Test from "./pages/Test";
import TestDone from "./pages/TestDone";
import ResultList from "./pages/ResultList";
import Review from "./pages/Review";
import FeedbackList from "./pages/FeedbackList.jsx";
import FeedbackDetail from "./pages/FeedbackDetail.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/testlist" element={<TestList />} />
        <Route path="/test/:id" element={<Test />} />
        <Route path="/done" element={<TestDone />} />
        <Route path="/resultlist" element={<ResultList />} />
        <Route path="/review/:id" element={<Review />} />
        <Route path="/feedbacks" element={<FeedbackList />} />
        <Route path="/feedbacks/:id" element={<FeedbackDetail/>} />
        <Route path="/forgotpwd" element={<ForgotPwd />} />
      </Routes>
    </>
  );
}

export default App;
