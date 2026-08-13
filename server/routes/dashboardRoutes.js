// server/routes/dashboardRoutes.js
import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/dashboard
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT
        session_id,
        MAX(score) AS score,
        MAX(created_at) AS created_at
      FROM interviews
      WHERE user_id = $1
        AND session_id IS NOT NULL
      GROUP BY session_id
      ORDER BY MAX(created_at) DESC
      `,
      [userId],
    );

    const interviews = result.rows;

    const scoredInterviews = interviews.filter(
      (interview) => interview.score !== null,
    );

    const totalInterviews = interviews.length;

    const averageScore =
      scoredInterviews.length > 0
        ? scoredInterviews.reduce(
            (sum, interview) => sum + Number(interview.score),
            0,
          ) / scoredInterviews.length
        : 0;

    const data = {
      totalInterviews,
      averageScore: Number(averageScore.toFixed(1)),
      timeSpentHours: null,
      reportsGenerated: scoredInterviews.length,

      recentActivity: interviews.slice(0, 5).map((interview) => ({
        title: "Frontend Interview",
        score: interview.score !== null ? Number(interview.score) : null,
        createdAt: interview.created_at,
        sessionId: interview.session_id,
      })),
    };

    res.json(data);
  } catch (error) {
    console.error("Error in /api/dashboard:", error);

    res.status(500).json({
      message: "Failed to load dashboard data",
    });
  }
});

export default router;
