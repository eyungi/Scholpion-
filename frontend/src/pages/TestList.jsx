import { Container, Box, Stack, Button, Typography } from "@mui/material";
import testArray from "./../MockTestData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axiosInstance from "../axiosInstance";
const TestList = () => {
  const nav = useNavigate();
  const [exams, setExams] = useState([]);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getExams = async () => {
      try {
        setLoad(true);
        const response = await axiosInstance.get("/exams/");
        setExams(response.data);
      } catch (error) {
        setError(error.message || "데이터를 가져오지 못했습니다");
      } finally {
        setLoad(false);
      }
    };

    getExams();
  }, []);

  if (load) return <div>loading...</div>;
  if (error) return <div>{"Error :("}</div>;

  console.log(exams);
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
            응시할 시험을 선택해주세요
          </Typography>
          <Stack spacing={2} sx={{ mt: "20px" }}>
            {exams.map((item) => (
              <Button
                variant="contained"
                sx={{
                  maxWidth: "800px",
                  minHeight: "90px",
                  fontSize: "25px",
                  backgroundColor: "white",
                  color: "black",
                }}
                key={item.exam_id}
                onClick={() => nav(`/test/${item.exam_id}`)}
              >
                {item.exam_name}
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

export default TestList;
