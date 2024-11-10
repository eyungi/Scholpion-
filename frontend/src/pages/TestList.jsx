import { Container, Box, Stack, Button, Typography } from "@mui/material";
import testArray from "./../MockTestData";
import { useNavigate } from "react-router-dom";

const TestList = () => {
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
            응시할 시험을 선택해주세요
          </Typography>
          <Stack spacing={2} sx={{ mt: "20px" }}>
            {testArray.map((item) => (
              <Button
                variant="contained"
                sx={{
                  maxWidth: "800px",
                  minHeight: "90px",
                  fontSize: "25px",
                  backgroundColor: "white",
                  color: "black",
                }}
                key={item.id}
                onClick={() => nav(`/test/${item.id}`)}
              >
                {item.name}
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
