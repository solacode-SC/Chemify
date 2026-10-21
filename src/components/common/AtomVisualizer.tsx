import React from 'react';

export const AtomVisualizer: React.FC<{ size?: number }> = ({ size = 260 }) => {
  return (
    <div
      className="about__atom-wrap"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '800px',
        width: size,
        height: size,
        margin: '0 auto'
      }}
    >
      <div
        className="about__atom"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Nucleus */}
        <div
          className="about__nucleus"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: size * 0.16,
            height: size * 0.16,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #6F7F63 0%, #4E5B47 100%)',
            boxShadow: '0 0 20px rgba(111, 127, 99, 0.45)'
          }}
        />

        {/* Orbit 1 */}
        <div
          className="about__orbit about__orbit--1"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: size * 0.88,
            height: size * 0.38,
            margin: `-${(size * 0.38) / 2}px 0 0 -${(size * 0.88) / 2}px`,
            border: '1.5px solid rgba(78, 91, 71, 0.45)',
            borderRadius: '50%',
            transform: 'rotate(0deg)'
          }}
        >
          <div
            className="about__electron"
            style={{
              position: 'absolute',
              top: '-5px',
              left: '50%',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#4E5B47',
              boxShadow: '0 0 10px rgba(78, 91, 71, 0.8)'
            }}
          />
        </div>

        {/* Orbit 2 */}
        <div
          className="about__orbit about__orbit--2"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: size * 0.88,
            height: size * 0.38,
            margin: `-${(size * 0.38) / 2}px 0 0 -${(size * 0.88) / 2}px`,
            border: '1.5px solid rgba(78, 91, 71, 0.45)',
            borderRadius: '50%',
            transform: 'rotate(60deg)'
          }}
        >
          <div
            className="about__electron"
            style={{
              position: 'absolute',
              top: '-5px',
              left: '50%',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#4E5B47',
              boxShadow: '0 0 10px rgba(78, 91, 71, 0.8)'
            }}
          />
        </div>

        {/* Orbit 3 */}
        <div
          className="about__orbit about__orbit--3"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: size * 0.88,
            height: size * 0.38,
            margin: `-${(size * 0.38) / 2}px 0 0 -${(size * 0.88) / 2}px`,
            border: '1.5px solid rgba(78, 91, 71, 0.45)',
            borderRadius: '50%',
            transform: 'rotate(-60deg)'
          }}
        >
          <div
            className="about__electron"
            style={{
              position: 'absolute',
              top: '-5px',
              left: '50%',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#4E5B47',
              boxShadow: '0 0 10px rgba(78, 91, 71, 0.8)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

