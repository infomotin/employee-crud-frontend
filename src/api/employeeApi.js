import axios from "axios";

const api = axios.create({
  baseURL: "http://172.16.108.66:8000/api", // Your Laravel API
});

export default api;
