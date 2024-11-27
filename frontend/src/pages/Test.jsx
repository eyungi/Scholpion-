import { useParams, useNavigate } from "react-router-dom";
import testArray from "./../MockTestData";
import { useState, useEffect, useRef } from "react";
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
  ButtonGroup,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

import eraser from "../assets/eraser.png";
import pencil from "../assets/pencil.png";
import reset from "../assets/reset.png";

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
  //시간관련
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(0);
  const [hour, setHour] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const elapsedTimeRef = useRef(0);
  const time = useRef(0);
  const startTimeRef = useRef(Date.now());
  const timerId = useRef(null);
  //그림판 관련
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [isEraserActive, setIsEraserActive] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
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

  useEffect(() => {
    const initializeCanvas = () => {
      if (!canvasRef.current) {
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
    };

    const intervalId = setInterval(() => {
      if (canvasRef.current) {
        initializeCanvas();
        clearInterval(intervalId);
      }
    }, 50);
  }, []);

  //시간 관련 메소드
  const startTimer = () => {
    clearInterval(timerId.current);

    startTimeRef.current = Date.now() - elapsedTimeRef.current * 1000;
    timerId.current = setInterval(() => {
      const elapsedTime = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );

      elapsedTimeRef.current = elapsedTime;
      setHour(Math.floor(elapsedTime / 3600));
      setMin(Math.floor((elapsedTime % 3600) / 60));
      setSec(elapsedTime % 60);
    }, 1000);
  };

  useEffect(() => {
    startTimer();

    return () => clearInterval(timerId.current);
  }, []);

  const stopTimer = () => {
    clearInterval(timerId.current);
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(true);
    startTimer();
  };

  //문제 관련 메소드
  const problem = problems.find(
    (item) => Number(item.prob_seq) === Number(number)
  );

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

  //풀이 메모장 관련
  const startDrawing = (e) => {
    if (!canvasRef.current) {
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) {
      return;
    }
    isDrawingRef.current = true;
    if (!isEraserActive) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    if (!canvasRef.current) {
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) {
      return;
    }
    if (isEraserActive) {
      ctx.clearRect(
        e.nativeEvent.offsetX - 10,
        e.nativeEvent.offsetY - 10,
        30,
        30
      );
    } else {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const imageURL = canvas.toDataURL("image/png");

    //아래는 api에서는 지워도 된다.
    const downloadLink = document.createElement("a");
    downloadLink.href = imageURL;
    downloadLink.download = "canvas_image.png";
    downloadLink.click();
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const toggleEraser = () => {
    setIsEraserActive((prev) => !prev);
  };

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
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ color: "skyblue" }}>
            응시시간 : {hour}시간 {min}분 {sec}초
          </Typography>
          <Box>
            {problem.number !== 1 && (
              <Button variant="contained" onClick={() => setNumber(number - 1)}>
                이전
              </Button>
            )}
            {problem.prob_seq === problems.length ? (
              <Button
                variant="contained"
                sx={{ marginLeft: "5px" }}
                onClick={() => {
                  stopTimer();
                  setOpen(true);
                }}
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
          </Box>
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
            width: "100%",
            height: "100%",
            position: "relative",
            textAlign: "center",
            fontSize: "20px",
          }}
        >
          <ButtonGroup>
            <Button
              variant="contained"
              color="white"
              onClick={toggleEraser}
              sx={{
                minWidth: "30px", // 버튼 크기 설정
                height: "30px",
              }}
            >
              <img
                src={isEraserActive ? pencil : eraser}
                style={{
                  width: "20px", // 이미지 크기 조정
                  height: "20px",
                }}
              />
            </Button>
            <Button
              variant="contained"
              color="white"
              sx={{
                padding: "10px", // 버튼 내부 여백 조정
                minWidth: "30px", // 버튼 크기 설정
                height: "30px",
              }}
              onClick={resetCanvas}
            >
              <img
                src={reset}
                style={{
                  width: "20px", // 이미지 크기 조정
                  height: "20px",
                }}
              />
            </Button>
            <Button variant="contained" color="secondary" onClick={saveCanvas}>
              Save
            </Button>
          </ButtonGroup>
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              border: "1px solid rgba(0,0,0,0.1)",
              display: "black",
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </Box>
      </Grid2>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent sx={{ minWidth: "400px", minHeight: "50px" }}>
          제출하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              resumeTimer();
              setOpen(false);
            }}
            sx={{ color: "red" }}
          >
            아니요
          </Button>
          <Button onClick={onSubmit}>네</Button>
        </DialogActions>
      </Dialog>
    </Grid2>
  );
};

export default Test;
