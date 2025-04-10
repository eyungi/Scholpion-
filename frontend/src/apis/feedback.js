import axios from "../axiosInstance";

export const fetchFeedbackList = async () => {
    const response = await axios.get("/feedbacks/");
    return response.data;
}

export const fetchFeedbackDetail = async (uid) => {
    const response = await axios.get(`/feedbacks/${uid}/`);
    return response.data;
}

export const updateFeedback = async (uid, feedback) => {
    return await axios.patch(`/feedbacks/${uid}/`, {feedback: feedback});
}