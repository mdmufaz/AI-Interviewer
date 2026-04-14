import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md text-white px-8 py-4 flex justify-between items-center shadow-lg">

      {/* 🔥 LOGO */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-green-400 cursor-pointer hover:scale-105 transition"
      >
        AI Interviewer
      </h1>

      {/* 🔥 RIGHT SECTION */}
      <div className="flex items-center gap-6 text-lg">

        <Link to="/" className="hover:text-green-400 transition">
          Home
        </Link>

        {!isLoggedIn ? (
          <>
            <Link to="/login" className="hover:text-green-400 transition">
              Login
            </Link>
            <Link to="/signup" className="hover:text-green-400 transition">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {/* ✅ USER NAME */}
            <p className="text-green-400 font-semibold">
              Hi, {user?.name || "User"} 👋
            </p>

            <Link to="/dashboard" className="hover:text-green-400 transition">
              Dashboard
            </Link>

            {/* ✅ LOGOUT */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition transform hover:scale-105"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;