import { useLocation, useNavigate } from "react-router-dom";
import React from "react";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  // ✅ Handle direct visit / refresh
  if (!data) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
        <h2 className="text-xl mb-4">No result found</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  const {
    score = 0,
    feedback = "No feedback available",
    improvements = [],
  } = data;

  return (
    <div className="h-screen flex justify-center items-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded w-96 shadow-lg">

        <h2 className="text-2xl mb-4 font-bold text-center">
          Interview Result
        </h2>

        {/* 🔥 Score Card */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-green-400">
            {score}/100
          </div>
          <p className="text-gray-400">Overall Score</p>
        </div>

        {/* 🔥 Feedback */}
        <div className="mb-5">
          <h3 className="font-semibold mb-1">Feedback</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {feedback}
          </p>
        </div>

        {/* 🔥 Improvements */}
        <div className="mb-5">
          <h3 className="font-semibold mb-1">Improvements</h3>

          {Array.isArray(improvements) && improvements.length > 0 ? (
            <ul className="list-disc ml-5 text-gray-300 text-sm space-y-1">
              {improvements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">
              No specific suggestions
            </p>
          )}
        </div>

        {/* 🔥 Restart Button */}
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded w-full"
        >
          Try Again
        </button>

      </div>
    </div>
  );
}

export default Result;