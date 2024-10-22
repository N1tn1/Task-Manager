import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TodoContainer from './components/TodoContainer';
import Home from './components/Home'; 
import ContactUs from './components/ContactUs'; 
import Register from './components/Register';
import SignIn from './components/SignIn';
import './App.css';

const ProtectedRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/signin" />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setIsAuthenticated(false);
  };

  return (
    
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {!isAuthenticated && (
              <li>
                <Link to="/signin">Sign In</Link>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <Link to="/signin" onClick={handleLogout}>Sign Out</Link>
              </li>
            )}
            <li>
              <Link to="/contactus">ContactUs</Link>
            </li>
            <li>
              <span style={{ cursor: 'not-allowed', color: 'black'}}><i className="fas fa-question-circle"></i></span>
            </li>
            
          </ul>
        </nav>
        <Routes>
          
          <Route path="/" element={<Home />}/>
          <Route path="/todos" element={<ProtectedRoute element={<TodoContainer />} isAuthenticated={isAuthenticated} />} />
          <Route path="/contactus" element={<ContactUs />}/>
          <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />}/>
          
          
        </Routes>
      </div>
    </Router>
  )
}

export default App;