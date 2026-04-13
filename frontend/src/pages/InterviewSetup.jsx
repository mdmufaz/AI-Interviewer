import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function InterviewSetup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        topic: "",
        difficulty: "easy",
        type: "mcq",
        numQuestions: 5
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.name === "numQuestions"
                ? Number(e.target.value)
                : e.target.value
        });
    };

    const handleStart = async () => {
        try {
            setLoading(true);
            if (!formData.topic) {
                alert("Please select a topic");
                return;
            }

            const res = await fetch("http://localhost:5000/api/interview/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                navigate("/interview-session", {
                    state: { questions: data.questions }
                });
            }

            console.log(data);
            setLoading(false);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-gray-900">
            <div className="bg-gray-800 p-6 rounded w-96">
                <h2 className="text-white text-xl mb-4">Start Interview</h2>

                <select name="topic" onChange={handleChange} className="w-full mb-3 p-2">
                    <option value="">Select Topic</option>
                    <option value="Java OOP">Java OOP</option>
                    <option value="Java Full Stack">Java Full Stack</option>
                    <option value="Python">Python</option>
                    <option value="Python Full Stack">Python Full Stack</option>
                    <option value="MERN Stack">MERN Stack</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="DBMS">DBMS</option>
                </select>

                <select name="difficulty" onChange={handleChange} className="w-full mb-3 p-2">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <select name="type" onChange={handleChange} className="w-full mb-3 p-2">
                    <option value="mcq">MCQ</option>
                    <option value="theory">Theory</option>
                </select>

                <input
                    name="numQuestions"
                    type="number"
                    placeholder="Number of Questions"
                    onChange={handleChange}
                    className="w-full mb-3 p-2"
                />

                <button
                    onClick={handleStart}
                    className="bg-green-500 w-full p-2 rounded text-white disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Generating Questions..." : "Start"}
                </button>
            </div>
        </div>
    );
}

export default InterviewSetup;