import express from "express";

import {
  createStudent,
  getProjectDetails,
  loginStudent,
  updateProjectProgress,
} from "../controllers/student.controller";
import studentMiddleware from "../middlewares/student.middleware";

const studentRouter = express.Router();

studentRouter.post("/signup", createStudent);

studentRouter.post("/login", loginStudent);

studentRouter.get("/project-details", studentMiddleware, getProjectDetails);

studentRouter.post(
  "/update-progress",
  studentMiddleware,
  updateProjectProgress
);

export { studentRouter };
