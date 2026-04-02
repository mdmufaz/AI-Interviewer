import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Home from './pages/Home.jsx'
import Navbar from './components/Navbar.jsx'
import InterviewSetup from './pages/InterviewSetup.jsx'
import InterviewSession from './pages/interview-session.jsx'
import Result from './pages/result.jsx'


function App() {
  return (
    <div>
    <Navbar />      
    <Routes>
      <Route path="/interview-setup" element={<InterviewSetup />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/interview-session" element={<InterviewSession />} />
      <Route path="/result" element={<Result />} />
    </Routes>
    </div>
  );  
}




export default App;
