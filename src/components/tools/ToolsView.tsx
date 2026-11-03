import React, { useState, useMemo, useRef } from 'react';
import { ToolCategory, ToolItem } from '../../types/tool';
import { TOOLS_DATA } from '../../data/toolsData';
import { ToolModal } from './ToolModal';

const CATEGORIES: ToolCategory[] = [
  'All',
  'Calculations',
  'Equations',
  'Solutions',
  'Thermodynamics',
  'Gas Laws',
  'Reference'
];

export const ToolsView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('All');
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'calculator' | 'crashcourse'>('calculator');

  const chipsScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollChips = (dir: 'left' | 'right') => {
    if (chipsScrollRef.current) {
      chipsScrollRef.current.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' });
    }
  };

  const filteredTools = useMemo(() => {
    const s = search.trim().toLowerCase();
    return TOOLS_DATA.filter(tool => {
      const matchSearch =
        !s ||
        tool.title.toLowerCase().includes(s) ||
        tool.desc.toLowerCase().includes(s) ||
        tool.subtitle.toLowerCase().includes(s);

      const matchCat = selectedCategory === 'All' || tool.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [search, selectedCategory]);

  const openTool = (tool: ToolItem, mode: 'calculator' | 'crashcourse') => {
    setActiveTool(tool);
    setModalInitialTab(mode);
  };

  return (
    <div className="tools-page" style={{ minHeight: '100vh', paddingBottom: '6rem', paddingTop: '100px' }}>
      {/* Featured Botanical Field Guide Hero Banner with Art Reference */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 2.5rem', padding: '0 1.5rem' }}>
        <div className="tools-hero-banner">
          {/* Left Column: Copy & Explanation */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  background: '#4E5B47',
                  color: '#FAF8F5',
                  padding: '4px 12px',
                  borderRadius: '999px'
                }}
              >
                Botanical Field Guide & Toolkit
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#4E5B47',
                  background: 'rgba(111, 127, 99, 0.25)',
                  padding: '4px 10px',
                  borderRadius: '999px'
                }}
              >
                🌿 10 Chemistry Calculators + Crash Courses
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                color: '#4E5B47',
                margin: '0 0 1rem',
                lineHeight: 1.18
              }}
            >
              Every Chemistry Tool, Explained & Solved
            </h1>

            <p style={{ color: '#5F6F5B', fontSize: '1.05rem', lineHeight: 1.65, margin: '0 0 1.5rem' }}>
              Welcome to the Chemify Observatory. Whether you need an instant molar mass decomposition, a Gaussian equation balancer, or an in-depth <strong>Crash Course</strong> that breaks down difficult chemical principles into intuitive steps — every calculator in our suite includes an illustrated guide to master the concept.
            </p>

            {/* Feature Highlights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#FAF8F5', border: '1px solid #6F7F63', borderRadius: '10px', padding: '10px 14px' }}>
                <div style={{ fontWeight: 700, color: '#4E5B47', fontSize: '0.9rem' }}>🧮 Instant Solvers</div>
                <div style={{ fontSize: '0.8rem', color: '#5F6F5B' }}>Real-time math with variable auto-detection</div>
              </div>
              <div style={{ background: '#FAF8F5', border: '1px solid #6F7F63', borderRadius: '10px', padding: '10px 14px' }}>
                <div style={{ fontWeight: 700, color: '#4E5B47', fontSize: '0.9rem' }}>📖 Crash Courses</div>
                <div style={{ fontSize: '0.8rem', color: '#5F6F5B' }}>Worked examples, pitfalls & pro chemist tips</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('tools-catalog');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: '#4E5B47',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '10px 22px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                Explore All 10 Tools ↓
              </button>
            </div>
          </div>

          {/* Right Column: Whimsical Botanical Art Frame */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '360px',
                aspectRatio: '9 / 12',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '3px solid #6F7F63',
                boxShadow: '0 16px 36px rgba(78, 91, 71, 0.22)',
                background: '#FAF8F5'
              }}
            >
              <img
                src="assets/images/ghibli-botanical-lab.png"
                alt="Botanical Chemistry Greenhouse Art — Inquisitive student chemist under hanging wisteria with a white cat, generated via Nano Banana"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transition: 'transform 0.5s ease'
                }}
              />
              {/* Botanical Overlay Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(35, 42, 33, 0.88))',
                  padding: '1.25rem 1rem 0.85rem',
                  color: '#FAF8F5',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.04em' }}>
                  Botanical Science Observatory
                </div>
                <div style={{ fontSize: '0.76rem', opacity: 0.85, marginTop: '2px' }}>
                  Where nature, mathematics, and molecular curiosity meet.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Container */}
      <section id="tools-catalog" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>
        <div
          style={{
            background: 'rgba(220, 224, 207, 0.45)',
            border: '1.5px solid #6F7F63',
            borderRadius: '18px',
            padding: '1.5rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Search bar */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tools by name, formula, or concept (e.g., Molar, Gas Law, pH, Gibbs)..."
                style={{
                  width: '100%',
                  padding: '0.85rem 2.75rem 0.85rem 1.15rem',
                  borderRadius: '12px',
                  border: '1.5px solid #6F7F63',
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)'
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.3rem',
                    color: '#5F6F5B',
                    lineHeight: 1
                  }}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4E5B47', whiteSpace: 'nowrap' }}>
              Showing {filteredTools.length} {filteredTools.length === 1 ? 'calculator' : 'calculators'}
            </span>
          </div>

          {/* Category Selector Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={() => scrollChips('left')}
              style={{
                background: '#FAF8F5',
                border: '1px solid #6F7F63',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                color: '#4E5B47',
                fontSize: '1.1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
              aria-label="Scroll categories left"
            >
              ‹
            </button>

            <div
              ref={chipsScrollRef}
              className="no-scrollbar"
              style={{
                display: 'flex',
                gap: '0.6rem',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                padding: '4px 2px'
              }}
            >
              {CATEGORIES.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '8px 18px',
                      borderRadius: '999px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1.5px solid #6F7F63',
                      background: isActive ? '#4E5B47' : '#FAF8F5',
                      color: isActive ? '#FAF8F5' : '#4E5B47',
                      boxShadow: isActive ? '0 2px 8px rgba(78, 91, 71, 0.25)' : 'var(--shadow-sm)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => scrollChips('right')}
              style={{
                background: '#FAF8F5',
                border: '1px solid #6F7F63',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                color: '#4E5B47',
                fontSize: '1.1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
              aria-label="Scroll categories right"
            >
              ›
            </button>
          </div>
        </div>

        {/* Tools Grid — Full Width Cards with Dual Action Buttons (Calculator + Crash Course) */}
        {filteredTools.length > 0 ? (
          <div className="tools-grid no-scrollbar">
            {filteredTools.map(tool => (
              <article
                key={tool.id}
                className="tool-card no-scrollbar"
                onClick={() => openTool(tool, 'calculator')}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') openTool(tool, 'calculator');
                }}
              >
                {/* Full-bleed illustration taking all the width of the card */}
                <div className="tool-card__image-wrap">
                  <img
                    src={tool.iconPath}
                    alt={tool.title}
                    className="tool-card__image"
                    loading="lazy"
                  />
                  <span className="tool-card__badge">{tool.badge}</span>
                </div>

                {/* Card Content */}
                <div className="tool-card__body no-scrollbar">
                  <span className="tool-card__category">{tool.category}</span>
                  <h3 className="tool-card__title">{tool.title}</h3>
                  <p className="tool-card__desc">{tool.desc}</p>

                  {/* Dual Action Options: Launch Calculator & Crash Course */}
                  <div
                    className="tool-card__footer"
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap'
                    }}
                  >
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        openTool(tool, 'calculator');
                      }}
                      style={{
                        background: '#4E5B47',
                        color: '#FAF8F5',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(78, 91, 71, 0.25)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>Launch</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        openTool(tool, 'crashcourse');
                      }}
                      style={{
                        background: '#FAF8F5',
                        color: '#4E5B47',
                        border: '1.5px solid #6F7F63',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                      title="Open Crash Course & Guide for this tool"
                    >
                      <span>📖</span>
                      <span>Crash Course</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              background: '#FAF8F5',
              border: '1.5px dashed #6F7F63',
              borderRadius: '16px'
            }}
          >
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: '#4E5B47', marginBottom: '0.5rem' }}>
              No Calculators Found
            </h3>
            <p style={{ color: '#5F6F5B', marginBottom: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
              No chemistry tools match "{search}". Try searching by element, formula, or reset your filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              style={{
                background: '#4E5B47',
                color: '#FAF8F5',
                border: 'none',
                borderRadius: '999px',
                padding: '10px 24px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Tool Modal Dialog with Calculator & Crash Course Tabs */}
      <ToolModal
        tool={activeTool}
        initialTab={modalInitialTab}
        onClose={() => setActiveTool(null)}
      />
    </div>
  );
};
