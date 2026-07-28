import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // Save token
        localStorage.setItem("token", data.token);

        // Redirect to home
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-700"> 
      <div className="bg-gray-800 p-8 rounded-xl w-96 shadow-lg">
        <h2 className="text-white text-2xl mb-6 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Enter username"
            className="w-full mb-4 p-2 rounded bg-gray-700 text-white outline-none"
          />

          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Enter email"
            className="w-full mb-4 p-2 rounded bg-gray-700 text-white outline-none"
          />

          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter password"
            className="w-full mb-6 p-2 rounded bg-gray-700 text-white outline-none"
          />

          <button className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;