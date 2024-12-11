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
