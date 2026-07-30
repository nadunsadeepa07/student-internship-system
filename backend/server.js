const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");


dotenv.config();

/* =========================================
   ENVIRONMENT VARIABLES
========================================= */



const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:3000";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/internshipDB";

/* =========================================
   EXPRESS APP
========================================= */

const app = express();




/* =========================================
   ROUTES
========================================= */

const authRoutes =
  require("./routes/authRoutes");

const jobRoutes =
  require("./routes/jobRoutes");

const commentRoutes =
  require("./routes/commentRoutes");

const cvRoutes =
  require("./routes/cvRoutes");



const adminAuthRoutes =
  require("./routes/adminAuthRoutes");

const adminRoutes =
  require("./routes/adminRoutes");

const applicationRoutes =
  require("./routes/applicationRoutes");

const studentRoutes =
  require("./routes/studentRoutes");

const companyRoutes =
  require("./routes/companyRoutes");

const paymentRoutes =
  require("./routes/paymentRoutes");

/* =========================================
   MIDDLEWARE
========================================= */

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================================
   STATIC FILES
========================================= */

/*
  backend/uploads folder එක public කරනවා.

  Example:
  http://localhost:5000/uploads/image.jpg
*/
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

/* =========================================
   PAYMENT ROUTES
========================================= */

app.use(
  "/api/payment",
  paymentRoutes
);

/* =========================================
   API ROUTES
========================================= */

app.use(
  "/api",
  authRoutes
);

app.use(
  "/api/jobs",
  jobRoutes
);

app.use(
  "/api/comments",
  commentRoutes
);

app.use(
  "/api/cv",
  cvRoutes
);

/*
  chatRoutes.js එකේ:

  router.get("/messages")
  router.post("/upload")

  Final URLs:

  GET  /api/chat/messages
  POST /api/chat/upload
*/


app.use(
  "/api/admin",
  adminAuthRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/applications",
  applicationRoutes
);

app.use(
  "/api/student",
  studentRoutes
);

app.use(
  "/api/company",
  companyRoutes
);

/* =========================================
   TEST ROUTE
========================================= */

app.get("/", (req, res) => {
  res.send(
    "Internship Management System API Running"
  );
});

/* =========================================
   404 HANDLER
========================================= */


app.use((req, res) => {
  return res.status(404).json({
    message:
      `Route not found: ` +
      `${req.method} ${req.originalUrl}`,
  });
});

/* =========================================
   GLOBAL ERROR HANDLER
========================================= */

app.use((err, req, res, next) => {
  console.error(
    "Global server error:",
    err
  );

  return res.status(500).json({
    message: "Internal server error.",
  });
});



/* =========================================
   MONGODB CONNECTION
========================================= */

if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
}

   module.exports = app;