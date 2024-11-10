import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const TestDone = () => {
  const nav = useNavigate();
  return (
    <Container
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4" align="center">
        제출 완료
        <br /> 고생하셨습니다
      </Typography>
      <Button variant="contained" onClick={() => nav("/")}>
        홈으로
      </Button>
    </Container>
  );
};

export default TestDone;
