import React, { useEffect, useRef } from 'react';

const PALETTE = [
  { r: 46, g: 125, b: 91 },  // Botanical Emerald
  { r: 44, g: 122, b: 123 }, // Mineral Verdigris Teal
  { r: 78, g: 91, b: 71 },   // Deep Olive Sage
  { r: 198, g: 146, b: 58 }, // Alchemical Gold
  { r: 194, g: 109, b: 74 }  // Burnished Copper
];

type MoleculeKind = 'benzene' | 'water' | 'methane' | 'diatomic';

export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    const mouse = { x: -1000, y: -1000, active: false };

    const HEX_R = 46;
    const HEX_W = Math.sqrt(3) * HEX_R;
    const HEX_H = 1.5 * HEX_R;

    class FloatingMolecule {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      angle = 0;
      vAngle = 0;
      scale = 1;
      kind: MoleculeKind = 'benzene';
      color = PALETTE[0];
      alpha = 0.22;

      constructor() {
        this.reset(true);
      }

      reset(randomPos = false) {
        this.x = randomPos ? Math.random() * (width || 1200) : Math.random() > 0.5 ? -60 : (width || 1200) + 60;
        this.y = Math.random() * (height || 800);
        this.vx = (Math.random() - 0.5) * 0.38;
        this.vy = -0.15 - Math.random() * 0.28;
        this.angle = Math.random() * Math.PI * 2;
        this.vAngle = (Math.random() - 0.5) * 0.0045;
        this.scale = 0.65 + Math.random() * 0.75;
        const kinds: MoleculeKind[] = ['benzene', 'water', 'methane', 'diatomic'];
        this.kind = kinds[Math.floor(Math.random() * kinds.length)];
        this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        this.alpha = 0.16 + Math.random() * 0.18;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.vAngle;

        // Gentle magnetic push away from pointer for playful interactivity
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 1 && dist < 170) {
            const force = ((170 - dist) / 170) * 0.32;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
          }
        }

        if (this.y < -80) this.y = height + 70;
        if (this.x < -90) this.x = width + 80;
        if (this.x > width + 90) this.x = -80;
      }

      draw(c: CanvasRenderingContext2D) {
        const { r, g, b } = this.color;
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        c.scale(this.scale, this.scale);

        c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha * 1.15})`;
        c.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha * 1.4})`;
        c.lineWidth = 1.4;

        if (this.kind === 'benzene') {
          const rad = 22;
          c.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i;
            const px = Math.cos(a) * rad;
            const py = Math.sin(a) * rad;
            if (i === 0) c.moveTo(px, py);
            else c.lineTo(px, py);
          }
          c.closePath();
          c.stroke();

          // Aromatic inner resonance circle
          c.beginPath();
          c.setLineDash([4, 3]);
          c.arc(0, 0, rad * 0.56, 0, Math.PI * 2);
          c.stroke();
          c.setLineDash([]);

          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i;
            c.beginPath();
            c.arc(Math.cos(a) * rad, Math.sin(a) * rad, 2.7, 0, Math.PI * 2);
            c.fill();
          }
        } else if (this.kind === 'water') {
          const arm = 20;
          const a1 = -0.92;
          const a2 = 0.92;
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(Math.cos(a1) * arm, Math.sin(a1) * arm);
          c.moveTo(0, 0);
          c.lineTo(Math.cos(a2) * arm, Math.sin(a2) * arm);
          c.stroke();

          c.beginPath();
          c.arc(0, 0, 5.2, 0, Math.PI * 2);
          c.fill();
          c.beginPath();
          c.arc(Math.cos(a1) * arm, Math.sin(a1) * arm, 3.2, 0, Math.PI * 2);
          c.arc(Math.cos(a2) * arm, Math.sin(a2) * arm, 3.2, 0, Math.PI * 2);
          c.fill();
        } else if (this.kind === 'methane') {
          const arm = 21;
          for (let i = 0; i < 4; i++) {
            const a = (Math.PI / 2) * i + 0.35;
            const px = Math.cos(a) * arm;
            const py = Math.sin(a) * arm;
            c.beginPath();
            c.moveTo(0, 0);
            c.lineTo(px, py);
            c.stroke();
            c.beginPath();
            c.arc(px, py, 2.8, 0, Math.PI * 2);
            c.fill();
          }
          c.beginPath();
          c.arc(0, 0, 4.8, 0, Math.PI * 2);
          c.fill();
        } else {
          // Double-bonded diatomic molecule (e.g. O=O)
          c.beginPath();
          c.moveTo(-14, -2.5);
          c.lineTo(14, -2.5);
          c.moveTo(-14, 2.5);
          c.lineTo(14, 2.5);
          c.stroke();
          c.beginPath();
          c.arc(-15, 0, 4.4, 0, Math.PI * 2);
          c.arc(15, 0, 4.4, 0, Math.PI * 2);
          c.fill();
        }

        c.restore();
      }
    }

    class Bubble {
      x = 0;
      y = 0;
      r = 3;
      vy = 0.4;
      wobblePhase = 0;
      wobbleAmp = 0.4;
      color = PALETTE[0];
      alpha = 0.25;

      constructor() {
        this.reset(true);
      }

      reset(randomY = false) {
        this.x = Math.random() * (width || 1200);
        this.y = randomY ? Math.random() * (height || 800) : (height || 800) + 20;
        this.r = 2.2 + Math.random() * 5.2;
        this.vy = 0.28 + Math.random() * 0.55;
        this.wobblePhase = Math.random() * Math.PI * 2;
        this.wobbleAmp = 0.25 + Math.random() * 0.55;
        this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        this.alpha = 0.16 + Math.random() * 0.22;
      }

      update() {
        this.y -= this.vy;
        this.wobblePhase += 0.025;
        this.x += Math.sin(this.wobblePhase) * this.wobbleAmp;
        if (this.y < -20) this.reset(false);
      }

      draw(c: CanvasRenderingContext2D) {
        const { r, g, b } = this.color;
        c.save();
        c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha * 1.15})`;
        c.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.65})`;
        c.lineWidth = 1;
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        c.fill();
        c.stroke();

        // Tiny specular highlight dot
        c.fillStyle = `rgba(255, 255, 255, ${this.alpha * 1.9})`;
        c.beginPath();
        c.arc(this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.26, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    const molecules: FloatingMolecule[] = [];
    const bubbles: Bubble[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isCompact = width < 768;
      const molCount = isCompact ? 8 : 16;
      const bubbleCount = isCompact ? 14 : 28;

      molecules.length = 0;
      for (let i = 0; i < molCount; i++) molecules.push(new FloatingMolecule());

      bubbles.length = 0;
      for (let i = 0; i < bubbleCount; i++) bubbles.push(new Bubble());
    };

    const drawHexagon = (cx: number, cy: number, radius: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const drawHexLattice = () => {
      const cols = Math.ceil(width / HEX_W) + 2;
      const rows = Math.ceil(height / HEX_H) + 2;

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const cx = col * HEX_W + (row % 2 === 0 ? 0 : HEX_W / 2);
          const cy = row * HEX_H;

          // Subtle traveling botanical wave across the honeycomb
          const wave = Math.sin((cx * 0.008 + cy * 0.008) - time * 0.015);
          let alpha = 0.055 + Math.max(0, wave) * 0.032;
          let fillAlpha = 0;

          if (mouse.active) {
            const dx = cx - mouse.x;
            const dy = cy - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 220) {
              const proximity = 1 - dist / 220;
              alpha += proximity * 0.22;
              fillAlpha = proximity * 0.085;
            }
          }

          drawHexagon(cx, cy, HEX_R - 1.5);
          if (fillAlpha > 0.005) {
            ctx.fillStyle = `rgba(46, 125, 91, ${fillAlpha})`;
            ctx.fill();
          }
          ctx.strokeStyle = `rgba(78, 91, 71, ${alpha})`;
          ctx.lineWidth = fillAlpha > 0.02 ? 1.1 : 0.65;
          ctx.stroke();
        }
      }
    };

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      drawHexLattice();

      for (const b of bubbles) {
        if (!prefersReduced) b.update();
        b.draw(ctx);
      }

      for (const m of molecules) {
        if (!prefersReduced) m.update();
        m.draw(ctx);
      }

      if (!prefersReduced) {
        animId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.x >= 0 && mouse.x <= width && mouse.y >= 0 && mouse.y <= height;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    resize();
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero__canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};
