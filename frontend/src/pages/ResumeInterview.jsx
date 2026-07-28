import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaFileAlt, FaCheckCircle } from "react-icons/fa";
import { authFetch } from "../utils/api.js";

function StepIndicator({ step }) {
    const steps = ["Upload", "Configure", "Start"];
    return (
        <div className="flex justify-center gap-4 mb-6">
            {steps.map((label, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? "bg-green-500" : step === i + 1 ? "bg-blue-500" : "bg-gray-600"}`}>
                        {step > i + 1 ? "✓" : i + 1}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{label}</span>
                </div>
            ))}
        </div>
    );
}

function ResumeInterview() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [resumeData, setResumeData] = useState(null);
    const [resumeText, setResumeText] = useState("");
    const [generating, setGenerating] = useState(false);

    const [config, setConfig] = useState({
        difficulty: "medium",
        type: "theory",
        numQuestions: 5,
        selectedTopic: ""
    });

    const handleUpload = async () => {
        if (!file) return alert("Please select a PDF file");

        const formData = new FormData();
        formData.append("resume", file);

        try {
            setUploading(true);

            const res = await authFetch("http://localhost:5000/api/resume/upload", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Upload failed");
                return;
            }

            setResumeData(data.resumeData);
            setResumeText(data.resumeText);
            setStep(2);

        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setUploading(false);
        }
    };

    const handleStartInterview = async () => {
        try {
            setGenerating(true);

            const res = await authFetch("api/interview/start-from-resume", {
                method: "POST",
                body: JSON.stringify({
                    resumeText,
                    resumeData,
                    difficulty: config.difficulty,
                    type: config.type,
                    numQuestions: config.numQuestions
                })
            });
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
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center items-center p-6">
            <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-lg text-white p-6">

                <h2 className="text-2xl font-bold text-center mb-2">
                    📄 Resume Interview
                </h2>
                <p className="text-gray-400 text-center text-sm mb-6">
                    Upload your resume and get interview questions tailored to YOUR skills and projects
                </p>

                <StepIndicator step={step} />

                {step === 1 && (
                    <div>
                        <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${file ? "border-green-500 bg-green-900/20" : "border-gray-600 hover:border-blue-400"}`}>
                            <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            {file ? (
                                <>
                                    <FaCheckCircle className="text-4xl text-green-400 mb-3" />
                                    <p className="font-semibold text-green-400">{file.name}</p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {(file.size / 1024).toFixed(0)} KB
                                    </p>
                                </>
                            ) : (
                                <>
                                    <FaUpload className="text-4xl text-gray-400 mb-3" />
                                    <p className="font-semibold">Click to upload your resume</p>
                                    <p className="text-gray-400 text-sm mt-1">PDF only, max 5MB</p>
                                </>
                            )}
                        </label>

                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                                    Analyzing Resume...
                                </>
                            ) : (
                                "Upload & Analyze"
                            )}
                        </button>
                    </div>
                )}

                {step === 2 && resumeData && (
                    <div>
                        <div className="bg-gray-700 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <FaFileAlt className="text-blue-400" />
                                <span className="font-semibold">Resume Parsed Successfully</span>
                            </div>

                            <p className="text-sm text-gray-300 mb-1">
                                <span className="text-gray-400">Name:</span> {resumeData.name}
                            </p>

                            <p className="text-sm text-gray-300 mb-1">
                                <span className="text-gray-400">Skills:</span>{" "}
                                {resumeData.skills?.slice(0, 5).join(", ")}
                                {resumeData.skills?.length > 5 && ` +${resumeData.skills.length - 5} more`}
                            </p>

                            <p className="text-sm text-gray-300">
                                <span className="text-gray-400">Projects:</span>{" "}
                                {resumeData.projects?.length} found
                            </p>
                        </div>

                        {resumeData.suggestedTopics?.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-400 mb-2">🎯 AI suggested focus areas:</p>
                                <div className="flex flex-wrap gap-2">
                                    {resumeData.suggestedTopics.map((topic, i) => (
                                        <span key={i} className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-3 py-1 rounded-full text-xs">
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <select
                            value={config.difficulty}
                            onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                            className="w-full mb-3 p-2 rounded text-black"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        <select
                            value={config.type}
                            onChange={(e) => setConfig({ ...config, type: e.target.value })}
                            className="w-full mb-3 p-2 rounded text-black"
                        >
                            <option value="theory">Descriptive (Recommended for Resume)</option>
                            <option value="mcq">MCQ</option>
                        </select>

                        <input
                            type="number"
                            value={config.numQuestions}
                            onChange={(e) => setConfig({ ...config, numQuestions: Number(e.target.value) })}
                            min={3}
                            max={15}
                            className="w-full mb-4 p-2 rounded text-black"
                        />

                        <button
                            onClick={handleStartInterview}
                            disabled={generating}
                            className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {generating ? (
                                <>
                                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                                    Generating Your Questions...
                                </>
                            ) : (
                                "🚀 Start Resume Interview"
                            )}
                        </button>

                        <button
                            onClick={() => { setStep(1); setFile(null); setResumeData(null); }}
                            className="w-full mt-2 text-gray-400 hover:text-white text-sm py-2"
                        >
                            ← Upload different resume
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ResumeInterview;