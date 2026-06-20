const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

/*
|--------------------------------------------------------------------------
| Global Middlewares
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",

    credentials: true,
  }),
);

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

const authRouter = require("./routes/auth.routes");

const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);

app.use("/api/interview", interviewRouter);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,

    message: "Backend running successfully",
  });
});

/*
|--------------------------------------------------------------------------
| Wrong Route Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  return res.status(404).json({
    success: false,

    message: "Route not found",
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((error, req, res, next) => {
  console.error("Server Error:", error.message);

  return res.status(500).json({
    success: false,

    message: error.message || "Internal server error",
  });
});

module.exports = app;
