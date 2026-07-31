import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://student-internship-system.vercel.app/api",
});