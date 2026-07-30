import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles}from "lucide-react";
import "../styles/Testimonials.css";


function Testimonials() {
  const [index, setIndex] = useState(0);

  // MongoDB Comments
  const [comments, setComments] = useState([]);

  // Form States
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);

  // Static Testimonials
  const [slides] = useState([
    {
      name: "Nadun (Student)",
      stars: "★★★★★",
      text: "SIMS helped me easily find internships and track my applications. Amazing experience!"
    },
    {
      name: "HR Manager",
      stars: "★★★★★",
      text: "We reduced hiring time by 60% using SIMS. Highly recommended for companies."
    },
    {
      name: "University Admin",
      stars: "★★★★☆",
      text: "Great system for monitoring student internship progress and reports."
    },
    {
      name: "Designer Intern",
      stars: "★★★★★",
      text: "The platform is smooth, modern, and very easy to use!"
    }
  ]);

  // Load Comments From MongoDB
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/comments"
      );

      setComments(res.data);

    } catch (error) {
      console.log("Error loading comments", error);
    }
  };

  // Auto Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);

  }, [slides.length]);

  // Slider Controls
  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Stars
  const getStars = (count) => {
    return "★".repeat(count) + "☆".repeat(5 - count);
  };

  // Submit Comment
  const addComment = async () => {

    if (!name.trim() || !message.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {

      const payload = {
        name,
        message,
        rating
      };

      const res = await axios.post(
        "http://localhost:5000/api/comments",
        payload
      );

      // Add new comment instantly
      setComments([res.data, ...comments]);

      // Clear form
      setName("");
      setMessage("");
      setRating(5);

      alert("Comment Added Successfully");

    } catch (error) {
      console.log(error);
      alert("Failed to add comment");
    }
  };

  return (
    <div>

      {/* NAVBAR */}
      <nav>
        

        <div className="logo-section">
          <div className="logo-box">
            <Sparkles size={24} />
          </div>
          <div className="logo">
          SIMS <span>Portal</span>
        </div>
            
        </div>

        <div className="nav-links">
          <a href="/">Home</a>
          
        </div>
      </nav>

      {/* HERO */}
      <section className="testimonial-hero">
      <div className="testimonial-hero-content">
        <h1>User Testimonials</h1>

        <p>
          See how SIMS is transforming internship experiences
        </p>
      </div>
    </section>

      {/* SLIDER */}
      <div className="slider">

        <div
          className="slides"
          style={{
            display: "flex",
            transform: `translateX(-${index * 340}px)`,
            transition: "0.5s ease"
          }}
        >

          {slides.map((item, i) => (

            <div className="card" key={i}>

              <h3>{item.name}</h3>

              <div className="stars">
                {item.stars}
              </div>

              <p>{item.text}</p>

            </div>

          ))}

        </div>

      </div>

      {/* CONTROLS */}
      <div className="controls">

        <button onClick={prevSlide}>
          ⬅
        </button>

        <button onClick={nextSlide}>
          ➡
        </button>

      </div>

      {/* FEATURES */}
      <section className="grid">

        <div className="grid-card">

          <h3>Fast Applications</h3>

          <p>
            Students apply in seconds with a single click.
          </p>

        </div>

        <div className="grid-card">

          <h3>Better Hiring</h3>

          <p>
            Companies find the best candidates quickly.
          </p>

        </div>

        <div className="grid-card">

          <h3>Smart Tracking</h3>

          <p>
            Track internship progress easily.
          </p>

        </div>

      </section>

      {/* COMMENTS */}
      <section className="comments-section modern-comments">

  <div className="comments-header">
    <h2>What People Think</h2>
    <p>Share your experience about SIMS Platform</p>
  </div>

  {/* FORM CARD */}
  <div className="comment-form modern-form">

    <input
      type="text"
      placeholder="Your Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <textarea
      placeholder="Write your feedback..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />

    {/* STAR RATING */}
    <div className="rating-box">

      <p>Rate this experience</p>

      <div className="rating-stars modern-stars">

        {[1, 2, 3, 4, 5].map((star) => (

          <span
            key={star}
            onClick={() => setRating(star)}
            className={`star ${star <= rating ? "active" : ""}`}
          >
            ★
          </span>

        ))}

      </div>

    </div>

    <button className="submit-btn" onClick={addComment}>
      Post Comment
    </button>

  </div>

  {/* COMMENTS LIST */}
  <div className="comment-list modern-list">

    {comments.length === 0 ? (
      <p className="empty-text">No comments yet</p>
    ) : (

      comments.map((c) => (

        <div key={c._id} className="comment-card modern-card">

          {/* HEADER */}
          <div className="comment-top">

            <div className="avatar">
              {c.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              
              <h1><span className="time">{c.name}</span></h1>
            </div>

          </div>

          {/* STARS */}
          <div className="comment-starss">
            {getStars(c.rating || 5)}
          </div>

          {/* MESSAGE */}
          <p className="comment-text">
            {c.message}
          </p>

        </div>

      ))

    )}

  </div>

</section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">

          <div>
            <h3>InternHub</h3>
            <p>
              Advanced Internship Management Platform
              for students and companies.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <a href="/">Home</a>
            <a href="/student-dashboard">Student</a>
            <a href="/company-dashboard">Company</a>
          </div>

          <div>
            <h4>Contact</h4>
            <p>support@internhub.com</p>
            <p>+94 77 123 4567</p>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 Internship Management System.
          All Rights Reserved.
        </div>
      </footer>;

    </div>
  );
}

export default Testimonials;