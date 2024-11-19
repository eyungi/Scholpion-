import { useParams, useNavigate } from "react-router-dom";
import testArray from "./../MockTestData";
import { useState, useEffect } from "react";
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
  TextField,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const Test = () => {
  const params = useParams();
  const [number, setNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const [answer, setAnswer] = useState("");
  const [answerSheet, setAnswerSheet] = useState([]);
  const [error, setError] = useState(false);
  const [problems, setProblems] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    console.log("Test params.id:", params.id);
    if (!accessToken) {
      setError("인증이 필요합니다. 로그인하세요.");
      setLoading(false);
      return;
    }

    const getProblems = async () => {
      try {
        setLoad(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/exams/${params.id}/problems/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setProblems(response.data);
        console.log("문제들", response.data);
      } catch (error) {
        setError(err.message || "데이터를 가져오지 못했습니다");
      } finally {
        setLoad(false);
      }
    };

    getProblems();
  }, [params.id]);

  const problem = problems.find(
    (item) => Number(item.prob_seq) === Number(number)
  );

  //console.log(problems);
  //console.log(problem);

  const onClickNext = () => {
    setAnswerSheet((prev) => [...prev, { number, answer }]);
    setAnswer("");
    setNumber((prev) => prev + 1);
    console.log(answerSheet);
    setError(false);
  };

  const onSubmit = () => {
    const updatedAnswerSheet = [...answerSheet, { number, answer }];
    setAnswerSheet(updatedAnswerSheet);
    console.log("제출:", updatedAnswerSheet);
    nav("/done");
  };

  if (!problem || !problem.options) {
    return <div>현재 문제를 찾을 수 없습니다.</div>;
  }

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
            <Typography>{problem.question}</Typography>
          </Box>
          {problem.options.length > 0 ? (
            <Stack spacing={2.5} sx={{ mt: "20px" }}>
              {problem.options.map((item) => (
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
                  key={item.option_seq}
                  onClick={() => setAnswer(item.option_seq)}
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
                    {item.option_seq}
                  </Avatar>
                  {item.option_text}
                </Button>
              ))}
            </Stack>
          ) : (
            <Box sx={{ mt: "20px" }}>
              <TextField
                fullWidth
                variant="outlined"
                label="답을 입력하세요"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </Box>
          )}
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
          {problem.prob_seq === problems.length ? (
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
              onClick={() => onClickNext()}
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
        <Box
          sx={{
            textAlign: "center",
            fontSize: "50px",
            color: "rgba(128, 128, 128, 0.5)",
          }}
        >
          풀이과정
        </Box>
      </Grid2>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent sx={{ minWidth: "400px", minHeight: "50px" }}>
          제출하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: "red" }}>
            아니요
          </Button>
          <Button onClick={onSubmit}>네</Button>
        </DialogActions>
      </Dialog>
    </Grid2>
  );
};

export default Test;
