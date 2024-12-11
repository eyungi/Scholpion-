import {Box, Button, Container, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchFeedbackList} from "../apis/feedback";

const FeedbackList = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        (async () => {
            const dataset = await fetchFeedbackList();
            setFeedbacks(dataset);
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

    return (
        <Container
            maxWidth="md"
            sx={{ display: "flex", flexDirection: "column", paddingY: "8px" }}
        >
            <Box
                sx={{
                    backgroundColor: "white",
                    height: "85vh",
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
                    피드백할 결과를 선택해주세요
                </Typography>
                <Stack spacing={2} sx={{ mt: "20px" }}>
                    {feedbacks.map((item) => (
                        <Button
                            variant="contained"
                            sx={{
                                maxWidth: "800px",
                                minHeight: "90px",
                                fontSize: "25px",
                                backgroundColor: "white",
                                color: "black",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                            key={item.solved_exam_id}
                            onClick={() => {
                                navigate(`/feedbacks/${item.solved_exam_id}`);
                            }}
                        >
                            <Box sx={{ textAlign: "left" }}>
                                <Typography variant="h5">{item.exam_obj.exam_name}</Typography>
                                <Typography variant="body1">{item.exam_obj.exam_name}</Typography>
                                <Typography fontSize={"13px"}>
                                    {item.feedback ? formatDateTime(item.solved_at) : null}
                                </Typography>
                            </Box>
                            <Typography
                                fontSize={"13px"}
                                sx={{
                                    color: item.feedback ? "green" : "red",
                                }}
                            >
                                {item.feedback ? "평가 완료" : "평가 이전"}
                            </Typography>
                        </Button>
                    ))}
                </Stack>
            </Box>
            <Button
                variant="contained"
                sx={{
                    mt: "20px",
                    backgroundColor: "#f1f3f4",
                    color: "gray",
                    minWidth: "400px",
                    alignSelf: "center",
                }}
                onClick={() => navigate("/")}
            >
                홈으로
            </Button>
        </Container>
    );
}

export default FeedbackList;
