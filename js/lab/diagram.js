// =============================================================================
// DIAGRAM.JS — Animated Canvas Particle System (ES Module)
// Renders an animated particle visualization in #diagram-canvas.
// Particles react to store state: idle drifts, running accelerates, complete pulses.
// =============================================================================

import { subscribe } from './store.js';


// --- Config ------------------------------------------------------------------

const PARTICLE_COUNT = 40;
const CONNECTION_DIST = 60;
const COLLISION_DIST = 20;

const MUTED_COLORS = ['#6b7280', '#374151', '#374151', '#6b7280'];
const ACCENT_COLORS = ['#00d4ff', '#ffffff'];
// Weighted: mostly muted with some accent
const IDLE_COLORS = [...MUTED_COLORS, ...MUTED_COLORS, ...ACCENT_COLORS];
const ACTIVE_COLORS = ['#00d4ff', '#00d4ff', '#00d4ff', '#ffffff', '#6b7280'];

const IDLE_SPEED = 0.3;
const RUNNING_SPEED = 1.2;
const COMPLETE_SPEED = 0.35;


// --- State -------------------------------------------------------------------

let canvas = null;
let ctx = null;
let particles = [];
let currentStatus = 'idle';
let animFrameId = null;
let pulseTime = 0;          // For the complete-state radial pulse
let overlayEl = null;


// --- Particle Factory --------------------------------------------------------

function createParticle(w, h, colorPool) {
    return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * IDLE_SPEED * 2,
        vy: (Math.random() - 0.5) * IDLE_SPEED * 2,
        radius: 2 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.2,
        color: colorPool[Math.floor(Math.random() * colorPool.length)]
    };
}

function initParticles(w, h) {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(w, h, IDLE_COLORS));
    }
}


// --- State Transitions -------------------------------------------------------

function transitionToRunning() {
    for (const p of particles) {
        // Speed up
        p.vx = (Math.random() - 0.5) * RUNNING_SPEED * 2;
        p.vy = (Math.random() - 0.5) * RUNNING_SPEED * 2;
        // Increase opacity
        p.opacity = 0.5 + Math.random() * 0.4;
        // More cyan
        p.color = ACTIVE_COLORS[Math.floor(Math.random() * ACTIVE_COLORS.length)];
    }
}

function transitionToComplete() {
    for (const p of particles) {
        // Slow down
        p.vx = (Math.random() - 0.5) * COMPLETE_SPEED * 2;
        p.vy = (Math.random() - 0.5) * COMPLETE_SPEED * 2;
        // Slightly higher opacity than idle, more cyan
        p.opacity = 0.4 + Math.random() * 0.3;
        p.color = ACTIVE_COLORS[Math.floor(Math.random() * ACTIVE_COLORS.length)];
    }
    pulseTime = 0;
}

function transitionToIdle() {
    for (const p of particles) {
        p.vx = (Math.random() - 0.5) * IDLE_SPEED * 2;
        p.vy = (Math.random() - 0.5) * IDLE_SPEED * 2;
        p.opacity = 0.3 + Math.random() * 0.2;
        p.color = IDLE_COLORS[Math.floor(Math.random() * IDLE_COLORS.length)];
    }
}


// --- Update ------------------------------------------------------------------

function updateParticles(w, h) {
    for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < p.radius) { p.x = p.radius; p.vx *= -1; }
        if (p.x > w - p.radius) { p.x = w - p.radius; p.vx *= -1; }
        if (p.y < p.radius) { p.y = p.radius; p.vy *= -1; }
        if (p.y > h - p.radius) { p.y = h - p.radius; p.vy *= -1; }
    }
}


// --- Draw --------------------------------------------------------------------

function drawParticles() {
    for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = withAlpha(p.color, p.opacity);
        ctx.fill();
    }
}

function drawConnections() {
    const threshold = currentStatus === 'running' ? CONNECTION_DIST * 1.2 : CONNECTION_DIST;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < threshold) {
                // Opacity proportional to distance (closer = more opaque)
                const alpha = (1 - dist / threshold) * 0.35;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = withAlpha('#00d4ff', alpha);
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            // Collision flash in running state
            if (currentStatus === 'running' && dist < COLLISION_DIST) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = withAlpha('#ffffff', 0.6);
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }
    }
}

function drawPulse(w, h, timestamp) {
    if (currentStatus !== 'complete') return;

    // Pulse every 3 seconds
    const cycle = 3000;
    const elapsed = timestamp % cycle;
    const t = elapsed / cycle; // 0 → 1

    const maxRadius = Math.max(w, h) * 0.4;
    const radius = t * maxRadius;
    const alpha = (1 - t) * 0.12;

    ctx.beginPath();
    ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha('#00d4ff', alpha);
    ctx.fill();
}


// --- Helpers -----------------------------------------------------------------

function withAlpha(hex, alpha) {
    // Convert hex to rgba
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}


// --- Animation Loop ----------------------------------------------------------

function loop(timestamp) {
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Background fill (matches card)
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, w, h);

    // Draw pulse behind particles (complete state only)
    drawPulse(w, h, timestamp);

    // Update & draw
    updateParticles(w, h);
    drawConnections();
    drawParticles();

    animFrameId = requestAnimationFrame(loop);
}


// --- Canvas Sizing -----------------------------------------------------------

function sizeCanvas() {
    if (!canvas || !canvas.parentElement) return;

    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);

    // Save logical dimensions on canvas for the loop
    canvas._logicalW = rect.width;
    canvas._logicalH = rect.height;
}


// --- Store Subscription ------------------------------------------------------

function onStateChange(state) {
    const prev = currentStatus;
    currentStatus = state.status;

    if (prev === currentStatus) return;

    switch (currentStatus) {
        case 'running':
            transitionToRunning();
            fadeOutOverlay();
            break;
        case 'complete':
            transitionToComplete();
            break;
        case 'idle':
        case 'ready':
            transitionToIdle();
            break;
    }
}

function fadeOutOverlay() {
    if (!overlayEl) return;
    overlayEl.classList.add('diagram-overlay--hidden');
}


// --- Init -------------------------------------------------------------------- 

/**
 * Initialize the animated diagram canvas.
 * Sets up particles, ResizeObserver, animation loop, and store subscription.
 */
export function initDiagram() {
    canvas = document.getElementById('diagram-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    overlayEl = canvas.parentElement?.querySelector('.diagram-overlay');

    // Initial sizing
    sizeCanvas();

    // Create particles at current canvas size
    const rect = canvas.parentElement.getBoundingClientRect();
    initParticles(rect.width, rect.height);

    // ResizeObserver for responsive canvas
    let currentWidth = 0;
    let currentHeight = 0;
    const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
            const { width, height } = entry.contentRect;
            if (width === currentWidth && height === currentHeight) return;
            currentWidth = width;
            currentHeight = height;
            sizeCanvas();
        }
    });
    observer.observe(canvas.parentElement);

    // Start animation loop
    animFrameId = requestAnimationFrame(loop);

    // Subscribe to store
    subscribe(onStateChange);
}
