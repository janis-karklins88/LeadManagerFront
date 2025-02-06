import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LeadsPage from "./pages/LeadsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

// ProtectedRoute now waits for loading to finish
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking auth status
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
        {/* Header */}
        <header className="mb-8 w-full max-w-6xl">
          
        </header>

        {/* Main Content */}
        <main className="w-full max-w-6xl">
          <Router>
            <Routes>
              <Route path="/" element={<Navigate replace to="/login" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* Protected Route for LeadsPage */}
              <Route
                path="/leads"
                element={
                  <ProtectedRoute>
                    <LeadsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </main>

        {/* Footer */}
        <footer className="mt-8 text-sm text-gray-500 text-center">
          © 2025 Lead Manager. Created by Janis Karklins.
        </footer>
      </div>
    </AuthProvider>
  );
};

export default App;
