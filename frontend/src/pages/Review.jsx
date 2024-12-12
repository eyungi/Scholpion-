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
  Avatar,
} from "@mui/material";
import tableData from "../MockTableData";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import ContentRenderer from "../ContentRender.jsx";
import * as React from "react";

const Review = () => {
  const params = useParams();
  const [reviewData, setReviewData] = useState({});
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const [dialogSeq, setDialogSeq] = useState(1);
  const [error, setError] = useState(false);
  const [problem, setProblem] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getReviewData = async () => {
      try {
        const response = await axiosInstance.get(`/solved-exams/${params.id}/`);
        console.log(response.data);
        setReviewData(response.data);
      } catch (error) {
        setError(err.message || "데이터를 가져오지 못했습니다");
      }
    };
    getReviewData();
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

  const total_time = reviewData.problems && reviewData.problems.reduce((acc, cur) => acc + cur.time, 0);

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
            <Typography>{`걸린 시간 : ${(total_time / 60).toFixed()}분 ${(total_time % 60).toFixed()}초`}</Typography>
            <Typography>{`점수 : ${reviewData.score}`}</Typography>
            <Typography>{`피드백 : ${reviewData.feedback !== null ? "완료" : "미완"}`}</Typography>
          </Box>
          <Box sx={{mt: 1}}>
            <hr/>
            <Typography variant="h6">피드백</Typography>
            <Typography>{reviewData.feedback}</Typography>
            <hr/>
          </Box>
          <TableContainer>
            <Table sx={{ minWidth: 650, mt: "15px" }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell align="right">내 응답</TableCell>
                  <TableCell align="right">정답</TableCell>
                  <TableCell align="right">정답 여부</TableCell>
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
          <Box sx={{ mt: "30px" }}>
            <Stack spacing={1} sx={{ mt: "10px" }}>
              {reviewData.comments && Array.isArray(reviewData.comments) ? (
                reviewData.comments.map((item) => (
                  <Box key={item.comment_id}>
                    <h3>코멘트</h3>
                    <Typography sx={{ mb: "5px" }}>현우진 선생님</Typography>
                    <Typography sx={{ whiteSpace: "pre-line" }}>
                      {item.content}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>코멘트가 없습니다.</Typography>
              )}
            </Stack>
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
            onClick={() => nav("/resultlist")}
          >
            결과 리스트로 돌아가기
          </Button>
        </Box>
        <Dialog fullWidth maxWidth="md" open={open} onClose={() => setOpen(false)}>
          <DialogTitle>{dialogSeq}번문제</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              minWidth: "550px",
              minHeight: "300px",
            }}
          >
            <Container sx={{ display: "flex", flexDirection: "row" }}>
              <Container sx={{paddingLeft: "0!important", flex: 2}}>
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
                            <div dangerouslySetInnerHTML={{ __html: item.option_text }} />
                          </Box>
                      ))}
                    </Stack>
                ) : (
                    <Box sx={{ mt: "10px" }}>
                      <Typography>주관식입니다</Typography>
                    </Box>
                )}
              </Container>
              <Container sx={{ marginTop: "8px", padding: "0!important", flex: 1 }}>
                <Stack sx={{ mt: "10px", display: "flex" }}>
                  <Box>
                    <Typography sx={{backgroundColor: "black", color: "white", padding: "4px", whiteSpace: "nowrap"}}>내 응답</Typography>
                    <Typography>
                      {reviewData.problems && reviewData.problems[dialogSeq - 1] && reviewData.problems[dialogSeq - 1].response
                          ? reviewData.problems[dialogSeq - 1].response
                          : "응답 없음"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{backgroundColor: "black", color: "white", padding: "4px", whiteSpace: "nowrap"}}>정답</Typography>
                    <Typography>
                      {reviewData.problems && reviewData.problems[dialogSeq - 1] && reviewData.problems[dialogSeq - 1].answer
                          ? reviewData.problems[dialogSeq - 1].answer
                          : "응답 없음"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{backgroundColor: "black", color: "white", padding: "4px"}}>정답 여부(정답률)</Typography>
                    <Typography>
                      {reviewData.problems && reviewData.problems[dialogSeq - 1]
                          ? reviewData.problems[dialogSeq - 1].correctness
                              ? "예"
                              : "아니오"
                          : "데이터 없음"}({(reviewData.problems && reviewData.problems[dialogSeq - 1].correct_rate * 100).toFixed(2)}%)
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{backgroundColor: "black", color: "white", padding: "4px"}}>소요 시간(평균 시간)</Typography>
                    <Typography>{reviewData.problems && dialogSeq > 0 ? reviewData.problems[dialogSeq - 1].time : 0}초({(reviewData.problems && dialogSeq > 0 ? reviewData.problems[dialogSeq - 1].average_time : 0).toFixed(2)}초)</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{backgroundColor: "black", color: "white", padding: "4px"}}>액션(평균 횟수)</Typography>
                    <Typography>{reviewData.logs && reviewData.logs.filter(item => item.prob_seq === dialogSeq).length}번({(reviewData.problems && dialogSeq > 0 ? reviewData.problems[dialogSeq - 1].average_actions : 0).toFixed(2)}번)</Typography>
                  </Box>
                </Stack>
              </Container>
            </Container>
            <Container>
              <img width="100%" src={reviewData.problems && reviewData.problems[dialogSeq - 1] && reviewData.problems[dialogSeq - 1].solution}/>
            </Container>
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
};

export default Review;
