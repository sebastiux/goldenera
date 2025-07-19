import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/layout/Layout';
import LandingPage from './components/ui/Landing/LandingPage';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import JoinClub from './pages/JoinClub/JoinClub';
import Gallery from './pages/Gallery/Gallery';
import './styles/global.scss';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario ya vio el landing
    const hasSeenLanding = sessionStorage.getItem('hasSeenLanding');
    if (hasSeenLanding) {
      setShowLanding(false);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'black'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #FFEB37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={showLanding ? <LandingPage /> : <Navigate to="/home" />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/join" element={<JoinClub />} />
            <Route path="/gallery" element={<Gallery />} />
          </Route>
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;