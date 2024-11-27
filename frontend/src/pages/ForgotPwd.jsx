import { useEffect, useRef, useState } from "react";
import { Grid2, Box, Button, ButtonGroup } from "@mui/material";
import eraser from "../assets/eraser.png";
import pencil from "../assets/pencil.png";
import reset from "../assets/reset.png";

const ForgotPwd = () => {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [isEraserActive, setIsEraserActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
  }, []);

  const startDrawing = (e) => {
    isDrawingRef.current = true;
    const ctx = canvasRef.current.getContext("2d");
    if (!isEraserActive) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
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
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 초기화
    ctx.fillStyle = "#ffffff"; // 배경색 다시 설정
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const toggleEraser = () => {
    setIsEraserActive((prev) => !prev); // 지우개 활성화/비활성화 토글
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
      ></Grid2>
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
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default ForgotPwd;
