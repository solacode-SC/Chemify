import React, { useEffect, useRef } from 'react';

const PULSE_COLORS = [
  { r: 34, g: 211, b: 238 },  // Electric Cyan
  { r: 52, g: 211, b: 153 },  // Bioluminescent Emerald
  { r: 167, g: 139, b: 250 }, // Quantum Violet
  { r: 251, g: 191, b: 36 }   // Catalyst Amber
];

export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const mouse = { x: -1000, y: -1000 };
    const GRID_SPACING = 64;
    const LINE_ALPHA = 0.055;
    const MOUSE_RADIUS = 240;

    class Pulse {
      horizontal = false;
      fixedPos = 0;
      pos = 0;
      speed = 0;
      limit = 0;
      length = 0;
      alpha = 0;
      color = PULSE_COLORS[0];

      constructor() {
        this.reset();
      }

      reset() {
        this.horizontal = Math.random() > 0.5;
        this.color = PULSE_COLORS[Math.floor(Math.random() * PULSE_COLORS.length)];
        if (this.horizontal) {
          const row = Math.floor(Math.random() * Math.max(1, Math.ceil((height || 800) / GRID_SPACING)));
          this.fixedPos = row * GRID_SPACING;
          this.pos = -30;
          this.speed = 0.9 + Math.random() * 1.6;
          this.limit = (width || 1400) + 60;
        } else {
          const col = Math.floor(Math.random() * Math.max(1, Math.ceil((width || 1400) / GRID_SPACING)));
          this.fixedPos = col * GRID_SPACING;
          this.pos = -30;
          this.speed = 0.9 + Math.random() * 1.6;
          this.limit = (height || 800) + 60;
        }
        this.length = 45 + Math.random() * 80;
        this.alpha = 0.25 + Math.random() * 0.4;
      }

      update() {
        this.pos += this.speed;
        if (this.pos > this.limit + this.length) {
          this.reset();
        }
      }

      draw(c: CanvasRenderingContext2D) {
        let x0: number, y0: number, x1: number, y1: number;
        if (this.horizontal) {
          x0 = this.pos - this.length;
          x1 = this.pos;
          y0 = this.fixedPos;
          y1 = this.fixedPos;
        } else {
          x0 = this.fixedPos;
          x1 = this.fixedPos;
          y0 = this.pos - this.length;
          y1 = this.pos;
        }

        const { r, g, b } = this.color;
        const grad = c.createLinearGradient(x0, y0, x1, y1);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        grad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, ${this.alpha})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${this.alpha * 0.95})`);

        c.strokeStyle = grad;
        c.lineWidth = 1.8;
        c.beginPath();
        c.moveTo(x0, y0);
        c.lineTo(x1, y1);
        c.stroke();

        // Glowing leading spark
        c.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha * 0.9})`;
        c.beginPath();
        c.arc(x1, y1, 2.2, 0, Math.PI * 2);
        c.fill();
      }
    }

    class MoleculeNode {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      radius = 2;
      color = PULSE_COLORS[0];

      constructor() {
        this.x = Math.random() * (width || 1200);
        this.y = Math.random() * (height || 800);
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = 1.6 + Math.random() * 2.2;
        this.color = PULSE_COLORS[Math.floor(Math.random() * 3)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(c: CanvasRenderingContext2D) {
        const { r, g, b } = this.color;
        c.fillStyle = `rgba(${r}, ${g}, ${b}, 0.55)`;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fill();
      }
    }

    const pulses: Pulse[] = [];
    const nodes: MoleculeNode[] = [];

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
      const pulseCount = isCompact ? 16 : 30;
      const nodeCount = isCompact ? 18 : 34;

      pulses.length = 0;
      for (let i = 0; i < pulseCount; i++) {
        const p = new Pulse();
        p.pos = Math.random() * (p.limit + p.length);
        pulses.push(p);
      }

      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new MoleculeNode());
      }
    };

    const drawGrid = () => {
      for (let x = 0; x <= width; x += GRID_SPACING) {
        const dx = Math.abs(x - mouse.x);
        const glow = dx < MOUSE_RADIUS ? (1 - dx / MOUSE_RADIUS) * 0.14 : 0;
        ctx.strokeStyle = `rgba(56, 189, 248, ${LINE_ALPHA + glow})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y += GRID_SPACING) {
        const dy = Math.abs(y - mouse.y);
        const glow = dy < MOUSE_RADIUS ? (1 - dy / MOUSE_RADIUS) * 0.14 : 0;
        ctx.strokeStyle = `rgba(56, 189, 248, ${LINE_ALPHA + glow})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (mouse.x > 0 && mouse.y > 0) {
        for (let x = 0; x <= width; x += GRID_SPACING) {
          for (let y = 0; y <= height; y += GRID_SPACING) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS) {
              const a = (1 - dist / MOUSE_RADIUS) * 0.5;
              ctx.fillStyle = `rgba(34, 211, 238, ${a})`;
              ctx.beginPath();
              ctx.arc(x, y, 2.4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
    };

    const drawMolecularWeb = () => {
      const linkDist = width < 768 ? 110 : 145;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.update();
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            const opacity = (1 - dist / linkDist) * 0.22;
            ctx.strokeStyle = `rgba(52, 211, 153, ${opacity})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        a.draw(ctx);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawMolecularWeb();
      for (const p of pulses) {
        p.update();
        p.draw(ctx);
      }
      animId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
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
