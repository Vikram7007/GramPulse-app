const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);

/* =========================
   ALLOWED ORIGINS
========================= */
const allowedOrigins = [
  "https://gram-pulse-app.vercel.app",
  "https://grampulse-app.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];


/* =========================
   CORS CONFIG (SAFE FOR NODE 22)
========================= */
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        return callback(null, true);
      }
      console.error("Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* =========================
   MIDDLEWARES
========================= */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   SOCKET.IO
========================= */
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.io = io;
app.set("io", io);
require("./sockets/socket")(io);

/* =========================
   DATABASE
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/issues", require("./routes/issues"));
app.use("/api/gram-sabha-notice", require("./routes/gram-sabha-notice"));
app.use("/api/villageadmin", require("./routes/gram-sabha-notice"))
app.use("/api/auth/village", require("./routes/gram-sabha-notice"))
app.use("/api/auth/gramsevak", require("./routes/gram-sabha-notice"));
app.use("/api/notifications", require("./routes/issues")); // for notifications/test-notif-trigger etc

// ❌ villageadmin route removed because file does not exist

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "GramPulse Backend Running 🚀" });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Allowed origins: ${allowedOrigins.join(", ")}`);
});
