import axios from "axios";
import dotenv from ".env";

dotenv.config();

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default API;
