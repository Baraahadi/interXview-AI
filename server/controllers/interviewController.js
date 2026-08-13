// server/controllers/interviewController.js
import {
  generateEasyQuestion,
  generateInterviewFeedback,
} from "../services/OpenAIService.js";

import pool from "../config/db.js";
import crypto from "crypto";
const TOTAL_QUESTIONS = 5;

// ==============================
// START INTERVIEW
// ==============================
async function startInterview(req, res) {
  try {
    const role = req.body?.role || "Software Developer";

    const firstQuestion = await generateEasyQuestion(role, 1, []);
    const sessionId = crypto.randomUUID();
    return res.json({
      success: true,
      sessionId,
      questionNumber: 1,
      totalQuestions: TOTAL_QUESTIONS,
      isFinished: false,
      question: firstQuestion,
      role,
      previousQuestions: [firstQuestion],
      answers: [],
    });
  } catch (err) {
    console.error("Error starting interview:", err);

    return res.status(500).json({
      error: "Failed to start interview",
    });
  }
}

// ==============================
// ANSWER INTERVIEW
// ==============================
async function answerInterview(req, res) {
  try {
    const {
      questionNumber,
      userAnswer,
      role,
      answers,
      previousQuestions,
      sessionId,
    } = req.body;

    if (!questionNumber || !userAnswer || !role) {
      return res.status(400).json({
        error: "questionNumber, userAnswer, role are required",
      });
    }

    // Get logged-in user from JWT
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({
        error: "User authentication required",
      });
    }

    const updatedAnswers = [...(answers || []), userAnswer];

    // The question that belongs to this answer
    const currentQuestion =
      previousQuestions?.[questionNumber - 1] || "Interview question";

    // ==============================
    // FINISH INTERVIEW
    // ==============================
    if (questionNumber >= TOTAL_QUESTIONS) {
      const feedback = await generateInterviewFeedback(role, updatedAnswers);

      // Save final question + answer + final evaluation
      await pool.query(
        `INSERT INTO interviews
        (user_id, question, answer, ai_feedback, score, session_id)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          userId,
          currentQuestion,
          userAnswer,
          JSON.stringify(feedback),
          feedback.score,
          sessionId,
        ],
      );

      return res.json({
        success: true,
        isFinished: true,
        feedback,
      });
    }

    // ==============================
    // SAVE CURRENT QUESTION + ANSWER
    // ==============================
    await pool.query(
      `INSERT INTO interviews
      (user_id, question, answer, session_id)
      VALUES ($1, $2, $3, $4)`,
      [userId, currentQuestion, userAnswer, sessionId],
    );

    // ==============================
    // NEXT QUESTION
    // ==============================
    const nextQuestion = await generateEasyQuestion(
      role,
      questionNumber + 1,
      previousQuestions || [],
    );

    return res.json({
      success: true,
      isFinished: false,
      questionNumber: questionNumber + 1,
      totalQuestions: TOTAL_QUESTIONS,
      question: nextQuestion,
      answers: updatedAnswers,
      previousQuestions: [...(previousQuestions || []), nextQuestion],
    });
  } catch (err) {
    console.error("Error answering interview:", err);

    return res.status(500).json({
      error: "Failed processing interview answer",
    });
  }
}

export { startInterview, answerInterview };
