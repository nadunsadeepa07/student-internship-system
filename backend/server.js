const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");

/* =========================================
   EXPRESS APP
========================================= */

const app = express();

/* =========================================
   ROUTES
========================================= */

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const commentRoutes = require("./routes/commentRoutes");
const cvRoutes = require("./routes/cvRoutes");

const adminAuthRoutes = require("./routes/adminAuthRoutes");
const adminRoutes = require("./routes/adminRoutes");

const applicationRoutes = require("./routes/applicationRoutes");
const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

/* =========================================
   CORS
========================================= */

const allowedOrigins = [
  "http://localhost:3000",

  // Production Frontend
  "https://student-internship-system-ta8h.vercel.app",

  // If you later use the default Vercel domain
  "https://student-internship-system.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Postman / Server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked Origin:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

/* =========================================
   BODY PARSER
========================================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================================
   DATABASE CONNECTION MIDDLEWARE
   Waits for a ready MongoDB connection before
   any route handler runs. Prevents the Mongoose
   "buffering timed out" error on serverless cold starts.
========================================= */

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

/* =========================================
   STATIC FILES
========================================= */

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

/* =========================================
   API ROUTES
========================================= */

app.use("/api", authRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/cv", cvRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/admin", adminAuthRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/student", studentRoutes);

app.use("/api/company", companyRoutes);

/* =========================================
   HOME ROUTE
========================================= */

app.get("/", (req, res) => {
  res.send("Internship Management System API Running");
});

/* =========================================
   404
========================================= */

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================
   ERROR HANDLER
========================================= */

app.use((err, req, res, next) => {

  console.error(err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });

});

module.exports = app;