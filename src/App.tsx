import React, { useState, useEffect } from 'react';
import { Navbar, AppView } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomeView } from './components/home/HomeView';
import { ExplorerView } from './components/explorer/ExplorerView';
import { LabView } from './components/lab/LabView';
import { ToolsView } from './components/tools/ToolsView';
import { AboutSection } from './components/home/AboutSection';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'elements') return 'elements';
    if (hash === 'lab' || hash === 'reactions') return 'lab';
    if (hash === 'tools') return 'tools';
    if (hash === 'about') return 'about';
    return 'home';
  });

  // Sync hash changes from browser history (Back / Forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'elements') setCurrentView('elements');
      else if (hash === 'lab' || hash === 'reactions') setCurrentView('lab');
      else if (hash === 'tools') setCurrentView('tools');
      else if (hash === 'about') setCurrentView('about');
      else setCurrentView('home');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    window.location.hash = view === 'home' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <div style={{ flex: 1 }}>
        {currentView === 'home' && <HomeView onNavigate={handleNavigate} />}
        {currentView === 'elements' && <ExplorerView />}
        {currentView === 'lab' && <LabView />}
        {currentView === 'tools' && <ToolsView />}
        {currentView === 'about' && (
          <div style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <AboutSection onNavigate={handleNavigate} />
          </div>
        )}
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;

