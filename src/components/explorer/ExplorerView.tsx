import React, { useState, useMemo, useRef } from 'react';
import { ElementCategory, ElementItem, ElementPhase } from '../../types/element';
import { ELEMENTS, CATEGORIES } from '../../data/elementsData';
import { ELEMENT_DETAILS } from '../../data/elementDetailsData';
import { ElementModal } from './ElementModal';

const CATEGORY_KEYS: { key: 'all' | ElementCategory; label: string }[] = [
  { key: 'all', label: 'All Categories' },
  { key: 'alkali-metal', label: 'Alkali Metals' },
  { key: 'alkaline-earth', label: 'Alkaline Earth' },
  { key: 'transition-metal', label: 'Transition Metals' },
  { key: 'post-transition', label: 'Post-Transition' },
  { key: 'metalloid', label: 'Metalloids' },
  { key: 'nonmetal', label: 'Nonmetals' },
  { key: 'halogen', label: 'Halogens' },
  { key: 'noble-gas', label: 'Noble Gases' },
  { key: 'lanthanide', label: 'Lanthanides' },
  { key: 'actinide', label: 'Actinides' }
];

const STATE_KEYS: { key: 'all' | ElementPhase; label: string }[] = [
  { key: 'all', label: 'All States' },
  { key: 'Solid', label: 'Solid' },
  { key: 'Liquid', label: 'Liquid' },
  { key: 'Gas', label: 'Gas' }
];

export const ExplorerView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ElementCategory>('all');
  const [selectedState, setSelectedState] = useState<'all' | ElementPhase>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | number>('all');
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');
  const [activeModalElement, setActiveModalElement] = useState<ElementItem | null>(null);

  const chipsScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollChips = (direction: 'left' | 'right') => {
    if (chipsScrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      chipsScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Filter matching elements
  const matchingSet = useMemo(() => {
    const s = search.trim().toLowerCase();
    const set = new Set<number>();

    ELEMENTS.forEach(el => {
      // Search query
      const matchesSearch =
        !s ||
        el.name.toLowerCase().includes(s) ||
        el.symbol.toLowerCase().includes(s) ||
        el.atomicNumber.toString() === s;

      // Category
      const matchesCategory = selectedCategory === 'all' || el.category === selectedCategory;

      // Period
      const matchesPeriod = selectedPeriod === 'all' || el.period === selectedPeriod;

      // State (Phase)
      const detail = ELEMENT_DETAILS[el.atomicNumber];
      const matchesState = selectedState === 'all' || detail?.phase === selectedState;

      if (matchesSearch && matchesCategory && matchesPeriod && matchesState) {
        set.add(el.atomicNumber);
      }
    });

    return set;
  }, [search, selectedCategory, selectedPeriod, selectedState]);

  const hasActiveFilters = search || selectedCategory !== 'all' || selectedState !== 'all' || selectedPeriod !== 'all';

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedState('all');
    setSelectedPeriod('all');
  };

  return (
    <div className="explorer-page" style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section className="explorer-hero" style={{ textAlign: 'center', paddingTop: '100px', paddingBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
            color: '#4E5B47',
            marginBottom: '0.75rem'
          }}
        >
          Explore the Elements
        </h1>
        <p style={{ color: '#5F6F5B', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Dive into the 118 building blocks of the universe. Search, filter, and discover atomic structures, electron
          configurations, and properties.
        </p>
      </section>

      {/* Filter Panel */}
      <section className="filter-panel" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem 1.5rem' }}>
        <div style={{ background: '#DCE0CF', border: '1px solid #6F7F63', borderRadius: '16px', padding: '1.25rem' }}>
          {/* Search bar */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by element name, symbol, or atomic number (e.g., Gold, Au, 79)..."
                className="filter-search__input"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1.5px solid #6F7F63',
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
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
                    fontSize: '1.2rem',
                    color: '#5F6F5B'
                  }}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div
              style={{
                display: 'flex',
                background: '#FAF8F5',
                borderRadius: '8px',
                border: '1px solid #6F7F63',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.6rem 1rem',
                  border: 'none',
                  background: viewMode === 'grid' ? '#6F7F63' : 'transparent',
                  color: viewMode === 'grid' ? '#FAF8F5' : '#4E5B47',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  padding: '0.6rem 1rem',
                  border: 'none',
                  background: viewMode === 'cards' ? '#6F7F63' : 'transparent',
                  color: viewMode === 'cards' ? '#FAF8F5' : '#4E5B47',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cards View
              </button>
            </div>
          </div>

          {/* Category Chips with Navigation Arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={() => scrollChips('left')}
              className="filter-arrow"
              style={{
                background: '#FAF8F5',
                border: '1px solid #6F7F63',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                color: '#4E5B47'
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
                gap: '0.5rem',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                padding: '4px 0'
              }}
            >
              {CATEGORY_KEYS.map(cat => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid #6F7F63',
                      background: isActive ? '#4E5B47' : '#FAF8F5',
                      color: isActive ? '#FAF8F5' : '#4E5B47',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => scrollChips('right')}
              className="filter-arrow"
              style={{
                background: '#FAF8F5',
                border: '1px solid #6F7F63',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                color: '#4E5B47'
              }}
              aria-label="Scroll categories right"
            >
              ›
            </button>
          </div>

          {/* Secondary Filters: State & Period */}
          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              borderTop: '1px solid rgba(111, 127, 99, 0.25)',
              paddingTop: '0.85rem'
            }}
          >
            {/* States */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5F6F5B', textTransform: 'uppercase' }}>
                State:
              </span>
              {STATE_KEYS.map(st => (
                <button
                  key={st.key}
                  onClick={() => setSelectedState(st.key)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    border: '1px solid #6F7F63',
                    background: selectedState === st.key ? '#6F7F63' : '#FAF8F5',
                    color: selectedState === st.key ? '#FAF8F5' : '#4E5B47',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Periods */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5F6F5B', textTransform: 'uppercase' }}>
                Period:
              </span>
              <button
                onClick={() => setSelectedPeriod('all')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  border: '1px solid #6F7F63',
                  background: selectedPeriod === 'all' ? '#6F7F63' : '#FAF8F5',
                  color: selectedPeriod === 'all' ? '#FAF8F5' : '#4E5B47',
                  cursor: 'pointer'
                }}
              >
                All
              </button>
              {[1, 2, 3, 4, 5, 6, 7].map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    border: '1px solid #6F7F63',
                    background: selectedPeriod === p ? '#6F7F63' : '#FAF8F5',
                    color: selectedPeriod === p ? '#FAF8F5' : '#4E5B47',
                    cursor: 'pointer'
                  }}
                >
                  P{p}
                </button>
              ))}
            </div>

            {/* Meta & Toggles */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#4E5B47', fontWeight: 600 }}>
                Showing {matchingSet.size} of 118 elements
              </span>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', color: '#4E5B47', fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={isHighlightMode}
                  onChange={e => setIsHighlightMode(e.target.checked)}
                />
                Highlight Mode
              </label>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    background: 'none',
                    border: '1px dashed #6F7F63',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    color: '#4E5B47',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Table or Card View */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        {viewMode === 'grid' ? (
          <div className="no-scrollbar" style={{ overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#5F6F5B', marginBottom: '0.5rem' }}>
              ← Scroll horizontally to view full 18 columns on smaller screens • Click any element for details →
            </p>
            <div
              className="explorer__grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(18, minmax(58px, 1fr))',
                gap: '5px',
                minWidth: '1080px',
                margin: '0 auto'
              }}
            >
              {/* Row markers for Lanthanides/Actinides */}
              <div
                style={{
                  gridRow: 6,
                  gridColumn: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#5F6F5B',
                  border: '1px dashed #6F7F63',
                  borderRadius: '6px'
                }}
              >
                57–71
              </div>
              <div
                style={{
                  gridRow: 7,
                  gridColumn: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#5F6F5B',
                  border: '1px dashed #6F7F63',
                  borderRadius: '6px'
                }}
              >
                89–103
              </div>

              <div
                style={{
                  gridRow: 9,
                  gridColumn: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#4E5B47',
                  background: '#fbeff4',
                  borderRadius: '6px',
                  border: '1px solid #d186a5'
                }}
              >
                Ln
              </div>
              <div
                style={{
                  gridRow: 10,
                  gridColumn: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#4E5B47',
                  background: '#fceced',
                  borderRadius: '6px',
                  border: '1px solid #cf7b81'
                }}
              >
                Ac
              </div>

              {/* Elements */}
              {ELEMENTS.map(el => {
                const isMatch = matchingSet.has(el.atomicNumber);
                const isDimmed = !isMatch && (isHighlightMode || search || selectedCategory !== 'all' || selectedState !== 'all' || selectedPeriod !== 'all');
                const cat = CATEGORIES[el.category];

                return (
                  <button
                    key={el.atomicNumber}
                    onClick={() => setActiveModalElement(el)}
                    className="element-tile"
                    style={{
                      gridRow: el.gridRow,
                      gridColumn: el.gridColumn,
                      background: cat ? cat.color : '#fff',
                      border: `1.5px solid ${isMatch && (search || selectedCategory !== 'all') ? '#1c2518' : cat?.border || '#6F7F63'}`,
                      borderRadius: '6px',
                      padding: '4px 2px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      opacity: isDimmed ? 0.22 : 1,
                      transform: isMatch && (search || selectedCategory !== 'all') ? 'scale(1.04)' : 'none',
                      boxShadow: isMatch && (search || selectedCategory !== 'all') ? '0 4px 10px rgba(0,0,0,0.14)' : 'none',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    title={`${el.name} (${el.symbol}) — No. ${el.atomicNumber}`}
                  >
                    <span style={{ fontSize: '0.65rem', color: '#5F6F5B', fontWeight: 600 }}>{el.atomicNumber}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4E5B47', lineHeight: 1.1 }}>{el.symbol}</span>
                    <span style={{ fontSize: '0.62rem', color: '#4E5B47', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '52px' }}>
                      {el.name}
                    </span>
                    <span style={{ fontSize: '0.55rem', color: '#5F6F5B' }}>{el.atomicMass}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Cards View: Ultra-responsive for mobile & rapid discovery */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1rem',
              padding: '1rem 0'
            }}
          >
            {ELEMENTS.filter(el => matchingSet.has(el.atomicNumber)).map(el => {
              const cat = CATEGORIES[el.category];
              const detail = ELEMENT_DETAILS[el.atomicNumber];

              return (
                <div
                  key={el.atomicNumber}
                  onClick={() => setActiveModalElement(el)}
                  style={{
                    background: cat ? cat.color : '#fff',
                    border: `1.5px solid ${cat ? cat.border : '#6F7F63'}`,
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5F6F5B' }}>#{el.atomicNumber}</span>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '8px', color: '#4E5B47' }}>
                      {detail?.phase || 'Solid'}
                    </span>
                  </div>

                  <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#4E5B47', lineHeight: 1 }}>{el.symbol}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#4E5B47', marginTop: '4px' }}>{el.name}</div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(111, 127, 99, 0.2)', paddingTop: '0.5rem', fontSize: '0.78rem', color: '#5F6F5B', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{cat ? cat.label : el.category}</span>
                    <span>{el.atomicMass} u</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div
          style={{
            marginTop: '2.5rem',
            background: '#DCE0CF',
            border: '1px solid #6F7F63',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.85rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {Object.entries(CATEGORIES).map(([key, item]) => (
            <div
              key={key}
              onClick={() => setSelectedCategory(selectedCategory === key ? 'all' : (key as ElementCategory))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                opacity: selectedCategory === 'all' || selectedCategory === key ? 1 : 0.4
              }}
            >
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  background: item.color,
                  border: `1.5px solid ${item.border}`
                }}
              />
              <span style={{ fontSize: '0.8rem', color: '#4E5B47', fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Detail Modal */}
      <ElementModal
        element={activeModalElement}
        onClose={() => setActiveModalElement(null)}
        onSelectElement={el => setActiveModalElement(el)}
        allElements={ELEMENTS}
      />
    </div>
  );
};

