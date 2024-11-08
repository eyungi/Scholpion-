import { Container, Box, Stack, Button, Typography } from "@mui/material";
import testArray from "./../MockTestData";

const TestList = () => {
  return (
    <div>
      <Container maxWidth="md">
        <Box
          sx={{
            height: "100vh",
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
              >
                {item.name}
              </Button>
            ))}
          </Stack>
        </Box>
      </Container>
    </div>
  );
};

export default TestList;
