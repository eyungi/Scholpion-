import { Container, Box, Stack, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";
const ResultList = () => {
  const nav = useNavigate();
  const [reviewArray, setReviewArray] = useState([]);
  const [combinedExams, setCombinedExams] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getReviewArray = async () => {
      try {
        const [solvedExamsResponse, examsResponse] = await Promise.all([
          axiosInstance.get("/solved-exams/"),
          axiosInstance.get("/exams/"),
        ]);

        const solvedExams = solvedExamsResponse.data;
        setCombinedExams(solvedExams);
      } catch (error) {
        setError(error.message || "데이터를 가져오지 못했습니다");
      }
    };
    getReviewArray();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
  };

  return (
    <div>
      <Container
        maxWidth="md"
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            height: "85vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start", // 수평 중앙 정렬
            padding: "0 80px",
          }}
        >
          <Typography
            variant="h4"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            확인할 결과를 선택해주세요
          </Typography>
          <Stack spacing={2} sx={{ mt: "20px", overflowY: "scroll" }}>
            {combinedExams.map((item) => (
              <Button
                variant="contained"
                sx={{
                  maxWidth: "800px",
                  minHeight: "90px",
                  fontSize: "25px",
                  backgroundColor: "white",
                  color: "black",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                style={{ margin: "8px" }}
                key={item.solved_exam_id}
                onClick={() => {
                  nav(`/review/${item.solved_exam_id}`);
                }}
              >
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="h5">{item.exam_obj.exam_name}</Typography>
                  <Typography fontSize={"13px"}>
                    {item.feedback ? formatDateTime(item.solved_at) : null}
                  </Typography>
                </Box>
                <Typography
                  fontSize={"13px"}
                  sx={{
                    color: item.feedback ? "green" : "red",
                  }}
                >
                  {item.feedback ? "평가 완료" : "평가 이전"}
                </Typography>
              </Button>
            ))}
          </Stack>
        </Box>
        <Button
          variant="contained"
          sx={{
            mt: "20px",
            backgroundColor: "#f1f3f4",
            color: "gray",
            minWidth: "400px",
            alignSelf: "center",
          }}
          onClick={() => nav("/")}
        >
          홈으로
        </Button>
      </Container>
    </div>
  );
};

export default ResultList;
