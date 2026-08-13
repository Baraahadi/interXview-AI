import React, { useEffect, useState } from "react";
import { BarChart3, Clock, FileText, Award, RefreshCcw } from "lucide-react";
import Footer from "../components/Footer";
import api from "../api/axiosInstance";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard");
      setDashboardData(response.data);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0E27]">
      <main className="flex-1 mt-24 px-6 lg:px-12 text-white pb-8">
        {loading && <p className="text-gray-400 mb-4">Loading dashboard...</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Overview of your interview performance and activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Interviews */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-[#3A7BFF]/30 transition-all">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-300 text-sm">Total Interviews</h2>
              <BarChart3 className="text-[#3A7BFF] w-5 h-5" />
            </div>
            <p className="text-3xl font-bold mt-3">
              {dashboardData?.totalInterviews ?? 0}
            </p>{" "}
            <p className="text-gray-500 mt-1 text-sm">This month</p>
          </div>

          {/* Avg Score */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-[#3A7BFF]/30 transition-all">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-300 text-sm">Average Score</h2>
              <Award className="text-[#3A7BFF] w-5 h-5" />
            </div>
            <p className="text-3xl font-bold mt-3">
              {dashboardData?.averageScore ?? 0} / 100
            </p>{" "}
            <p className="text-gray-500 mt-1 text-sm">Across all interviews</p>
          </div>

          {/* Time Spent */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-[#3A7BFF]/30 transition-all">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-300 text-sm">Time Spent</h2>
              <Clock className="text-[#3A7BFF] w-5 h-5" />
            </div>
            <p className="text-3xl font-bold mt-3">
              {dashboardData?.timeSpentHours ?? 0} hrs
            </p>{" "}
            <p className="text-gray-500 mt-1 text-sm">On practice</p>
          </div>

          {/* Reports */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-[#3A7BFF]/30 transition-all">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-300 text-sm">Reports Generated</h2>
              <FileText className="text-[#3A7BFF] w-5 h-5" />
            </div>
            <p className="text-3xl font-bold mt-3">
              {dashboardData?.reportsGenerated ?? 0}
            </p>{" "}
            <p className="text-gray-500 mt-1 text-sm">Downloadable</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-3 text-gray-300">
            {dashboardData?.recentActivity?.map((activity, index) => (
              <li
                key={index}
                className="flex justify-between border-b border-white/5 pb-2"
              >
                <span>{activity.title}</span>
                <span className="text-[#3A7BFF]">Score: {activity.score}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#3A7BFF] hover:bg-[#2E6FE0] shadow-lg flex items-center gap-2 mx-auto transition-all disabled:opacity-50"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
