import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

// 🔹 Interceptor to automatically refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 403) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const res = await axios.post("http://localhost:5002", { refreshToken });
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);

          error.config.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
          return axiosInstance.request(error.config);
        } catch (err) {
          console.log("Refresh token expired, logging out");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// 🔹 Attach token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
