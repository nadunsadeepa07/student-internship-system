import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api",
});