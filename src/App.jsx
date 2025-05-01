// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext.jsx'; // Import context hook
// Import page components from the pages folder
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx'; // <-- Import ProfilePage

function App() {
  const { isAuthenticated } = useAuth(); // Get auth state from context
  const [authView, setAuthView] = useState('login'); // State for login/register view
  // --- NEW STATE for authenticated view ---
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'profile'

  // Effect to reset view if user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setAuthView('login');
      setActiveView('dashboard'); // Reset active view on logout
    }
  }, [isAuthenticated]);

  // Functions to switch between login/register
  const showLogin = () => setAuthView('login');
  const showRegister = () => setAuthView('register');

  // --- NEW Functions to switch between dashboard/profile ---
  const showDashboard = () => setActiveView('dashboard');
  const showProfile = () => setActiveView('profile');

  // Render based on authentication and active view
  if (isAuthenticated) {
    // If authenticated, choose between Dashboard and Profile
    if (activeView === 'dashboard') {
      // Pass the function to navigate TO profile
      return <DashboardPage onNavigateToProfile={showProfile} />;
    } else if (activeView === 'profile') {
      // Pass the function to navigate BACK to dashboard
      return <ProfilePage onBackToDashboard={showDashboard} />;
    }
    // Fallback or loading state could go here if needed
    return <div>Loading authenticated view...</div>;

  } else {
    // If not authenticated, show Login or Register page
    if (authView === 'login') {
      return <LoginPage onSwitchToRegister={showRegister} />;
    } else { // authView === 'register'
      return <RegisterPage onSwitchToLogin={showLogin} />;
    }
  }
}

// Export the main App component as default
export default App;
