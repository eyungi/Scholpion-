import axios from "axios";
import Cookies from "js-cookie";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // Replace with your API base URL
  withCredentials: true, // Send cookies with requests
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) {
      throw new Error("Not Authorized");
    }

    const response = await axiosInstance.post(
      "/users/token/refresh/", // Replace with your refresh token endpoint
      { refresh: refreshToken }
    );

    const { access } = response.data;
    Cookies.set("access_token", access, {
      expires: 1, // Set to match your token's expiration
      secure: window.location.protocol === "https:",
      sameSite: "Strict",
      path: "/",
    });

    return access;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

// Interceptor for handling responses
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses directly
  async (error) => {
    const originalRequest = error.config;

    // Check if the error status is 401 (Unauthorized) and the request has not already been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent retry loops

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // Retry the original request with new token
      } catch (err) {
        console.error("Token refresh failed:", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error); // Pass other errors through
  }
);

// Request interceptor to attach the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
