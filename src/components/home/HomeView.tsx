import React from 'react';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { FeaturesSection } from './FeaturesSection';
import { PeriodicTableTeaser } from './PeriodicTableTeaser';
import { PersonasSection } from './PersonasSection';
import { CtaBanner } from './CtaBanner';
import { AppView } from '../common/Navbar';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="home-view">
      <HeroSection onNavigate={onNavigate} />
      <AboutSection onNavigate={onNavigate} />
      <FeaturesSection onNavigate={onNavigate} />
      <PeriodicTableTeaser onNavigate={onNavigate} />
      <PersonasSection onNavigate={onNavigate} />
      <CtaBanner onNavigate={onNavigate} />
    </div>
  );
};

