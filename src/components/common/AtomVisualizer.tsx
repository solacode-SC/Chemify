import React from 'react';

export const AtomVisualizer: React.FC<{ size?: number }> = ({ size = 260 }) => {
  return (
    <div
      className="about__atom-wrap"
      style={
        {
          '--atom-size': `${size}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '900px',
          width: `min(${size}px, 72vw)`,
          height: `min(${size}px, 72vw)`,
          margin: '0 auto',
          position: 'relative'
        } as React.CSSProperties
      }
    >
      {/* Ambient Quantum Core Halo */}
      <div className="about__atom-halo" aria-hidden="true" />

      <div
        className="about__atom"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Luminous Nucleus */}
        <div
          className="about__nucleus"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '17%',
            height: '17%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #A5F3FC 0%, #22D3EE 40%, #10B981 78%, #6366F1 100%)',
            boxShadow: '0 0 28px rgba(34, 211, 238, 0.7), 0 0 56px rgba(139, 92, 246, 0.4)'
          }}
        />

        {/* Orbit 1 — Electric Cyan */}
        <div
          className="about__orbit about__orbit--1"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '90%',
            height: '38%',
            margin: '-19% 0 0 -45%',
            border: '1.6px solid rgba(34, 211, 238, 0.55)',
            boxShadow: '0 0 14px rgba(34, 211, 238, 0.16) inset',
            borderRadius: '50%',
            transform: 'rotate(0deg)'
          }}
        >
          <div
            className="about__electron"
            style={{
              position: 'absolute',
              top: '-5.5px',
              left: '50%',
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              backgroundColor: '#67E8F9',
              boxShadow: '0 0 14px #22D3EE, 0 0 26px rgba(34, 211, 238, 0.9)'
            }}
          />
        </div>

        {/* Orbit 2 — Quantum Violet */}
        <div
          className="about__orbit about__orbit--2"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '90%',
            height: '38%',
            margin: '-19% 0 0 -45%',
            border: '1.6px solid rgba(167, 139, 250, 0.55)',
            boxShadow: '0 0 14px rgba(167, 139, 250, 0.16) inset',
            borderRadius: '50%',
            transform: 'rotate(60deg)'
          }}
        >
          <div
            className="about__electron"
            style={{
              position: 'absolute',
              top: '-5.5px',
              left: '50%',
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              backgroundColor: '#C4B5FD',
              boxShadow: '0 0 14px #A78BFA, 0 0 26px rgba(167, 139, 250, 0.9)'
            }}
          />
        </div>

        {/* Orbit 3 — Bioluminescent Emerald */}
        <div
          className="about__orbit about__orbit--3"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '90%',
            height: '38%',
            margin: '-19% 0 0 -45%',
            border: '1.6px solid rgba(52, 211, 153, 0.55)',
            boxShadow: '0 0 14px rgba(52, 211, 153, 0.16) inset',
            borderRadius: '50%',
            transform: 'rotate(-60deg)'
          }}
        >
          <div
            className="about__electron"
            style={{
              position: 'absolute',
              top: '-5.5px',
              left: '50%',
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              backgroundColor: '#6EE7B7',
              boxShadow: '0 0 14px #34D399, 0 0 26px rgba(52, 211, 153, 0.9)'
            }}
          />
        </div>
      </div>
    </div>
  );
};
