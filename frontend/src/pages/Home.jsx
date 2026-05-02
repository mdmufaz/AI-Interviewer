import { useNavigate } from "react-router-dom";
import { FaRobot, FaChartLine, FaBolt } from "react-icons/fa";
import React from "react";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">

      {/* 🔥 HERO */}
      <div className="flex flex-col justify-center items-center text-center px-6 py-24">

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Crack Your Interviews
          </span>
          <br />
          with AI 🚀
        </h1>

        <p className="text-lg text-gray-300 max-w-2xl mb-8">
          Practice smarter, get instant AI feedback, and track your growth like never before.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/interview-setup")}
            className="bg-blue-500 px-8 py-3 rounded-lg text-lg hover:bg-blue-600 transition transform hover:scale-105"
          >
            Start Interview
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-700 px-8 py-3 rounded-lg text-lg hover:bg-gray-600 transition transform hover:scale-105"
          >
            View Dashboard
          </button>
          <button
            onClick={() => navigate("/resume-interview")}
            className="bg-purple-600 px-8 py-3 rounded-lg text-lg hover:bg-purple-700 transition transform hover:scale-105"
          >
            📄 Resume Interview
          </button>
        </div>
      </div>

      {/* 🔥 FEATURES */}
      <div className="px-6 py-16">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Why Choose This Platform?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Feature 1 */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition">
            <FaRobot className="text-3xl text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">AI Generated Questions</h3>
            <p className="text-gray-300">
              Get dynamic interview questions tailored to your topic or resume.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition">
            <FaBolt className="text-3xl text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Instant Feedback</h3>
            <p className="text-gray-300">
              Receive AI-powered scoring and actionable improvements instantly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition">
            <FaChartLine className="text-3xl text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Performance Tracking</h3>
            <p className="text-gray-300">
              Visualize your growth with analytics and performance charts.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Home;