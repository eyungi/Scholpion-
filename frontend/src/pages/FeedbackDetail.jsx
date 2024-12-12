import {
  Button,
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Stack,
  Avatar, TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import ContentRenderer from "../ContentRender.jsx";
import {fetchFeedbackDetail, updateFeedback} from "../apis/feedback.js";
import * as React from "react";

const Review = () => {
  const params = useParams();
  const [reviewData, setReviewData] = useState({});
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const [dialogSeq, setDialogSeq] = useState(1);
  const [problem, setProblem] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const dataset = await fetchFeedbackDetail(params.id);
        setReviewData(dataset);
      } catch (error) {
        setError(err.message || "데이터를 가져오지 못했습니다");
      }
    })();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
  };

  const formatDateTime2 = (dateTimeString) => {
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}년 ${month}월 ${day}`;
  };

  useEffect(() => {
    if (open && dialogSeq > 0) {
      const fetchProblemData = async () => {
        try {
          setLoading(true); // 로딩 시작
          setError(null); // 이전 에러 초기화
          const probId = reviewData?.problems?.[dialogSeq - 1]?.prob;
          if (!probId) {
            setError("문제 ID를 찾을 수 없습니다.");
            setLoading(false);
            return;
          }

          const res = await axiosInstance.get(
            `/exams/${reviewData.exam_obj.exam_id}/problems/${probId}/`
          );
          setProblem(res.data);
        } catch (error) {
          setError("문제 데이터를 가져오는 데 실패했습니다.");
          console.error("Error fetching problem data:", error);
        } finally {
          setLoading(false); // 로딩 종료
        }
      };

      fetchProblemData();
    }
  }, [dialogSeq, open]);

  const handleUpdateFeedback = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(formData.get("feedback"));
    try {
      await updateFeedback(params.id, formData.get("feedback"));
      setDialogText("성공적으로 반영됐습니다.");
    } catch (error) {
      setDialogText("요청 실패, 다시 시도해주세요.");
    }
    setDialogOpen(true);
    return false;
  }

  return (
    <div>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          borderLeft: "2px solid rgba(0, 0, 0, 0.1)", // 왼쪽 선
          borderRight: "2px solid rgba(0, 0, 0, 0.1)", // 오른쪽 선
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            padding: "16px",
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Typography variant="h5" sx={{ mb: "20px" }}>
            {`${formatDateTime2(reviewData.solved_at)} 시험2`}
          </Typography>
          <Box sx={{ mb: "10px" }}>
            <Typography>{"테스트 : 시험2"}</Typography>
            <Typography>{`응시 날짜 : ${formatDateTime(
              reviewData.solved_at
            )}`}</Typography>
            <Typography>{`걸린 시간 : ${reviewData.time}`}</Typography>
            <Typography>{`점수 : ${reviewData.score}`}</Typography>
            <Typography>{`피드백 : ${reviewData.feedback !== null ? "완료" : "미완"}`}</Typography>
          </Box>
          <TableContainer>
            <Table sx={{ minWidth: 650, mt: "15px" }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell align="right">학생 응답</TableCell>
                  <TableCell align="right">정답</TableCell>
                  <TableCell align="right">정답 여부</TableCell>
                  <TableCell align="right">걸린 시간</TableCell>
                  <TableCell align="right">액션 수</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviewData.problems &&
                  [...reviewData.problems]
                    .sort((a, b) => a.seq - b.seq) // seq를 기준으로 오름차순 정렬
                    .map((prob, idx) => (
                      <TableRow key={idx}>
                        <TableCell scope="row">{idx + 1}</TableCell>
                        <TableCell align="right">
                          {prob.response || "응답 없음"}
                        </TableCell>
                        <TableCell align="right">
                          {prob.answer || "정답 없음"}
                        </TableCell>
                        <TableCell align="right">
                          {prob.correctness ? "예" : "아니오"}
                        </TableCell>
                        <TableCell  align="right">{prob.time}초</TableCell>
                        <TableCell align="right">{reviewData.logs.filter(item => item.prob_seq === idx + 1).length}</TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setDialogSeq(idx + 1);
                            setOpen(true);
                            // onOpenDialog();
                          }}
                        >
                          상세보기
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 4}}>
            <Typography>피드백 남기기</Typography>
            <form onSubmit={handleUpdateFeedback}>
              <TextField defaultValue={reviewData.feedback} name="feedback" multiline rows={10} sx={{ width: "100%", mt: 1 }}></TextField>
              <Button type="submit" variant="contained" sx={{ mt: 1 }}>저장</Button>
            </form>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <Button
            variant="contained"
            sx={{
              minWidth: "400px",
              backgroundColor: "#f1f3f4",
              color: "gray",
            }}
            onClick={() => nav("/feedbacks")}
          >
            결과 리스트로 돌아가기
          </Button>
        </Box>
        <Dialog fullWidth maxWidth="md" open={open} onClose={() => setOpen(false)}>
          <DialogTitle>{dialogSeq}번문제</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Container sx={{paddingLeft: "0!important", flex: "2!important"}}>
              <Box
                sx={{
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  p: "10px",
                }}
              >
                <ContentRenderer content={problem.question} />
              </Box>
              {problem.options && problem.options.length > 0 ? (
                <Stack spacing={2.5} sx={{ mt: "10px" }}>
                  {problem.options.map((item) => (
                    <Box
                      sx={{
                        justifyContent: "flex-start",
                        display: "flex",
                        fontSize: "14px",
                        alignItems: "center",
                        color: "black",
                      }}
                      key={item.option_seq}
                    >
                      <Avatar
                        sx={{
                          width: 18,
                          height: 18,
                          margin: "6px",
                          marginRight: "12px",
                          backgroundColor: "white",
                          color: "black",
                          border: "2px solid black",
                        }}
                      >
                        {item.option_seq}
                      </Avatar>
                      <div dangerouslySetInnerHTML={{__html: item.option_text}} />
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ mt: "10px" }}>
                  <Typography>주관식입니다</Typography>
                </Box>
              )}
              <Box mt={1}>
                <Typography>연습장</Typography>
                <img width="100%" src={reviewData.problems && reviewData.problems[dialogSeq - 1] && reviewData.problems[dialogSeq - 1].solution}/>
              </Box>
            </Container>
            <Container sx={{ flex: "1!important"}}>
              <Typography variant="h5">액션 로그</Typography>
              <ul style={{ padding: "8px", marginTop: 0, height: "100%" }}>
                {reviewData.logs && reviewData.logs.filter(item => item.prob_seq === dialogSeq).map(item => (
                    <li key={item.timestamp} style={{ marginTop: "8px", marginBottom: "8px"}}>
                      <div>{item.action}</div>
                      <div>{new Date(parseInt(item.timestamp)).toLocaleString()}</div>
                    </li>
                ))}
              </ul>
            </Container>
          </DialogContent>
        </Dialog>
      </Container>
      <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
        <DialogTitle id="alert-dialog-title">
          정보
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Review;
