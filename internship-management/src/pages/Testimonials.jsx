import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles, Moon, Sun } from "lucide-react";
import "../styles/Testimonials.css";

function Testimonials() {
  // ---------- STATE ----------
  const [index, setIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [darkMode, setDarkMode] = useState(false);

  // Static slides
  const slides = [
    {
      name: "Nadun (Student)",
      stars: 5,
      text: "SIMS helped me easily find internships and track my applications. Amazing experience!",
    },
    {
      name: "HR Manager",
      stars: 5,
      text: "We reduced hiring time by 60% using SIMS. Highly recommended for companies.",
    },
    {
      name: "University Admin",
      stars: 4,
      text: "Great system for monitoring student internship progress and reports.",
    },
    {
      name: "Designer Intern",
      stars: 5,
      text: "The platform is smooth, modern, and very easy to use!",
    },
  ];

  // ---------- THEME (dark mode) ----------
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = stored ? stored === "dark" : prefersDark;
    setDarkMode(initialDark);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // ---------- FETCH COMMENTS ----------
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        "https://student-internship-system.vercel.app/api/comments"
      );
      setComments(res.data);
    } catch (error) {
      console.log("Error loading comments", error);
    }
  };

  // ---------- SLIDER AUTO-PLAY ----------
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // ---------- STARS HELPERS ----------
  const getStars = (count) => {
    return "★".repeat(count) + "☆".repeat(5 - count);
  };

  // ---------- ADD COMMENT ----------
  const addComment = async () => {
    if (!name.trim() || !message.trim()) {
      alert("Please fill all fields");
      return;
    }
    try {
      const payload = { name, message, rating };
      const res = await axios.post(
        "https://student-internship-system.vercel.app/api/comments",
        payload
      );
      setComments([res.data, ...comments]);
      setName("");
      setMessage("");
      setRating(5);
      alert("Comment Added Successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to add comment");
    }
  };

  // ---------- RENDER ----------
  return (
    <div className={`testimonials-page ${darkMode ? "dark" : ""}`}>
      {/* ===== NAVBAR ===== */}
      <nav className="testimonial-nav">
        <div className="logo-section">
          <div className="logo-box">
            <Sparkles size={24} />
          </div>
          <div className="logo">
            SIMS <span>Portal</span>
          </div>
        </div>

        <div className="nav-actions">
          <a href="/" className="nav-link">Home</a>
          <button
            className="theme-toggle-btn"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="testimonial-hero">
        <div className="hero-content">
          <h1>User Testimonials</h1>
          <p>See how SIMS is transforming internship experiences</p>
        </div>
      </section>

      {/* ===== SLIDER ===== */}
      <div className="slider-wrapper">
        <div className="slider-container">
          <div
            className="slider-track"
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            {slides.map((item, i) => (
              <div className="slide-card" key={i}>
                <h3>{item.name}</h3>
                <div className="stars">{getStars(item.stars)}</div>
                <p>"{item.text}"</p>
              </div>
            ))}
          </div>
        </div>

        <div className="slider-controls">
          <button className="slider-btn prev" onClick={prevSlide}>
            ‹
          </button>
          <button className="slider-btn next" onClick={nextSlide}>
            ›
          </button>
        </div>

        {/* Dots indicator */}
        <div className="dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* ===== FEATURES GRID ===== */}
      <section className="features-grid">
        <div className="feature-card">
          <h3>Fast Applications</h3>
          <p>Students apply in seconds with a single click.</p>
        </div>
        <div className="feature-card">
          <h3>Better Hiring</h3>
          <p>Companies find the best candidates quickly.</p>
        </div>
        <div className="feature-card">
          <h3>Smart Tracking</h3>
          <p>Track internship progress easily.</p>
        </div>
      </section>

      {/* ===== COMMENTS SECTION ===== */}
      <section className="comments-section">
        <div className="comments-header">
          <h2>What People Think</h2>
          <p>Share your experience about SIMS Platform</p>
        </div>

        {/* Form */}
        <div className="comment-form">
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
          <div className="rating-box">
            <p>Rate this experience</p>
            <div className="rating-stars">
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

        {/* Comments list */}
        <div className="comment-list">
          {comments.length === 0 ? (
            <p className="empty-text">No comments yet. Be the first!</p>
          ) : (
            comments.map((c) => (
              <div className="comment-card" key={c._id}>
                <div className="comment-top">
                  <div className="avatar">{c.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <h4>{c.name}</h4>
                    <span className="time">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="comment-stars">{getStars(c.rating || 5)}</div>
                <p className="comment-text">{c.message}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>InternHub</h3>
            <p>
              Advanced Internship Management Platform for students and
              companies.
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
          © 2026 Internship Management System. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default Testimonials;