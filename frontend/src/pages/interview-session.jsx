import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function InterviewSession() {
    const navigate = useNavigate();
    const location = useLocation();

    const questions = location.state?.questions || [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);

    // ✅ Prevent crash
    if (questions.length === 0) {
        return (
            <div className="text-white text-center mt-10">
                No questions found. Go back and start interview again.
            </div>
        );
    }

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    // ✅ Submit
    const handleSubmit = async () => {
        // ✅ Better validation
        const allAnswered = questions.every(
            (_, index) =>
                answers[index] && answers[index].toString().trim() !== ""
        );

        if (!allAnswered) {
            alert("Please answer all questions before submitting.");
            return;
        }

        try {
            setLoading(true);

            const formattedAnswers = questions.map((q, index) => ({
                question: q.question,
                answer: answers[index] || "",
            }));

            const res = await fetch("http://localhost:5000/api/interview/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    answers: formattedAnswers,
                }),
            });

            const data = await res.json();

            console.log("Result:", data);

            navigate("/result", { state: data });

        } catch (error) {
            console.error("Submit error:", error);
            alert("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center bg-gray-900">
            <div className="bg-gray-800 p-6 rounded w-96 text-white">

                {/* ✅ Progress */}
                <h2 className="text-xl mb-4 text-center">
                    Question {currentIndex + 1} / {questions.length}
                </h2>

                <p className="mb-4">
                    {questions[currentIndex]?.question}
                </p>

                {/* ✅ MCQ / THEORY */}
                {questions[currentIndex]?.type === "mcq" ? (
                    <div className="mb-3">
                        {questions[currentIndex]?.options?.map((option, i) => (
                            <button
                                key={i}
                                onClick={() =>
                                    setAnswers({
                                        ...answers,
                                        [currentIndex]: option,
                                    })
                                }
                                className={`block w-full text-left px-4 py-2 mb-2 rounded 
                                    ${
                                        answers[currentIndex] === option
                                            ? "bg-blue-500"
                                            : "bg-gray-700 hover:bg-gray-600"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ) : (
                    <textarea
                        className="w-full mb-3 p-2 rounded text-black"
                        placeholder="Write your answer"
                        value={answers[currentIndex] || ""}
                        onChange={(e) =>
                            setAnswers({
                                ...answers,
                                [currentIndex]: e.target.value,
                            })
                        }
                    />
                )}

                <div className="flex justify-between gap-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded w-full disabled:opacity-50"
                        onClick={prevQuestion}
                        disabled={currentIndex === 0}
                    >
                        Previous
                    </button>

                    <button
                        className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded w-full disabled:opacity-50"
                        onClick={nextQuestion}
                        disabled={currentIndex === questions.length - 1}
                    >
                        Next
                    </button>
                </div>

                {currentIndex === questions.length - 1 && (
                    <button
                        className="bg-green-500 hover:bg-green-700 py-2 px-4 rounded mt-4 w-full disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                )}

            </div>
        </div>
    );
}

export default InterviewSession;