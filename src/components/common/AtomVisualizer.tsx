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
      {/* Ambient Sunlit Botanical Halo */}
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
        {/* Warm Botanical Emerald-Gold Nucleus */}
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
            background: 'radial-gradient(circle at 32% 32%, #E8C97E 0%, #5B8C68 48%, #2F4231 100%)',
            boxShadow: '0 0 24px rgba(46, 125, 91, 0.45), 0 0 42px rgba(198, 146, 58, 0.25)'
          }}
        />

        {/* Orbit 1 — Botanical Emerald */}
        <div
          className="about__orbit about__orbit--1"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '90%',
            height: '38%',
            margin: '-19% 0 0 -45%',
            border: '1.7px solid rgba(46, 125, 91, 0.55)',
            boxShadow: '0 0 12px rgba(46, 125, 91, 0.14) inset',
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
              backgroundColor: '#2E7D5B',
              boxShadow: '0 0 12px rgba(46, 125, 91, 0.8), 0 0 20px rgba(46, 125, 91, 0.45)'
            }}
          />
        </div>

        {/* Orbit 2 — Verdigris Teal */}
        <div
          className="about__orbit about__orbit--2"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '90%',
            height: '38%',
            margin: '-19% 0 0 -45%',
            border: '1.7px solid rgba(44, 122, 123, 0.5)',
            boxShadow: '0 0 12px rgba(44, 122, 123, 0.12) inset',
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
              backgroundColor: '#2C7A7B',
              boxShadow: '0 0 12px rgba(44, 122, 123, 0.8), 0 0 20px rgba(44, 122, 123, 0.45)'
            }}
          />
        </div>

        {/* Orbit 3 — Alchemical Copper Gold */}
        <div
          className="about__orbit about__orbit--3"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '90%',
            height: '38%',
            margin: '-19% 0 0 -45%',
            border: '1.7px solid rgba(198, 146, 58, 0.55)',
            boxShadow: '0 0 12px rgba(198, 146, 58, 0.14) inset',
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
              backgroundColor: '#C6923A',
              boxShadow: '0 0 12px rgba(198, 146, 58, 0.8), 0 0 20px rgba(198, 146, 58, 0.45)'
            }}
          />
        </div>
      </div>
    </div>
  );
};
