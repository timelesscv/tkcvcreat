import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import Dashboard from './components/Dashboard';
import KuwaitForm from './components/forms/KuwaitForm';
import SaudiForm from './components/forms/SaudiForm';
import JordanForm from './components/forms/JordanForm';
import AllForm from './components/forms/AllForm';
import { HelpPage, ContactPage } from './components/InfoPages';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [greeting, setGreeting] = useState('Welcome to TK International!');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning TK Staff! 🌅");
    else if (hour < 17) setGreeting("Good Afternoon TK Staff! ☀️");
    else setGreeting("Good Evening TK Staff! 🌙");
  }, []);

  const handleBack = () => {
    setCurrentView('dashboard');
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} greeting={greeting} />;
      case 'kuwait':
        return <KuwaitForm onBack={handleBack} />;
      case 'saudi':
        return <SaudiForm onBack={handleBack} />;
      case 'jordan':
        return <JordanForm onBack={handleBack} />;
      case 'all':
        return <AllForm onBack={handleBack} />;
      case 'help':
        return <HelpPage onBack={handleBack} />;
      case 'contact':
        return <ContactPage onBack={handleBack} />;
      default:
        return <Dashboard onNavigate={setCurrentView} greeting={greeting} />;
    }
  };

  return (
    <div className="font-sans antialiased text-slate-200">
      {renderView()}
    </div>
  );
};

export default App;
