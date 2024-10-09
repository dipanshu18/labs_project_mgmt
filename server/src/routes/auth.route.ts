import express from "express";
import { logout } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/logout", logout);

export { authRouter };
