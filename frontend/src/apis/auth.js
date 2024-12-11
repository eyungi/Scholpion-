import axiosInstance from "../axiosInstance.jsx";

export const createUser = (payload) => {
    return axiosInstance.post("/users/register/", payload);
}