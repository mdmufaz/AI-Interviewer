import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Check login status
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Get user safely
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-md">

      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-green-400 cursor-pointer"
      >
        AI Interviewer
      </h1>

      {/* Right Section */} <p className="text-green-400 font-semibold mr-2 pr-2">
              Hi, {user?.name || "User"} 👋
            </p>
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
            {/* User Name */}
            
            <Link to="/dashboard" className="hover:text-green-400 transition">
              Dashboard
            </Link>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
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