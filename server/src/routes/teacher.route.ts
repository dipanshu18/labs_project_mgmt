import express from "express";
import {
  createGroup,
  createTeacher,
  getAllGroups,
  getAllStudents,
  getGroupProgress,
  loginTeacher,
} from "../controllers/teacher.controller";
import teacherMiddleware from "../middlewares/teacher.middleware";

const teacherRouter = express.Router();

teacherRouter.post("/signup", createTeacher);

teacherRouter.post("/login", loginTeacher);

teacherRouter.get("/groups", teacherMiddleware, getAllGroups);

teacherRouter.get("/students", teacherMiddleware, getAllStudents);

teacherRouter.post("/groups", teacherMiddleware, createGroup);

teacherRouter.get("/groups/:id", teacherMiddleware, getGroupProgress);

export { teacherRouter };
