import { Container, Box, Stack, Button, Typography } from "@mui/material";
import resultArray from "./../MockResultData";
import { useNavigate } from "react-router-dom";

const ResultList = () => {
  const nav = useNavigate();

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
          <Stack spacing={2} sx={{ mt: "20px" }}>
            {resultArray.map((item) => (
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
                key={item.id}
                onClick={() => nav(`/test/${item.id}`)}
              >
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="h5">{item.name}</Typography>
                  <Typography fontSize={"13px"}>{item.testName}</Typography>
                </Box>
                <Typography
                  fontSize={"13px"}
                  sx={{
                    color: item.done ? "green" : "red",
                  }}
                >
                  {item.done ? "평가 완료" : "평가 이전"}
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
