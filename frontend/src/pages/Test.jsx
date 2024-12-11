import { useParams, useNavigate } from "react-router-dom";
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
  TextField,
  ButtonGroup,
} from "@mui/material";
import ContentRenderer from "../ContentRender";

import eraser from "../assets/eraser.png";
import pencil from "../assets/pencil.png";
import reset from "../assets/reset.png";
import axiosInstance from "../axiosInstance";

const Test = () => {
  //문제관련
  const params = useParams();
  const [number, setNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const [answer, setAnswer] = useState("");
  const [answerSheet, setAnswerSheet] = useState({
    exam: "",
    time: "",
    problems: [],
  });
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
  const canvasRef = useRef([]);
  const isDrawingRef = useRef(false);
  const [isEraserActive, setIsEraserActive] = useState(false);

  const examId = params.id;

  useEffect(() => {
    const getProblems = async () => {
      try {
        setLoad(true);
        const response = await axiosInstance.get(
          `/exams/${params.id}/problems`
        );
        setProblems(response.data);

        const initialProblems = response.data.map((problem) => ({
          prob: problem.prob_id,
          response: "",
          solution: "", // 초기 캔버스 데이터를 비워둠
        }));
        const updatedAnswerSheet = {
          exam: params.id,
          time: "",
          problems: initialProblems,
        };

        console.log("초기화된 answerSheet:", updatedAnswerSheet);
        setAnswerSheet(updatedAnswerSheet);
        console.log("문제들", response.data);
      } catch (error) {
        setError(err.message || "데이터를 가져오지 못했습니다");
      } finally {
        setLoad(false);
      }
    };

    getProblems();
  }, []);

  useEffect(() => {
    const initializeCanvas = (canvas, index) => {
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const isCanvasEmpty = () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return imageData.data.every((value, idx) => {
          if ((idx + 1) % 4 === 0) return value === 0; // Alpha 값만 확인
          return true;
        });
      };

      if (isCanvasEmpty()) {
        // 캔버스 초기화 및 스타일 설정
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        // ctx.fillStyle = "#ffffff";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
      }
    };

    //각 캔버스에 대해 초기화
    // canvasRef.current.forEach((canvas, index) => {
    //   initializeCanvas(canvas, index);
    // });
    const currentCanvas = canvasRef.current[number - 1];
    if (currentCanvas) {
      initializeCanvas(currentCanvas);
    }
  }, [problems, number]);

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

  const problemId = problem?.prob_id;

  const onClickNext = () => {
    setAnswer("");
    setNumber((prev) => prev + 1);
    console.log("onClickNext-answerSheet : ", answerSheet);
  };

  const onChangeAnswer = (updatedAnswer) => {
    setAnswerSheet((prevAnswerSheet) => {
      const updatedProblems = [...prevAnswerSheet.problems];

      if (updatedProblems[number - 1]) {
        updatedProblems[number - 1].response = updatedAnswer;
      }

      return {
        ...prevAnswerSheet,
        problems: updatedProblems,
      };
    });
  };

  const onSubmit = () => {
    const updatedProblems = [...answerSheet.problems];

    canvasRef.current.forEach((canvas, index) => {
      if (canvas) {
        const solutionImg = canvas.toDataURL("image/png");
        updatedProblems[index].solution = solutionImg;

        //초기화
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.fillStyle = "#ffffff";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    });

    const formattedTime = `${String(hour).padStart(2, "0")}:${String(
      min
    ).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

    const updatedAnswerSheet = {
      ...answerSheet,
      time: formattedTime,
      problems: updatedProblems,
    };

    console.log("제출", updatedAnswerSheet);
    axiosInstance.post("/solved-exams/", updatedAnswerSheet);
    nav("/done");
  };

  if (!problem || !problem.options) {
    return <div>현재 문제를 찾을 수 없습니다.</div>;
  }

  //풀이 메모장 관련
  const startDrawing = (e) => {
    const canvas = canvasRef.current[number - 1];
    const ctx = canvas?.getContext("2d");
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
    const canvas = canvasRef.current[number - 1];
    if (!canvas) return;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    if (isEraserActive) {
      ctx.clearRect(
        e.nativeEvent.offsetX - 10,
        e.nativeEvent.offsetY - 10,
        30,
        30
      );
    } else {
      ctx.strokeStyle = "black";
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current[number - 1];
    const ctx = canvas?.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "#ffffff";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
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
            {/* <Typography>{problem.question}</Typography> */}
            <ContentRenderer content={problem.question} />
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
                    color: answer === item.option_seq ? "white" : "black",
                    "&:focus": {
                      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
                    },
                    backgroundColor: answer === item.option_seq ? "black" : "inherit",
                  }}
                  key={item.option_seq}
                  onClick={() => {
                    const updatedAnswer = item.option_seq;
                    if (answer === updatedAnswer) {
                      setAnswer(""); // 답변 업데이트
                    } else {
                      setAnswer(updatedAnswer); // 답변 업데이트
                    }
                    onChangeAnswer(updatedAnswer); // `answerSheet` 업데이트
                  }}
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
                onChange={(e) => {
                  const updatedAnswer = e.target.value;
                  setAnswer(updatedAnswer);
                  onChangeAnswer(updatedAnswer);
                }}
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
                minWidth: "30px",
                height: "30px",
              }}
            >
              <img
                src={isEraserActive ? pencil : eraser}
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
            </Button>
            <Button
              variant="contained"
              color="white"
              sx={{
                padding: "10px",
                minWidth: "30px",
                height: "30px",
              }}
              onClick={resetCanvas}
            >
              <img
                src={reset}
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
            </Button>
          </ButtonGroup>
          {problems.map((_, index) => (
            <canvas
              key={index}
              ref={(el) => {
                if (el) {
                  canvasRef.current[index] = el;
                }
              }}
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid rgba(0,0,0,0.1)",
                display: number === index + 1 ? "block" : "none", // 현재 문제에만 캔버스 표시
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          ))}
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
