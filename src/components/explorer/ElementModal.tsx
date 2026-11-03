import React, { useEffect } from 'react';
import { ElementItem } from '../../types/element';
import { ELEMENT_DETAILS } from '../../data/elementDetailsData';
import { CATEGORIES } from '../../data/elementsData';
import { ElectronShells } from './ElectronShells';

interface ElementModalProps {
  element: ElementItem | null;
  onClose: () => void;
  onSelectElement: (el: ElementItem) => void;
  allElements: ElementItem[];
}

export const ElementModal: React.FC<ElementModalProps> = ({
  element,
  onClose,
  onSelectElement,
  allElements
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!element) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        const idx = allElements.findIndex(el => el.atomicNumber === element.atomicNumber);
        if (idx > 0) onSelectElement(allElements[idx - 1]);
      } else if (e.key === 'ArrowRight') {
        const idx = allElements.findIndex(el => el.atomicNumber === element.atomicNumber);
        if (idx < allElements.length - 1) onSelectElement(allElements[idx + 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [element, allElements, onClose, onSelectElement]);

  if (!element) return null;

  const detail = ELEMENT_DETAILS[element.atomicNumber];
  const cat = CATEGORIES[element.category];

  const currentIndex = allElements.findIndex(el => el.atomicNumber === element.atomicNumber);
  const prevEl = currentIndex > 0 ? allElements[currentIndex - 1] : null;
  const nextEl = currentIndex < allElements.length - 1 ? allElements[currentIndex + 1] : null;

  return (
    <div
      className="modal-overlay is-open no-scrollbar"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(35, 42, 33, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto'
      }}
    >
      <div
        className="modal-panel no-scrollbar"
        style={{
          background: '#E6E2D3',
          border: '1.5px solid #6F7F63',
          borderRadius: '16px',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.16)',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem'
        }}
      >
        {/* Navigation & Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              disabled={!prevEl}
              onClick={() => prevEl && onSelectElement(prevEl)}
              style={{
                background: 'rgba(111, 127, 99, 0.15)',
                border: '1px solid #6F7F63',
                borderRadius: '8px',
                padding: '4px 10px',
                color: '#4E5B47',
                cursor: prevEl ? 'pointer' : 'not-allowed',
                opacity: prevEl ? 1 : 0.4
              }}
              title="Previous Element (Left Arrow)"
            >
              ← Prev ({prevEl?.symbol || '—'})
            </button>
            <button
              disabled={!nextEl}
              onClick={() => nextEl && onSelectElement(nextEl)}
              style={{
                background: 'rgba(111, 127, 99, 0.15)',
                border: '1px solid #6F7F63',
                borderRadius: '8px',
                padding: '4px 10px',
                color: '#4E5B47',
                cursor: nextEl ? 'pointer' : 'not-allowed',
                opacity: nextEl ? 1 : 0.4
              }}
              title="Next Element (Right Arrow)"
            >
              Next ({nextEl?.symbol || '—'}) →
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.75rem',
              color: '#4E5B47',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {/* Header Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(111, 127, 99, 0.3)',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-block',
                background: cat ? cat.color : '#e0ddd8',
                border: `1px solid ${cat ? cat.border : '#888'}`,
                color: '#2a3424',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.5rem'
              }}
            >
              {cat ? cat.label : element.category} • Period {element.period} • Group {element.group}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '2.5rem',
                  color: '#4E5B47',
                  margin: 0,
                  lineHeight: 1
                }}
              >
                {element.name}
              </h2>
              <span style={{ fontSize: '1.2rem', color: '#5F6F5B', fontWeight: 500 }}>
                ({element.symbol})
              </span>
            </div>
            <div style={{ color: '#5F6F5B', fontSize: '0.9rem', marginTop: '4px' }}>
              Atomic No. <strong>{element.atomicNumber}</strong> • Atomic Weight: <strong>{element.atomicMass} u</strong>
            </div>
          </div>

          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: cat ? cat.color : '#fff',
              border: `2px solid ${cat ? cat.border : '#6F7F63'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5F6F5B' }}>
              {element.atomicNumber}
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4E5B47', lineHeight: 1 }}>
              {element.symbol}
            </span>
          </div>
        </div>

        {/* Properties Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.75rem'
          }}
        >
          <div style={{ background: '#DCE0CF', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#5F6F5B', textTransform: 'uppercase', fontWeight: 600 }}>Phase</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#4E5B47' }}>{detail?.phase || '—'}</div>
          </div>
          <div style={{ background: '#DCE0CF', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#5F6F5B', textTransform: 'uppercase', fontWeight: 600 }}>Melting Point</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#4E5B47' }}>{detail?.mp || '—'}</div>
          </div>
          <div style={{ background: '#DCE0CF', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#5F6F5B', textTransform: 'uppercase', fontWeight: 600 }}>Boiling Point</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#4E5B47' }}>{detail?.bp || '—'}</div>
          </div>
          <div style={{ background: '#DCE0CF', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#5F6F5B', textTransform: 'uppercase', fontWeight: 600 }}>Density</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#4E5B47' }}>{detail?.density || '—'}</div>
          </div>
          <div style={{ background: '#DCE0CF', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#5F6F5B', textTransform: 'uppercase', fontWeight: 600 }}>Electronegativity</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#4E5B47' }}>{detail?.en || '—'}</div>
          </div>
          <div style={{ background: '#DCE0CF', padding: '0.75rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#5F6F5B', textTransform: 'uppercase', fontWeight: 600 }}>Oxidation States</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#4E5B47' }}>{detail?.ox || '—'}</div>
          </div>
        </div>

        {/* Electron Configuration */}
        <div
          style={{
            background: 'rgba(111, 127, 99, 0.12)',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: '#5F6F5B', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
              Electron Configuration
            </span>
            <code style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#4E5B47', fontWeight: 'bold' }}>
              {detail?.ec || '—'}
            </code>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#5F6F5B' }}>
            Discovered: <strong>{detail?.year || 'Ancient'}</strong> {detail?.by ? `by ${detail.by}` : ''}
          </div>
        </div>

        {/* Electron Shell Visualizer */}
        {detail?.shells && detail.shells.length > 0 && (
          <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', color: '#4E5B47', marginBottom: '0.75rem' }}>
              Bohr Atomic Model & Electron Shells
            </h3>
            <ElectronShells shells={detail.shells} symbol={element.symbol} size={280} />
          </div>
        )}

        {/* About & Uses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', color: '#4E5B47', marginBottom: '0.4rem' }}>
              Overview
            </h3>
            <p style={{ color: '#4E5B47', lineHeight: 1.6, fontSize: '0.95rem' }}>
              {detail?.desc || 'Element information details.'}
            </p>
          </div>

          {detail?.uses && detail.uses.length > 0 && (
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', color: '#4E5B47', marginBottom: '0.5rem' }}>
                Common Real-World Uses
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {detail.uses.map((use, i) => (
                  <span
                    key={i}
                    style={{
                      background: '#DCE0CF',
                      border: '1px solid rgba(111, 127, 99, 0.4)',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '0.85rem',
                      color: '#4E5B47',
                      fontWeight: 500
                    }}
                  >
                    ✦ {use}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

