import React, { useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.reveal-on-scroll'));
    if (!targets.length) return;

    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-view" ref={containerRef}>
      <HeroSection onNavigate={onNavigate} />
      <AboutSection onNavigate={onNavigate} />
      <FeaturesSection onNavigate={onNavigate} />
      <PeriodicTableTeaser onNavigate={onNavigate} />
      <PersonasSection onNavigate={onNavigate} />
      <CtaBanner onNavigate={onNavigate} />
    </div>
  );
};
