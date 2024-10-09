import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { teacherRouter } from "./routes/teacher.route";
import { studentRouter } from "./routes/student.route";
import { verifyRouter } from "./routes/verify.route";
import { authRouter } from "./routes/auth.route";
import authMiddleware from "./middlewares/auth.middleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("LOG:", req.method, req.path);
  next();
});

app.use("/api/v1/verify-user", verifyRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/auth", authMiddleware, authRouter);

app.listen(PORT, () => {
  console.log("Server started on port:", PORT);
});
