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

  return (
    <div className="tools-page" style={{ minHeight: '100vh', paddingBottom: '6rem', paddingTop: '110px' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 1.5rem' }}>
        <span className="section-eyebrow">Calculators & Reference</span>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            color: '#4E5B47',
            marginBottom: '0.85rem',
            lineHeight: 1.15
          }}
        >
          Every Tool a Chemist Needs
        </h1>
        <p style={{ color: '#5F6F5B', maxWidth: '680px', margin: '0 auto', fontSize: '1.08rem', lineHeight: 1.65 }}>
          From molar mass decomposition and matrix Gaussian balancing to Gibbs spontaneity thresholds and Henderson-Hasselbalch equations — engineered for precision research and rapid problem-solving.
        </p>
      </section>

      {/* Filter and Search Container */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>
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

        {/* Tools Grid — Full Width Cards with Edge-to-Edge Images */}
        {filteredTools.length > 0 ? (
          <div className="tools-grid">
            {filteredTools.map(tool => (
              <article
                key={tool.id}
                className="tool-card"
                onClick={() => setActiveTool(tool)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') setActiveTool(tool);
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
                <div className="tool-card__body">
                  <span className="tool-card__category">{tool.category}</span>
                  <h3 className="tool-card__title">{tool.title}</h3>
                  <p className="tool-card__desc">{tool.desc}</p>

                  <div className="tool-card__footer">
                    <span className="tool-card__action-text">Launch Calculator</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
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

      {/* Tool Modal Dialog */}
      <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />
    </div>
  );
};
