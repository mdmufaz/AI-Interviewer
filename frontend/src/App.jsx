import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Home from './pages/Home.jsx'
import Navbar from './components/Navbar.jsx'


function App() {
  return (
    <div>
    <Navbar />      
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
    </div>
  );  
}




export default App;
