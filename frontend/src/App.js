import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import HomeUser from './pages/HomeUser';
import HomeAdmin from './pages/HomeAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth.js';
import HomeUnauthorised from "./pages/HomeUnauthorised.jsx"
import ManageFeedback from './pages/ManageFeedback.jsx';
import ViewTasks from './pages/ViewTasks.jsx';
import Statistics from './pages/Statistics.jsx';
import { ChakraProvider } from '@chakra-ui/react'
import Layout from "./components/Layout";

function App() {

  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ChakraProvider>
      <Router>
        <Layout>
          <Routes>
            <Route
              exact
              path="/home"
              element={<ProtectedRoute>
                {user && user.esteAdmin ? <HomeAdmin user={user} /> : user && user.apartineFirmei ? <HomeUser user={user} /> : user ? <HomeUnauthorised /> : <Login /> }
              </ProtectedRoute>}
            />
            <Route path="/" element={<Login />} />
            <Route path="/feedback" element={<ProtectedRoute>{<ManageFeedback />}</ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute>{<ViewTasks user={user} />}</ProtectedRoute>} />
            <Route path="/statistics" element={<ProtectedRoute>{<Statistics />}</ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </ChakraProvider>
);
}

export default App;
