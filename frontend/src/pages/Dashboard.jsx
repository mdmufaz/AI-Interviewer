import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { authFetch } from "../utils/api.js";

function Dashboard() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await authFetch("http://localhost:5000/api/interview/history");
        const data = await res.json();

        console.log("DATA:", data); // 👈 CHECK THIS

        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    getData();
  }, []);
  const chartData = history.map((item, index) => ({
    name: `Test ${index + 1}`,
    score: item.score
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-2xl mb-4">Your Performance</h1>

      {/* ✅ CHART */}
      <div className="mb-6">
        <h2 className="text-xl mb-2">Performance Graph</h2>

        <LineChart width={400} height={250} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" />
        </LineChart>
      </div>

      {/* ✅ LIST */}
      {history.map((item, index) => (
        <div key={index} className="bg-gray-800 p-4 mb-3 rounded">
          <p>Score: {item.score}</p>
          <p>{item.feedback}</p>
        </div>
      ))}

    </div>
  );
}

export default Dashboard;