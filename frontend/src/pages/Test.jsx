import { useParams, useNavigate } from "react-router-dom";
import testArray from "./../MockTestData";
import { useState } from "react";
import {
  Grid2,
  Container,
  Box,
  Typography,
  Stack,
  Button,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

const Test = () => {
  const params = useParams();
  const [number, setNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const testData = testArray.find((item) => item.id === Number(params.id));
  const problems = testData ? testData.problems : [];
  const problem = problems.find((item) => item.number === number);

  return (
    <Grid2 container spacing={2}>
      <Grid2
        size={3.6}
        sx={{
          borderRight: "2px solid rgba(0,0,0,0.1)",
          position: "relative",
          height: "100vh",
        }}
      >
        <Container>
          <Typography>#{number}</Typography>
          <Box
            sx={{
              margin: "10px",
              minHeight: "150px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              p: "10px",
            }}
          >
            <Typography>{problem.content}</Typography>
          </Box>
          <Stack spacing={2.5} sx={{ mt: "20px" }}>
            {problem.selection.map((item) => (
              <Button
                sx={{
                  justifyContent: "flex-start",
                  display: "flex",
                  fontSize: "20px",
                  alignItems: "center",
                  color: "black",
                  "&:focus": {
                    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
                  },
                }}
                key={item.id}
              >
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    margin: "6px",
                    marginRight: "12px",
                    backgroundColor: "white",
                    color: "black",
                    border: "2px solid black",
                  }}
                >
                  {item.number}
                </Avatar>
                {item.answer}
              </Button>
            ))}
          </Stack>
        </Container>

        <Container
          sx={{
            position: "absolute",
            bottom: 20,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {problem.number !== 1 && (
            <Button variant="contained" onClick={() => setNumber(number - 1)}>
              이전
            </Button>
          )}
          {problem.number === problems.length ? (
            <Button
              variant="contained"
              sx={{ marginLeft: "5px" }}
              onClick={() => setOpen(true)}
            >
              제출
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ marginLeft: "5px" }}
              onClick={() => setNumber(number + 1)}
            >
              다음
            </Button>
          )}
        </Container>
      </Grid2>
      <Grid2
        size={8.4}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box sx={{ textAlign: "center", fontSize: "50px" }}>풀이과정</Box>
      </Grid2>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent sx={{ minWidth: "400px", minHeight: "50px" }}>
          제출하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: "red" }}>
            아니요
          </Button>
          <Button onClick={() => nav("/done")}>네</Button>
        </DialogActions>
      </Dialog>
    </Grid2>
  );
};

export default Test;
