import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface ElectronShellsProps {
  shells: number[];
  symbol: string;
  atomicNumber?: number;
  electronConfig?: string;
  size?: number;
}

const SHELL_META = [
  { letter: 'K', n: 1, max: 2, color: '#38B287', rgb: '56, 178, 135' },
  { letter: 'L', n: 2, max: 8, color: '#38A3A5', rgb: '56, 163, 165' },
  { letter: 'M', n: 3, max: 18, color: '#5E9CD3', rgb: '94, 156, 211' },
  { letter: 'N', n: 4, max: 32, color: '#8F8CE0', rgb: '143, 140, 224' },
  { letter: 'O', n: 5, max: 50, color: '#D48A5C', rgb: '212, 138, 92' },
  { letter: 'P', n: 6, max: 72, color: '#D97284', rgb: '217, 114, 132' },
  { letter: 'Q', n: 7, max: 98, color: '#E2B44C', rgb: '226, 180, 76' }
];

const VALENCE_COLOR = { hex: '#F2C14E', rgb: '242, 193, 78' };

// Balanced 3D orbital plane orientations (Euler tilts in radians)
const SHELL_TILTS: { rx: number; ry: number; rz: number }[] = [
  { rx: 0.44, ry: 0.16, rz: 0.25 },
  { rx: -0.6, ry: 0.54, rz: -0.35 },
  { rx: 0.84, ry: -0.46, rz: 0.62 },
  { rx: -0.34, ry: -0.84, rz: 0.48 },
  { rx: 0.66, ry: 0.78, rz: -0.52 },
  { rx: -0.86, ry: 0.28, rz: 0.74 },
  { rx: 0.26, ry: -0.62, rz: -0.78 }
];

const SPEED_OPTIONS = [0.5, 1, 2] as const;

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

function rotatePoint(p: Vec3, rx: number, ry: number, rz: number): Vec3 {
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const y1 = p.y * cx - p.z * sx;
  const z1 = p.y * sx + p.z * cx;
  const x1 = p.x;

  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const x2 = x1 * cy + z1 * sy;
  const z2 = -x1 * sy + z1 * cy;
  const y2 = y1;

  const cz = Math.cos(rz);
  const sz = Math.sin(rz);
  return {
    x: x2 * cz - y2 * sz,
    y: x2 * sz + y2 * cz,
    z: z2
  };
}

export const ElectronShells: React.FC<ElectronShellsProps> = ({
  shells = [],
  symbol,
  atomicNumber,
  electronConfig,
  size = 340
}) => {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [viewMode, setViewMode] = useState<'3d' | 'bohr'>('3d');
  const [isPaused, setIsPaused] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1); // 1x default
  const [focusedShell, setFocusedShell] = useState<number | null>(null);

  const speedMultiplier = SPEED_OPTIONS[speedIdx];

  const camRef = useRef({
    rotX: 0.34,
    rotY: -0.38,
    velX: 0,
    velY: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    modeBlend: 1, // 1 = full 3D, 0 = flat Bohr (smoothly interpolated!)
    speedBlend: 1 // smoothly eases pause/play & speed changes
  });

  const stateRef = useRef({
    viewMode,
    isPaused,
    speedMultiplier,
    focusedShell,
    shells,
    symbol,
    atomicNumber
  });

  useEffect(() => {
    stateRef.current = {
      viewMode,
      isPaused,
      speedMultiplier,
      focusedShell,
      shells,
      symbol,
      atomicNumber
    };
  }, [viewMode, isPaused, speedMultiplier, focusedShell, shells, symbol, atomicNumber]);

  useEffect(() => {
    setFocusedShell(null);
  }, [symbol, atomicNumber]);

  const l = (en: string, fr: string, ar: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const totalElectrons = shells.reduce((acc, n) => acc + n, 0);
  const valenceIdx = shells.length - 1;
  const valenceCount = valenceIdx >= 0 ? shells[valenceIdx] : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let lastTimestamp = performance.now();
    let simTime = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasSize = Math.max(size, 320);
    canvas.width = Math.floor(canvasSize * dpr);
    canvas.height = Math.floor(canvasSize * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = canvasSize / 2;
    const cy = canvasSize / 2;
    const focal = canvasSize * 1.95;

    const project = (p: Vec3) => {
      const perspective = focal / (focal - p.z);
      return {
        x: cx + p.x * perspective,
        y: cy + p.y * perspective,
        z: p.z,
        scale: perspective
      };
    };

    const drawFrame = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.05);
      lastTimestamp = now;

      const {
        viewMode: mode,
        isPaused: paused,
        speedMultiplier: targetSpeedMult,
        focusedShell: activeShell,
        shells: currentShells,
        symbol: currentSymbol,
        atomicNumber: currentZ
      } = stateRef.current;

      const cam = camRef.current;

      // Smoothly ease orbital speed on Pause/Play and speed changes
      const targetSpeed = paused ? 0 : targetSpeedMult;
      cam.speedBlend += (targetSpeed - cam.speedBlend) * Math.min(1, dt * 8);
      simTime += dt * cam.speedBlend;

      // Smoothly morph between 3D Tilted Shells (1) and Flat Bohr Disc (0)
      const targetBlend = mode === '3d' ? 1 : 0;
      cam.modeBlend += (targetBlend - cam.modeBlend) * Math.min(1, dt * 6.5);
      const blend = cam.modeBlend;

      // Smooth camera inertia & gentle 3D precession
      if (!cam.dragging) {
        cam.rotX += cam.velX;
        cam.rotY += cam.velY + (blend > 0.05 ? 0.24 * dt * cam.speedBlend * blend : 0);
        cam.velX *= Math.pow(0.92, dt * 60);
        cam.velY *= Math.pow(0.92, dt * 60);
      }

      const effectiveRotX = 0.2 * (1 - blend) + cam.rotX * blend;
      const effectiveRotY = cam.rotY * blend;

      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Subtle radial scientific chamber glow
      const pulse = 0.5 + 0.5 * Math.sin(simTime * 2.2);
      const bgGrad = ctx.createRadialGradient(cx, cy, 12, cx, cy, canvasSize * 0.56);
      bgGrad.addColorStop(0, `rgba(46, 125, 91, ${0.19 + pulse * 0.05})`);
      bgGrad.addColorStop(0.55, 'rgba(20, 32, 24, 0.08)');
      bgGrad.addColorStop(1, 'rgba(12, 20, 15, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Faint instrument crosshairs
      ctx.strokeStyle = 'rgba(220, 224, 207, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, 16);
      ctx.lineTo(cx, canvasSize - 16);
      ctx.moveTo(16, cy);
      ctx.lineTo(canvasSize - 16, cy);
      ctx.stroke();

      const numShells = Math.max(currentShells.length, 1);
      const minRadius = numShells <= 2 ? 50 : numShells <= 4 ? 40 : 32;
      const maxRadius = canvasSize * 0.43;
      const step = numShells > 1 ? (maxRadius - minRadius) / (numShells - 1) : 0;

      type RenderItem = {
        x: number;
        y: number;
        z: number;
        scale: number;
        rgb: string;
        isValence: boolean;
        dimmed: boolean;
        trail: { x: number; y: number }[];
      };

      const ringSegmentsBack: Array<{
        pts: { x: number; y: number }[];
        color: string;
        alpha: number;
        width: number;
      }> = [];

      const ringSegmentsFront: Array<{
        pts: { x: number; y: number }[];
        color: string;
        alpha: number;
        width: number;
      }> = [];

      const electrons: RenderItem[] = [];

      currentShells.forEach((electronCount, sIdx) => {
        const radius = minRadius + sIdx * step;
        const meta = SHELL_META[sIdx] || SHELL_META[SHELL_META.length - 1];
        const isValence = sIdx === currentShells.length - 1;
        const shellRgb = isValence ? VALENCE_COLOR.rgb : meta.rgb;
        const isDimmed = activeShell !== null && activeShell !== sIdx;
        const isHighlighted = activeShell === sIdx;

        const baseTilt = SHELL_TILTS[sIdx % SHELL_TILTS.length];
        const tilt = {
          rx: baseTilt.rx * blend,
          ry: baseTilt.ry * blend,
          rz: baseTilt.rz * blend
        };

        // Sample 3D ring split by back (z < 0) and front (z >= 0) for true depth occlusion around nucleus
        const segCount = 96;
        let currentBack: { x: number; y: number }[] = [];
        let currentFront: { x: number; y: number }[] = [];

        const flushBack = () => {
          if (currentBack.length > 1) {
            ringSegmentsBack.push({
              pts: currentBack,
              color: shellRgb,
              alpha: isDimmed ? 0.1 : isHighlighted ? 0.58 : isValence ? 0.42 : 0.28,
              width: isHighlighted ? 1.9 : isValence ? 1.45 : 1.1
            });
          }
          currentBack = [];
        };

        const flushFront = () => {
          if (currentFront.length > 1) {
            ringSegmentsFront.push({
              pts: currentFront,
              color: shellRgb,
              alpha: isDimmed ? 0.14 : isHighlighted ? 0.92 : isValence ? 0.72 : 0.48,
              width: isHighlighted ? 2.1 : isValence ? 1.65 : 1.25
            });
          }
          currentFront = [];
        };

        for (let i = 0; i <= segCount; i++) {
          const theta = (i / segCount) * Math.PI * 2;
          const local: Vec3 = {
            x: Math.cos(theta) * radius,
            y: Math.sin(theta) * radius,
            z: 0
          };
          const tilted = rotatePoint(local, tilt.rx, tilt.ry, tilt.rz);
          const world = rotatePoint(tilted, effectiveRotX, effectiveRotY, 0);
          const proj = project(world);

          if (world.z < 0) {
            flushFront();
            currentBack.push({ x: proj.x, y: proj.y });
          } else {
            flushBack();
            currentFront.push({ x: proj.x, y: proj.y });
          }
        }
        flushBack();
        flushFront();

        // Smooth continuous orbital motion — inner shells orbit faster, alternating directions for dynamic 3D feel
        const dir = sIdx % 2 === 0 ? 1 : -1;
        const angularVel = (1.75 / (1 + sIdx * 0.22)) * dir;
        const baseAngle = simTime * angularVel + sIdx * 0.85;

        // Curved fading wake trail behind every moving electron
        const trailSteps = electronCount <= 10 || isHighlighted ? 8 : electronCount <= 18 ? 5 : 3;
        const trailArcStep = 0.055 * (electronCount > 18 ? 0.65 : 1);

        for (let eIdx = 0; eIdx < electronCount; eIdx++) {
          const angle = baseAngle + (eIdx / electronCount) * Math.PI * 2;
          const local: Vec3 = {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: 0
          };
          const tilted = rotatePoint(local, tilt.rx, tilt.ry, tilt.rz);
          const world = rotatePoint(tilted, effectiveRotX, effectiveRotY, 0);
          const proj = project(world);

          const trail: { x: number; y: number }[] = [];
          if (!isDimmed && cam.speedBlend > 0.05) {
            for (let t = 1; t <= trailSteps; t++) {
              const tAngle = angle - dir * t * trailArcStep;
              const tLocal: Vec3 = {
                x: Math.cos(tAngle) * radius,
                y: Math.sin(tAngle) * radius,
                z: 0
              };
              const tTilted = rotatePoint(tLocal, tilt.rx, tilt.ry, tilt.rz);
              const tWorld = rotatePoint(tTilted, effectiveRotX, effectiveRotY, 0);
              const tProj = project(tWorld);
              trail.push({ x: tProj.x, y: tProj.y });
            }
          }

          electrons.push({
            x: proj.x,
            y: proj.y,
            z: world.z,
            scale: proj.scale,
            rgb: shellRgb,
            isValence,
            dimmed: isDimmed,
            trail
          });
        }
      });

      // 1. Back hemisphere orbital rings
      for (const seg of ringSegmentsBack) {
        ctx.strokeStyle = `rgba(${seg.color}, ${seg.alpha})`;
        ctx.lineWidth = seg.width;
        ctx.beginPath();
        seg.pts.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      }

      // Sort electrons back-to-front by Z
      electrons.sort((a, b) => a.z - b.z);

      const drawElectron = (el: RenderItem) => {
        const depthNorm = Math.max(0.35, Math.min(1, (el.z + maxRadius) / (2 * maxRadius)));
        const baseR = el.isValence ? 4.4 : currentShells.length >= 6 ? 3.2 : 3.7;
        const r = Math.max(1.9, baseR * el.scale);
        const alpha = el.dimmed ? 0.16 : 0.48 + depthNorm * 0.52;

        // Smooth tapered curved orbital wake trail
        if (el.trail.length > 0 && !el.dimmed) {
          let prevX = el.x;
          let prevY = el.y;
          for (let i = 0; i < el.trail.length; i++) {
            const pt = el.trail[i];
            const fade = 1 - (i + 1) / (el.trail.length + 1);
            ctx.strokeStyle = `rgba(${el.rgb}, ${alpha * fade * 0.62})`;
            ctx.lineWidth = Math.max(0.8, r * 0.75 * fade);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(pt.x, pt.y);
            ctx.stroke();
            prevX = pt.x;
            prevY = pt.y;
          }
        }

        // Luminous halo for valence and near-side electrons
        if (!el.dimmed && (el.isValence || depthNorm > 0.55)) {
          const glowR = r * (el.isValence ? 2.8 : 2.15);
          const g = ctx.createRadialGradient(el.x, el.y, r * 0.2, el.x, el.y, glowR);
          g.addColorStop(0, `rgba(${el.rgb}, ${alpha * 0.58})`);
          g.addColorStop(1, `rgba(${el.rgb}, 0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(el.x, el.y, glowR, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3D lit sphere
        const eGrad = ctx.createRadialGradient(
          el.x - r * 0.32,
          el.y - r * 0.32,
          r * 0.12,
          el.x,
          el.y,
          r
        );
        eGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        eGrad.addColorStop(0.45, `rgba(${el.rgb}, ${alpha})`);
        eGrad.addColorStop(1, `rgba(18, 28, 22, ${alpha * 0.9})`);

        ctx.fillStyle = eGrad;
        ctx.beginPath();
        ctx.arc(el.x, el.y, r, 0, Math.PI * 2);
        ctx.fill();
      };

      // 2. Draw electrons behind the nucleus
      for (const el of electrons) {
        if (el.z < 0) drawElectron(el);
      }

      // 3. Draw 3D pulsing central nucleus particle
      const nucRadius = (currentShells.length >= 6 ? 19 : 22) + Math.sin(simTime * 2.5) * 0.6;
      const halo = ctx.createRadialGradient(cx, cy, nucRadius * 0.35, cx, cy, nucRadius * 2.25);
      halo.addColorStop(0, `rgba(56, 178, 135, ${0.42 + pulse * 0.12})`);
      halo.addColorStop(0.55, 'rgba(242, 193, 78, 0.16)');
      halo.addColorStop(1, 'rgba(56, 178, 135, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, nucRadius * 2.25, 0, Math.PI * 2);
      ctx.fill();

      const sphereGrad = ctx.createRadialGradient(
        cx - nucRadius * 0.34,
        cy - nucRadius * 0.34,
        nucRadius * 0.14,
        cx,
        cy,
        nucRadius
      );
      sphereGrad.addColorStop(0, '#E8F3E5');
      sphereGrad.addColorStop(0.32, '#5E9B77');
      sphereGrad.addColorStop(0.76, '#2D4B38');
      sphereGrad.addColorStop(1, '#19291E');

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, nucRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(232, 243, 229, 0.55)';
      ctx.lineWidth = 1.25;
      ctx.stroke();

      ctx.fillStyle = '#FAF8F4';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `700 ${currentSymbol.length > 1 ? 13 : 15}px "Space Grotesk", "Inter", sans-serif`;
      ctx.fillText(currentSymbol, cx, currentZ ? cy - 3 : cy);

      if (currentZ) {
        ctx.fillStyle = 'rgba(242, 193, 78, 0.96)';
        ctx.font = '700 8.5px "JetBrains Mono", monospace';
        ctx.fillText(`${currentZ}p⁺`, cx, cy + 9);
      }

      // 4. Front hemisphere orbital rings
      for (const seg of ringSegmentsFront) {
        ctx.strokeStyle = `rgba(${seg.color}, ${seg.alpha})`;
        ctx.lineWidth = seg.width;
        ctx.beginPath();
        seg.pts.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      }

      // 5. Draw electrons passing in front of the nucleus
      for (const el of electrons) {
        if (el.z >= 0) drawElectron(el);
      }

      animId = requestAnimationFrame(drawFrame);
    };

    animId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animId);
  }, [size]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (viewMode !== '3d') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    camRef.current.dragging = true;
    camRef.current.lastX = e.clientX;
    camRef.current.lastY = e.clientY;
    camRef.current.velX = 0;
    camRef.current.velY = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!camRef.current.dragging || viewMode !== '3d') return;
    const dx = e.clientX - camRef.current.lastX;
    const dy = e.clientY - camRef.current.lastY;
    camRef.current.lastX = e.clientX;
    camRef.current.lastY = e.clientY;
    camRef.current.rotY += dx * 0.011;
    camRef.current.rotX += dy * 0.011;
    camRef.current.velY = dx * 0.0025;
    camRef.current.velX = dy * 0.0025;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (camRef.current.dragging) {
      camRef.current.dragging = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore if already released
      }
    }
  };

  const handleResetView = () => {
    camRef.current.rotX = 0.34;
    camRef.current.rotY = -0.38;
    camRef.current.velX = 0;
    camRef.current.velY = 0;
    setFocusedShell(null);
  };

  const cycleSpeed = () => {
    setSpeedIdx(prev => (prev + 1) % SPEED_OPTIONS.length);
    if (isPaused) setIsPaused(false);
  };

  const activeMeta = focusedShell !== null ? SHELL_META[focusedShell] : null;
  const activeCount = focusedShell !== null ? shells[focusedShell] : null;

  return (
    <div className="shells3d-chamber">
      {/* Top Instrument Bar */}
      <div className="shells3d-header">
        <div className="shells3d-telemetry formula-ltr">
          <span className="shells3d-dot" />
          <span>
            {totalElectrons} e⁻ · {shells.length}{' '}
            {l(
              shells.length === 1 ? 'shell' : 'shells',
              shells.length === 1 ? 'couche' : 'couches',
              shells.length === 1 ? 'مدار' : 'مدارات'
            )}
          </span>
        </div>

        <div className="shells3d-controls" role="group" aria-label="3D Shell Controls">
          <button
            type="button"
            className={`shells3d-btn ${viewMode === '3d' ? 'is-active' : ''}`}
            onClick={() => setViewMode('3d')}
          >
            3D
          </button>
          <button
            type="button"
            className={`shells3d-btn ${viewMode === 'bohr' ? 'is-active' : ''}`}
            onClick={() => setViewMode('bohr')}
          >
            {l('Bohr', 'Bohr', 'بور')}
          </button>
          <button
            type="button"
            className="shells3d-btn"
            onClick={cycleSpeed}
            title={l('Change orbit speed', 'Changer la vitesse', 'تغيير سرعة الدوران')}
          >
            {speedMultiplier}×
          </button>
          <button
            type="button"
            className="shells3d-btn"
            onClick={() => setIsPaused(p => !p)}
            title={isPaused ? l('Resume orbit', 'Reprendre', 'تشغيل') : l('Pause orbit', 'Pause', 'إيقاف مؤقت')}
          >
            {isPaused ? '▶' : '❚❚'}
          </button>
          {viewMode === '3d' && (
            <button
              type="button"
              className="shells3d-btn"
              onClick={handleResetView}
              title={l('Reset 3D angle', 'Réinitialiser l’angle', 'إعادة ضبط الزاوية')}
            >
              ↺
            </button>
          )}
        </div>
      </div>

      {/* Interactive 3D Canvas Viewport */}
      <div className="shells3d-viewport">
        <canvas
          ref={canvasRef}
          className={`shells3d-canvas ${viewMode === '3d' ? 'is-draggable' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-label={`3D Electron Shell Distribution for ${symbol}: ${shells.join(', ')}`}
        />

        <div className="shells3d-overlay-bottom">
          <span className="shells3d-hint">
            {activeMeta && activeCount !== null
              ? `${l('Shell', 'Couche', 'المدار')} ${activeMeta.letter} (n=${activeMeta.n}): ${activeCount} / ${activeMeta.max} e⁻${
                  focusedShell === valenceIdx ? ` · ${l('Valence', 'Valence', 'التكافؤ')}` : ''
                }`
              : viewMode === '3d'
              ? l('Drag to rotate 3D atom · Click a shell below to isolate', 'Glissez pour pivoter en 3D · Cliquez une couche', 'اسحب لتدوير الذرة ثلاثياً · انقر على مدار للتمييز')
              : l('Smooth Bohr projection · Click a shell below to isolate', 'Projection de Bohr fluide · Cliquez une couche', 'مسقط بور السلس · انقر على مدار للتمييز')}
          </span>
        </div>
      </div>

      {/* Interactive Shell Distribution Cards (K → Q) */}
      <div className="shells3d-footer">
        <div className="shells3d-summary-row">
          <span className="shells3d-valence-pill">
            <span className="shells3d-valence-dot" />
            <span>
              {l('Valence Electrons', 'Électrons de valence', 'إلكترونات التكافؤ')}:{' '}
              <strong className="formula-ltr">{valenceCount} e⁻</strong> ({SHELL_META[valenceIdx]?.letter || `n=${shells.length}`})
            </span>
          </span>
          {electronConfig && (
            <span className="shells3d-ec formula-ltr">{electronConfig}</span>
          )}
        </div>

        <div className="shells3d-chips" role="list">
          {shells.map((count, idx) => {
            const meta = SHELL_META[idx] || { letter: `S${idx + 1}`, n: idx + 1, max: 2 * (idx + 1) * (idx + 1), color: '#6F7F63' };
            const isValence = idx === valenceIdx;
            const chipColor = isValence ? VALENCE_COLOR.hex : meta.color;
            const isSelected = focusedShell === idx;
            const pct = Math.min(100, Math.round((count / meta.max) * 100));

            return (
              <button
                key={idx}
                type="button"
                role="listitem"
                onClick={() => setFocusedShell(prev => (prev === idx ? null : idx))}
                onMouseEnter={() => setFocusedShell(idx)}
                onMouseLeave={() => setFocusedShell(null)}
                className={`shells3d-chip ${isSelected ? 'is-selected' : ''} ${isValence ? 'is-valence' : ''}`}
                style={{ '--shell-color': chipColor } as React.CSSProperties}
                title={`${meta.letter} (n=${meta.n}): ${count} / ${meta.max} e⁻`}
              >
                <div className="shells3d-chip__top formula-ltr">
                  <span className="shells3d-chip__letter">{meta.letter}</span>
                  <span className="shells3d-chip__n">n={meta.n}</span>
                </div>
                <div className="shells3d-chip__count formula-ltr">
                  <strong>{count}</strong>
                  <span>/{meta.max}</span>
                </div>
                <div className="shells3d-chip__bar">
                  <span style={{ width: `${pct}%`, background: chipColor }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
