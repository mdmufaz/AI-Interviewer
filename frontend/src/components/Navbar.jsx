import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
      
      <h1 className="text-2xl font-bold ">AI Interviewer</h1>

      <div className="flex gap-6">
        <Link to="/" className="hover:text-gray-300 text-xl">Home</Link>
        <Link to="/login" className="hover:text-gray-300 text-xl">Login</Link>
        <Link to="/signup" className="hover:text-gray-300 text-xl ">Sign Up</Link>
      </div>

    </div>
  );
}

export default Navbar;