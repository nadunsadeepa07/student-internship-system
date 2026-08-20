import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import InternshipSearch from "./pages/InternshipSearch";
import Testimonials from "./pages/Testimonials";
import StudentDashboard from "./pages/StudentDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import Apply from "./pages/Apply";
import Login from "./pages/Login";
import JobDetails from "./pages/JobDetails";
import CVBuilder from "./pages/cvbuilder";


import AdminDashboard from "./pages/AdminDashboard";
import SharedCVPage from "./pages/SharedCVPage";
import WaitingApproval from "./pages/WaitingApproval";
import AdminLoginPage from "./pages/AdminLoginPage";





function App() {
   const [chatOpen, setChatOpen] = useState(false);
  return (
   
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<InternshipSearch />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/login" element={<Login />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/cvbuilder" element={<CVBuilder />} />
         
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/shared-cv/:token" element={<SharedCVPage />} />
          <Route path="/waiting" element={<WaitingApproval />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
        

        </Routes>
      </Router>
    
  );
}

export default App;