import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Home from './pages/Home.jsx'
import Navbar from './components/Navbar.jsx'
import InterviewSetup from './pages/InterviewSetup.jsx'
import InterviewSession from './pages/interview-session.jsx'
import Result from './pages/result.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ResumeInterview from './pages/ResumeInterview.jsx';

function App() {
  return (
    <div>
    <Navbar />      
    <Routes>
      <Route path="/interview-setup" element={<InterviewSetup />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/interview-session" element={<InterviewSession />} />
      <Route path="/result" element={<Result />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resume-interview" element={<ResumeInterview />} />
    </Routes>
    </div>
  );  
}




export default App;
