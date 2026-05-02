import {Routes, Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Home from './pages/Home.jsx'
import Navbar from './components/Navbar.jsx'
import InterviewSetup from './pages/InterviewSetup.jsx'
import InterviewSession from './pages/interview-session.jsx'
import Result from './pages/result.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ResumeInterview from './pages/ResumeInterview.jsx'

function App() {
  return (
    <div>
      <Navbar />      
      <Routes>
        {/* ✅ PUBLIC routes — anyone can visit */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ✅ PRIVATE routes — must be logged in */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/interview-setup" element={<ProtectedRoute><InterviewSetup /></ProtectedRoute>} />
        <Route path="/interview-session" element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/resume-interview" element={<ProtectedRoute><ResumeInterview /></ProtectedRoute>} />
      </Routes>
    </div>
  );  
}

export default App;
