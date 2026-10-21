import React, { useEffect, useRef } from 'react';

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
    const mouse = { x: -1000, y: -1000 };
    const GRID_SPACING = 60;
    const LINE_ALPHA = 0.07;
    const MOUSE_RADIUS = 220;
    const PULSE_COUNT = 32;

    class Pulse {
      horizontal: boolean = false;
      fixedPos: number = 0;
      pos: number = 0;
      speed: number = 0;
      limit: number = 0;
      length: number = 0;
      alpha: number = 0;

      constructor() {
        this.reset();
      }

      reset() {
        this.horizontal = Math.random() > 0.5;
        if (this.horizontal) {
          const row = Math.floor(Math.random() * Math.ceil((height || 800) / GRID_SPACING));
          this.fixedPos = row * GRID_SPACING;
          this.pos = -20;
          this.speed = 0.7 + Math.random() * 1.3;
          this.limit = (width || 1400) + 40;
        } else {
          const col = Math.floor(Math.random() * Math.ceil((width || 1400) / GRID_SPACING));
          this.fixedPos = col * GRID_SPACING;
          this.pos = -20;
          this.speed = 0.7 + Math.random() * 1.3;
          this.limit = (height || 800) + 40;
        }
        this.length = 35 + Math.random() * 55;
        this.alpha = 0.18 + Math.random() * 0.28;
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

        const grad = c.createLinearGradient(x0, y0, x1, y1);
        grad.addColorStop(0, 'rgba(78, 91, 71, 0)');
        grad.addColorStop(0.5, `rgba(78, 91, 71, ${this.alpha})`);
        grad.addColorStop(1, 'rgba(78, 91, 71, 0)');

        c.strokeStyle = grad;
        c.lineWidth = 1.6;
        c.beginPath();
        c.moveTo(x0, y0);
        c.lineTo(x1, y1);
        c.stroke();
      }
    }

    const pulses: Pulse[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = canvas.width = parent.offsetWidth;
      height = canvas.height = parent.offsetHeight;
      pulses.length = 0;
      for (let i = 0; i < PULSE_COUNT; i++) {
        const p = new Pulse();
        p.pos = Math.random() * (p.limit + p.length);
        pulses.push(p);
      }
    };

    const drawGrid = () => {
      // Vertical lines
      for (let x = 0; x <= width; x += GRID_SPACING) {
        const dx = Math.abs(x - mouse.x);
        const glow = dx < MOUSE_RADIUS ? (1 - dx / MOUSE_RADIUS) * 0.12 : 0;
        const alpha = LINE_ALPHA + glow;

        ctx.strokeStyle = `rgba(78, 91, 71, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= height; y += GRID_SPACING) {
        const dy = Math.abs(y - mouse.y);
        const glow = dy < MOUSE_RADIUS ? (1 - dy / MOUSE_RADIUS) * 0.12 : 0;
        const alpha = LINE_ALPHA + glow;

        ctx.strokeStyle = `rgba(78, 91, 71, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Intersection dots near mouse
      if (mouse.x > 0 && mouse.y > 0) {
        for (let x = 0; x <= width; x += GRID_SPACING) {
          for (let y = 0; y <= height; y += GRID_SPACING) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS) {
              const a = (1 - dist / MOUSE_RADIUS) * 0.25;
              ctx.fillStyle = `rgba(78, 91, 71, ${a})`;
              ctx.beginPath();
              ctx.arc(x, y, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
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

