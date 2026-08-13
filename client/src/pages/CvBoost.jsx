import React, { useState } from "react";
import api from "../api/axiosInstance";
import Header from "../components/Header";
import UploadSection from "../components/UploadSection";
import AnalysisSection from "../components/AnalysisSection";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

export default function CvBoost() {
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Uploading CV...");
  const [errorMessage, setErrorMessage] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleUpload = async (file) => {
    try {
      setShowResult(false);
      setErrorMessage(null);
      setLoading(true);

      const formData = new FormData();
      formData.append("cv", file);

      setStatusMessage("Uploading your CV...");
      setTimeout(() => setStatusMessage("Reading your document..."), 900);
      setTimeout(
        () => setStatusMessage("Extracting important details..."),
        1900,
      );
      setTimeout(
        () => setStatusMessage("Analyzing if this is really a CV..."),
        3000,
      );
      setTimeout(() => setStatusMessage("Almost Done..."), 3800);

      const res = await api.post("/cv-text/extract-text", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("SERVER RESPONSE:", res.data);

      setAnalysis(res.data.analysis);

      await new Promise((resolve) => setTimeout(resolve, 2200));

      setShowResult(true);
    } catch (error) {
      console.error("Upload Failed:", error?.response?.data);

      if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong, please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#0B1026]">
      <div className="flex-1 px-6 pt-12 pb-12 overflow-y-auto">
        <Header />

        {errorMessage && (
          <div className="max-w-xl mx-auto mb-8 p-5 rounded-2xl border border-red-400/40 bg-red-500/10 backdrop-blur shadow-lg text-center">
            <h3 className="text-red-400 text-xl font-bold mb-2">
              ❌ Oops! Something went wrong
            </h3>

            <p className="text-gray-300">{errorMessage}</p>

            <p className="text-gray-400 mt-2 text-sm">
              Please upload a valid CV document in PDF format.
            </p>
          </div>
        )}

        {!showResult && (
          <UploadSection
            loading={loading}
            onUpload={handleUpload}
            statusMessage={statusMessage}
          />
        )}

        {showResult && analysis && (
          <div className="space-y-16 animate-fade-in">
            <AnalysisSection analysis={analysis} />
            <FinalCTA />
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
