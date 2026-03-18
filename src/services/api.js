import axios from "axios"

const API = axios.create({
  baseURL: "https://vehical-rental-server.onrender.com/api"
})

// 🔥 AUTO TOKEN ATTACH
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default API