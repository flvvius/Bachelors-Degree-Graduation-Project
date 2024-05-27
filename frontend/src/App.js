import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './pages/Login';
import HomeUser from './pages/HomeUser';
import HomeAdmin from './pages/HomeAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth.js';
import HomeUnauthorised from "./pages/HomeUnauthorised.jsx"
import ManageFeedback from './pages/ManageFeedback.jsx';

function App() {

  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
        <nav>
            <ul>
                <li>
                    <Link to="/home">Home</Link>
                </li>
                <li>
                    <Link to="/">Login</Link>
                </li>
            </ul>
        </nav>
        <Routes>
          <Route
            exact
            path="/home"
            element={<ProtectedRoute>
              {user && user.esteAdmin ? <HomeAdmin user={user} /> : user && user.apartineFirmei ? <HomeUser user={user} /> : user ? <HomeUnauthorised /> : <Login /> }
            </ProtectedRoute>}
          />
          <Route path="/" element={<Login />} />
          <Route path="/feedback" element={<ManageFeedback />} />
        </Routes>
    </Router>
);
}

export default App;
