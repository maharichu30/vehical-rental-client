import axios from "axios";
import dotenv from ".env";

dotenv.config();

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// ✅ Add this also (token auto attach)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;