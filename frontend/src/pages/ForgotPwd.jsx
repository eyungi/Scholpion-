import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const ForgotPwd = () => {
  const [error, setError] = useState("");

  // const reqBody = {
  //   exam_name: "시험지 1",
  //   explanation: "시험지",
  //   problems: [
  //     {
  //       prob_seq: 1,
  //       question: "A = 10, B = 20, A+B = ?",
  //       answer: "1",
  //       options: [
  //         { option_seq: 1, option_text: "30" },
  //         { option_seq: 2, option_text: "40" },
  //         { option_seq: 3, option_text: "10" },
  //       ],
  //       category: {
  //         category_name: "plus",
  //         subject: "수학",
  //         creator: "063b9812-2291-4fc8-a3b1-a392d4f7c3ee",
  //       },
  //     },
  //     {
  //       prob_seq: 2,
  //       question: "A = 256, B = 1/2, A**B= ?",
  //       answer: "16",
  //       options: [],
  //       category: {
  //         category_name: "power",
  //         subject: "수학",
  //         creator: "063b9812-2291-4fc8-a3b1-a392d4f7c3ee",
  //       },
  //     },
  //     {
  //       prob_seq: 3,
  //       question: "A = 40, B = 2, A**B = ?",
  //       answer: "2",
  //       options: [
  //         { option_seq: 1, option_text: "30" },
  //         { option_seq: 2, option_text: "1600" },
  //         { option_seq: 3, option_text: "80" },
  //         { option_seq: 4, option_text: "-10" },
  //       ],
  //       category: {
  //         category_name: "power",
  //         subject: "수학",
  //         creator: "063b9812-2291-4fc8-a3b1-a392d4f7c3ee",
  //       },
  //     },
  //   ],
  //   creator: "063b9812-2291-4fc8-a3b1-a392d4f7c3ee",
  // };

  useEffect(() => {
    const getSolvedExam = async () => {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        setError("인증이 필요합니다. 로그인하세요.");
        return;
      }

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/solved-exams/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("받은 데이터", response.data);
        console.log("test");
      } catch (err) {
        setError(err?.response || "데이터를 가져오지 못했습니다.");
        console.error("서버 응답 에러:", err?.response || err.message);
      }
    };

    getSolvedExam();
  }, []);

  return <div>테스트 용</div>;
};

export default ForgotPwd;
