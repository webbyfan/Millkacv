import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import contactRouter from "./routes/contact.js";
import metaRouter from "./routes/meta.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import resumesRouter from "./routes/resumes.js";
import aiRouter from "./routes/ai.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  }),
);
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60, // limit each IP to 60 requests per windowMs
});

app.use(limiter);

// Routes
app.use("/api/contact", contactRouter);
app.use("/api/meta", metaRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/resumes", resumesRouter);
app.use("/api/ai", aiRouter);

app.get("/", (req, res) => res.send({ ok: true, service: "resume-backend" }));

app.use(errorHandler);

// Connect to DB and start
connectDB()
  .then(() => {
    // bind explicitly to 0.0.0.0 to ensure IPv4 localhost connections work reliably
    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server running on http://127.0.0.1:${PORT} (bound to 0.0.0.0)`,
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
