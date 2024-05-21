import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './pages/Login';
import HomeUser from './pages/HomeUser';
import HomeAdmin from './pages/HomeAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth.js';

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
                    <Link to="/login">Login</Link>
                </li>
            </ul>
        </nav>
        <Routes>
          <Route
            exact
            path="/home"
            element={<ProtectedRoute>
              {user.esteAdmin ? <HomeAdmin user={user} /> : <HomeUser user={user} />}
            </ProtectedRoute>}
          />
          <Route path="/login" element={<Login />} />
        </Routes>
    </Router>
);
}

export default App;
