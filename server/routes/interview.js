import express from "express";
import {
  startInterview,
  answerInterview,
} from "../controllers/interviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", authMiddleware, startInterview);
router.post("/answer", authMiddleware, answerInterview);

export default router;
