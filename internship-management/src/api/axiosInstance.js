import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api",
  timeout: 10000,
});

export default api;