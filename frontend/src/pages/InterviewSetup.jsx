import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api.js";

function InterviewSetup() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [useCustomTopic, setUseCustomTopic] = useState(false);

    const [formData, setFormData] = useState({
        topic: "",
        difficulty: "easy",
        type: "mcq",
        numQuestions: 5
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.name === "numQuestions"
                    ? Number(e.target.value)
                    : e.target.value
        });
    };

    // ✅ START INTERVIEW
    const handleStart = async () => {
        if (!formData.topic) {
            alert("Please select or enter  a topic");
            return;
        }

        try {
            setLoading(true);
            console.log(authFetch);
            const res = await authFetch("/api/interview/start", {
                method: "POST",
                body: JSON.stringify(formData)
            });
              console.log(authFetch);
            const data = await res.json();

            if (res.ok) {
                navigate("/interview-session", {
                    state: { questions: data.questions }
                });
            } else {
                alert("Failed to generate questions");
            }

        } catch (err) {
            console.error(err);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    // ✅ AI SEARCH
    const handleSearchTopic = async () => {
        if (!formData.topic) {
            alert("Enter topic first");
            return;
        }

        try {
            setSearchLoading(true);

            const res = await authFetch("/api/interview/search-topic", {
                method: "POST",
                body: JSON.stringify({ query: formData.topic }),
            });

            const data = await res.json();

            setFormData((prev) => ({
                ...prev,
                topic: data.topic,
            }));

        } catch (err) {
            console.error(err);
            alert("Search failed");
        } finally {
            setSearchLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-96 text-white">
                <h2 className="text-xl mb-4 text-center">Start Interview</h2>

                {/* 🔥 MODE SWITCH */}
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => setUseCustomTopic(false)}
                        className={`w-full p-2 rounded ${!useCustomTopic ? "bg-blue-500" : "bg-gray-600"
                            }`}
                    >
                        Select Topic
                    </button>

                    <button
                        onClick={() => setUseCustomTopic(true)}
                        className={`w-full p-2 rounded ${useCustomTopic ? "bg-purple-500" : "bg-gray-600"
                            }`}
                    >
                        Search Topic with AI
                    </button>
                </div>

                {!useCustomTopic ? (
                    <select
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        className="w-full mb-3 p-2 rounded text-black"
                    >
                        <option value="">Select Topic</option>
                        <option value="Java OOP">Java OOP</option>
                        <option value="Java Full Stack">Java Full Stack</option>
                        <option value="Python">Python</option>
                        <option value="Python Full Stack">Python Full Stack</option>
                        <option value="MERN Stack">MERN Stack</option>
                        <option value="Data Structures">Data Structures</option>
                        <option value="DBMS">DBMS</option>
                    </select>
                ) : (
                    <>
                        <input
                            type="text"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            placeholder="Enter topic (e.g. React hooks, DBMS joins)"
                            className="w-full mb-3 p-2 rounded bg-gray-600 text-white"
                        />

                        <button
                            onClick={handleSearchTopic}
                            className="bg-purple-500 w-full p-2 rounded mb-3 flex justify-center items-center gap-2"
                            disabled={searchLoading}
                        >
                            {searchLoading ? (
                                <>
                                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                                    Searching...
                                </>
                            ) : (
                                "🔍 Search with AI"
                            )}
                        </button>
                    </>
                )}

                <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 rounded text-black"
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 rounded text-black"
                >
                    <option value="mcq">MCQ</option>
                    <option value="theory">Theory</option>
                </select>

                <input
                    name="numQuestions"
                    type="number"
                    value={formData.numQuestions}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 rounded text-black"
                    placeholder="Number of Questions"
                />

                <button
                    onClick={handleStart}
                    className="bg-green-500 w-full p-2 rounded disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Generating Questions..." : "Start Interview"}
                </button>
            </div>
        </div>
    );
}

export default InterviewSetup;