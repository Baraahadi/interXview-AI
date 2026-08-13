// client/src/pages/Interview.jsx
import React, { useState } from "react";
import api from "../api/axiosInstance";
import ChatContainer from "../components/ChatContainer";
import InputArea from "../components/InputArea";
import Sidebar from "../components/Sidebar";
import ProgressSteps from "../components/ProgressSteps";
import Footer from "../components/Footer";

export default function Interview() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState(null);
  const [typedFeedback, setTypedFeedback] = useState("");
  const TOTAL_QUESTIONS = 5;
  const [jobRole, setJobRole] = useState("Frontend Developer");

  // =========================
  // START INTERVIEW
  // =========================
  const startInterview = async () => {
    setLoading(true);
    setMessages([]);
    setAnswers([]);
    setPreviousQuestions([]);
    setQuestionNumber(0);

    try {
      const res = await api.post("/interview/start", { role: jobRole });
      const firstQuestion = res.data.question;
      const sessionId = res.data.sessionId;

      setSessionId(sessionId);
      setMessages([{ sender: "AI", message: firstQuestion, type: "question" }]);

      setCurrentQuestion(firstQuestion);
      setQuestionNumber(1);
      setPreviousQuestions([firstQuestion]);
    } catch (err) {
      console.error("Error starting interview:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // END INTERVIEW
  // =========================
  const forceEndInterview = async () => {
    setFeedbackLoading(true);

    try {
      const res = await api.post("/interview/answer", {
        questionNumber,
        userAnswer: "Force End",
        role: jobRole,
        answers,
        previousQuestions,
        sessionId,
      });

      showFeedback(res.data.feedback);
    } catch (err) {
      console.error("Error ending interview:", err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // =========================
  // SEND ANSWER
  // =========================
  const handleSend = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", message: text }]);
    setLoading(true);

    try {
      const res = await api.post("/interview/answer", {
        questionNumber,
        userAnswer: text,
        role: jobRole,
        answers,
        previousQuestions,
        sessionId,
      });

      const updated = [...answers, text];
      setAnswers(updated);

      if (res.data.isFinished) {
        setFeedbackLoading(true);
        showFeedback(res.data.feedback);
        return;
      }

      const nextQ = res.data.question;

      setMessages((prev) => [
        ...prev,
        { sender: "AI", message: nextQ, type: "question" },
      ]);

      setCurrentQuestion(nextQ);
      setQuestionNumber(res.data.questionNumber);
      setPreviousQuestions(res.data.previousQuestions);
    } catch (err) {
      console.error("Error sending answer:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FEEDBACK
  // =========================
  const showFeedback = (feedback) => {
    setTimeout(() => {
      setFinalFeedback(feedback);
      setShowFeedbackModal(true);
      animateTyping(feedback?.detailedFeedback || "");
      setFeedbackLoading(false);
    }, 900);
  };

  const animateTyping = (text) => {
    let i = 0;
    setTypedFeedback("");

    const interval = setInterval(() => {
      setTypedFeedback((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 30);
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-[#0A0E27] text-white">
      <main className="flex-1 px-4 lg:px-6 py-4 lg:py-6 mt-20 pb-8">
        {/* HEADER */}
        <div className="mb-3 text-center">
          <h1 className="text-xl sm:text-2xl font-semibold mb-1">
            AI Interview Simulation
          </h1>
          <p className="text-gray-400 text-sm">
            Practice real interview questions powered by AI.
          </p>

          <div className="flex justify-center gap-3 mt-2">
            <button
              onClick={startInterview}
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
            >
              Start Interview
            </button>

            {currentQuestion && (
              <button
                onClick={forceEndInterview}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
              >
                End Interview
              </button>
            )}
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3 mb-4">
          <div className="flex flex-col bg-white/5 rounded-2xl border border-white/10 p-3 h-[520px] shadow-xl">
            <ChatContainer messages={messages} loading={loading} />
            <InputArea
              onSend={handleSend}
              disabled={loading || !currentQuestion}
            />
          </div>

          <Sidebar jobRole={jobRole} setJobRole={setJobRole} />
        </div>

        {/* PROGRESS BAR */}
        <ProgressSteps currentStep={questionNumber} total={TOTAL_QUESTIONS} />

        {/* =====================
          LOADING SKELETON
      ====================== */}
        {feedbackLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="bg-[#0F1540] p-6 rounded-2xl w-[420px] border border-white/20">
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <div>
                  <p className="text-white font-semibold text-sm">
                    Analyzing Interview...
                  </p>
                  <p className="text-gray-400 text-xs">
                    Generating HR-grade feedback
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="h-3 bg-white/20 rounded animate-pulse" />
                <div className="h-3 bg-white/20 rounded animate-pulse" />
                <div className="h-3 bg-white/20 rounded animate-pulse w-3/4" />
              </div>
            </div>
          </div>
        )}

        {/* =====================
           FEEDBACK MODAL
      ====================== */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#11183A] border border-white/20 rounded-2xl p-6 max-w-3xl w-[92%]">
              <h2 className="text-2xl font-bold mb-2 text-green-400">
                Final Interview Evaluation
              </h2>

              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Final Score</h3>
                <span className="text-3xl font-bold text-yellow-400">
                  {finalFeedback?.score || 60} / 100
                </span>
              </div>

              <div className="bg-white/10 p-4 rounded-xl border border-white/20 mb-3">
                <h3 className="text-lg font-semibold text-blue-400 mb-1">
                  ATS Summary
                </h3>
                <p className="text-gray-300">{finalFeedback?.atsSummary}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-1">
                    Strengths
                  </h3>
                  <ul className="list-disc pl-6 text-gray-300 space-y-1">
                    {(finalFeedback?.strengths || []).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-1">
                    Weaknesses
                  </h3>
                  <ul className="list-disc pl-6 text-gray-300 space-y-1">
                    {(finalFeedback?.weaknesses || []).map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white/10 p-4 rounded-xl border border-white/20 mt-3">
                <h3 className="text-lg font-semibold text-purple-400 mb-1">
                  HR Detailed Feedback
                </h3>
                <p className="text-gray-300">
                  {typedFeedback}
                  <span className="animate-pulse">|</span>
                </p>
              </div>

              <div className="text-right mt-3">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
