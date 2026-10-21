import React from 'react';

interface ElectronShellsProps {
  shells: number[];
  symbol: string;
  size?: number;
}

const SHELL_LABELS = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

export const ElectronShells: React.FC<ElectronShellsProps> = ({ shells = [], symbol, size = 320 }) => {
  const center = size / 2;
  const numShells = shells.length || 1;
  const maxRadius = center - 24;
  const minRadius = 40;
  const radiusStep = (maxRadius - minRadius) / Math.max(numShells, 1);

  return (
    <div className="electron-shells-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible', maxWidth: '100%', height: 'auto' }}
      >
        <defs>
          <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8FA882" />
            <stop offset="100%" stopColor="#4E5B47" />
          </radialGradient>
        </defs>

        {/* Central Nucleus */}
        <circle
          cx={center}
          cy={center}
          r={22}
          fill="url(#nucleusGlow)"
          stroke="#4E5B47"
          strokeWidth="2"
        />
        <text
          x={center}
          y={center + 6}
          textAnchor="middle"
          fill="#FAF8F5"
          fontSize="15"
          fontWeight="bold"
          fontFamily="'Inter', sans-serif"
        >
          {symbol}
        </text>

        {/* Shell Rings and Orbiting Electrons */}
        {shells.map((count, shellIdx) => {
          const radius = minRadius + shellIdx * radiusStep;
          const animDuration = 10 + shellIdx * 4; // Outer shells orbit slower
          const isReverse = shellIdx % 2 === 1;

          return (
            <g key={shellIdx}>
              {/* Shell Orbit Ring */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#6F7F63"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity="0.45"
              />

              {/* Orbiting group */}
              <g
                style={{
                  transformOrigin: `${center}px ${center}px`,
                  animation: `spinElectron ${animDuration}s linear infinite ${isReverse ? 'reverse' : 'normal'}`
                }}
              >
                {Array.from({ length: count }).map((_, electronIdx) => {
                  const angle = (2 * Math.PI * electronIdx) / count;
                  const ex = center + radius * Math.cos(angle);
                  const ey = center + radius * Math.sin(angle);

                  return (
                    <circle
                      key={electronIdx}
                      cx={ex}
                      cy={ey}
                      r={4}
                      fill="#4E5B47"
                      stroke="#FAF8F5"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </g>
            </g>
          );
        })}
      </svg>

      {/* Shell Count Badges */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {shells.map((count, idx) => (
          <span
            key={idx}
            style={{
              fontSize: '0.8rem',
              background: '#DCE0CF',
              color: '#4E5B47',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 500
            }}
          >
            {SHELL_LABELS[idx] || `S${idx + 1}`}: <strong>{count}e⁻</strong>
          </span>
        ))}
      </div>
    </div>
  );
};

