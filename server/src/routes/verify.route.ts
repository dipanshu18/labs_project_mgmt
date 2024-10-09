import express from "express";
import { sendOtp, verifyOtp } from "../controllers/verify.controller";

const verifyRouter = express.Router();

verifyRouter.post("/send", sendOtp);

verifyRouter.post("/verify", verifyOtp);

export { verifyRouter };
