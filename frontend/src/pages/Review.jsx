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
import reviewData from "../MockReviewData";
import tableData from "../MockTableData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const problem = {
  //1번문제
  type: 0, // type 0 : 객관식 , type 1 : 단답식
  number: 1,
  content: "A = 10, B = 20, A+B = ?",
  selection: [
    { number: 1, answer: 30 },
    { number: 2, answer: 40 },
    { number: 3, answer: 10 },
    { number: 4, answer: 100 },
  ],
};

/*
const problem = {
        //2번문제
        type: 1,
        number: 2,
        content: "A = 256, B = 1/2, A**B= ?",
      }
*/
const Review = () => {
  const examExplanation = "2024-11-05 레벨테스트";
  const submitDate = "2024-11-06";
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const [dialogSeq, setDialogSeq] = useState(0);

  return (
    <div>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
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
            {examExplanation}
          </Typography>
          <Box sx={{ mb: "10px" }}>
            <Typography>테스트 : 수학2</Typography>
            <Typography>{`응시 날짜 : ${submitDate}`}</Typography>
            <Typography>{`걸린 시간 : ${reviewData.time}`}</Typography>
            <Typography>{`점수 : ${reviewData.score}`}</Typography>
            <Typography>{`피드백 : ${reviewData.feedback}`}</Typography>
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
                {tableData.map((row) => (
                  <TableRow key={row.seq}>
                    <TableCell scope="row">{row.seq}</TableCell>
                    <TableCell align="right">{row.myAnswer}</TableCell>
                    <TableCell align="right">{row.answer}</TableCell>
                    <TableCell align="right">
                      {row.correctness ? "예" : "아니오"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setDialogSeq(row.seq);
                        setOpen(true);
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
            <h3>
              {reviewData.comments.type === "teacher" ? "선생님" : "학생"}{" "}
              코멘트
            </h3>
            <Typography sx={{ mb: "5px" }}>
              {reviewData.comments.name}{" "}
              {reviewData.comments.type === "teacher" ? "선생님" : "학생"}
            </Typography>
            <Typography sx={{ whiteSpace: "pre-line" }}>
              {reviewData.comments.content}
            </Typography>
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
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>{dialogSeq}번문제</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              minWidth: "550px",
              minHeight: "300px",
            }}
          >
            <Container sx={{ width: "75%" }}>
              <Box
                sx={{
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  p: "10px",
                }}
              >
                <Typography>{problem.content}</Typography>
              </Box>
              {problem.selection && problem.selection.length > 0 ? (
                <Stack spacing={2.5} sx={{ mt: "10px" }}>
                  {problem.selection.map((item) => (
                    <Box
                      sx={{
                        justifyContent: "flex-start",
                        display: "flex",
                        fontSize: "20px",
                        alignItems: "center",
                        color: "black",
                      }}
                      key={item.number}
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
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ mt: "10px" }}>
                  <Typography>주관식입니다</Typography>
                </Box>
              )}
            </Container>
            <Box>
              <Stack spacing={0.5} sx={{ mt: "10px" }}>
                <Typography>내응답</Typography>
                <Typography>1</Typography>
                <Typography>정답</Typography>
                <Typography>1</Typography>
                <Typography>정답 여부(정답률)</Typography>
                <Typography>예 (53%)</Typography>
                <Typography>소요 시간 (평균)</Typography>
                <Typography>2분 (1분)</Typography>
                <Typography>액션 (평균)</Typography>
                <Typography>10번 (3번)</Typography>
              </Stack>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
};

export default Review;
