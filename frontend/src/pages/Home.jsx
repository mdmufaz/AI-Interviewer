import { useNavigate } from "react-router-dom";
import React from "react";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white text-center px-6">

      <h1 className="text-5xl font-bold mb-6">
        Crack Your Interviews with AI 🚀
      </h1>

      <p className="text-lg text-gray-300 max-w-2xl mb-6">
        Practice real interview questions, get instant AI feedback,
        and improve your skills with personalized suggestions.
      </p>

      {/* ✅ Navigate to setup page */}
      <button
        onClick={() => navigate("/interview-setup")}
        className="bg-blue-500 px-6 py-3 rounded text-lg hover:bg-blue-700"
      >
        Start Interview
      </button>

    </div>
  );
}

export default Home;