import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

  const API_URL = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="h-screen flex items-center justify-center bg-gray-700"> 
      <div className="bg-gray-800 p-8 rounded-xl w-96 shadow-lg" p-xy-6 flex items-center justify-between>
        <h2 className="text-white text-2xl mb-6 text-center">Login</h2>
    <form   onSubmit={handleSubmit}>
      <input className=" w-full bg-gray-700 px-3 py-3 mb-4 rounded"
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input className=" w-full bg-gray-700 px-3 py-3 mb-6 rounded"
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
                      <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded ">Login</button>

    </form>

      </div>

      </div>
  );
}

export default Login;