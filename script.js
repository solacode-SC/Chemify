/* ===================================================
   ChemVerse — Navbar Interactions (vanilla JS)
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const overlayCloseBtn = document.getElementById('overlayCloseBtn');
    const overlayLinks = mobileOverlay.querySelectorAll('a');

    /* ---------- Scroll shadow ---------- */
    const SCROLL_THRESHOLD = 80;

    const handleScroll = () => {
        if (window.scrollY > SCROLL_THRESHOLD) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    };

    // Use passive listener for scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load in case page is already scrolled
    handleScroll();

    /* ---------- Hamburger / Mobile overlay ---------- */
    const openMenu = () => {
        hamburgerBtn.classList.add('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        mobileOverlay.classList.add('is-open');
        mobileOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        hamburgerBtn.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileOverlay.classList.remove('is-open');
        mobileOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const toggleMenu = () => {
        const isOpen = mobileOverlay.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
    };

    hamburgerBtn.addEventListener('click', toggleMenu);
    overlayCloseBtn.addEventListener('click', closeMenu);

    // Close overlay when a link is clicked
    overlayLinks.forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    // Close overlay on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileOverlay.classList.contains('is-open')) {
            closeMenu();
        }
    });

    /* ===================================================
       Hero Canvas — Square Grid with Traveling Lights
       =================================================== */
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let mouse = { x: -1000, y: -1000 };
        const GRID_SPACING = 60;
        const LINE_ALPHA = 0.06;
        const MOUSE_RADIUS = 200;
        const PULSE_COUNT = 30;
        const pulses = [];

        const resize = () => {
            const hero = document.getElementById('hero');
            width = canvas.width = hero.offsetWidth;
            height = canvas.height = hero.offsetHeight;
        };

        class Pulse {
            constructor() {
                this.reset();
            }
            reset() {
                // Decide if horizontal or vertical
                this.horizontal = Math.random() > 0.5;
                if (this.horizontal) {
                    // Travel along a horizontal grid line
                    const row = Math.floor(Math.random() * Math.ceil((height || 800) / GRID_SPACING));
                    this.fixedPos = row * GRID_SPACING;
                    this.pos = -20;
                    this.speed = 0.6 + Math.random() * 1.2;
                    this.limit = (width || 1400) + 40;
                } else {
                    // Travel along a vertical grid line
                    const col = Math.floor(Math.random() * Math.ceil((width || 1400) / GRID_SPACING));
                    this.fixedPos = col * GRID_SPACING;
                    this.pos = -20;
                    this.speed = 0.6 + Math.random() * 1.2;
                    this.limit = (height || 800) + 40;
                }
                this.length = 30 + Math.random() * 50;
                this.alpha = 0.15 + Math.random() * 0.25;
            }
            update() {
                this.pos += this.speed;
                if (this.pos > this.limit + this.length) {
                    this.reset();
                }
            }
            draw(ctx) {
                let x0, y0, x1, y1;
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

                const grad = ctx.createLinearGradient(x0, y0, x1, y1);
                grad.addColorStop(0, `rgba(26, 26, 26, 0)`);
                grad.addColorStop(0.5, `rgba(26, 26, 26, ${this.alpha})`);
                grad.addColorStop(1, `rgba(26, 26, 26, 0)`);

                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x0, y0);
                ctx.lineTo(x1, y1);
                ctx.stroke();
            }
        }

        const init = () => {
            resize();
            pulses.length = 0;
            for (let i = 0; i < PULSE_COUNT; i++) {
                const p = new Pulse();
                // Stagger initial positions
                p.pos = Math.random() * (p.limit + p.length);
                pulses.push(p);
            }
        };

        const drawGrid = () => {
            // Vertical lines
            for (let x = 0; x <= width; x += GRID_SPACING) {
                // Calculate mouse proximity for glow
                const dx = Math.abs(x - mouse.x);
                const glow = dx < MOUSE_RADIUS ? (1 - dx / MOUSE_RADIUS) * 0.08 : 0;
                const alpha = LINE_ALPHA + glow;

                ctx.strokeStyle = `rgba(26, 26, 26, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            // Horizontal lines
            for (let y = 0; y <= height; y += GRID_SPACING) {
                const dy = Math.abs(y - mouse.y);
                const glow = dy < MOUSE_RADIUS ? (1 - dy / MOUSE_RADIUS) * 0.08 : 0;
                const alpha = LINE_ALPHA + glow;

                ctx.strokeStyle = `rgba(26, 26, 26, ${alpha})`;
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
                            const a = (1 - dist / MOUSE_RADIUS) * 0.2;
                            ctx.fillStyle = `rgba(26, 26, 26, ${a})`;
                            ctx.beginPath();
                            ctx.arc(x, y, 2, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw the grid
            drawGrid();

            // Draw traveling light pulses
            for (const p of pulses) {
                p.update();
                p.draw(ctx);
            }

            requestAnimationFrame(draw);
        };

        // Mouse tracking on the hero section
        const hero = document.getElementById('hero');
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        hero.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        window.addEventListener('resize', () => {
            resize();
            // Re-initialize pulses to match new grid
            pulses.length = 0;
            for (let i = 0; i < PULSE_COUNT; i++) {
                const p = new Pulse();
                p.pos = Math.random() * (p.limit + p.length);
                pulses.push(p);
            }
        });
        init();
        draw();
    }

    /* ===================================================
       Intersection Observer — Scroll Reveal
       =================================================== */
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (revealEls.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        revealEls.forEach((el) => observer.observe(el));
    }

    /* ===================================================
       Periodic Table — Generate All 118 Elements
       =================================================== */
    const ptableGrid = document.getElementById('ptableGrid');
    if (ptableGrid) {
        // [number, symbol, name, row, col, category]
        // Categories: am=alkali, ae=alkaline earth, tm=transition, pt=post-transition,
        //             ml=metalloid, nm=nonmetal, hl=halogen, ng=noble gas, ln=lanthanide, ac=actinide
        const elements = [
            [1, 'H', 'Hydrogen', 1, 1, 'nm'], [2, 'He', 'Helium', 1, 18, 'ng'],
            [3, 'Li', 'Lithium', 2, 1, 'am'], [4, 'Be', 'Beryllium', 2, 2, 'ae'],
            [5, 'B', 'Boron', 2, 13, 'ml'], [6, 'C', 'Carbon', 2, 14, 'nm'], [7, 'N', 'Nitrogen', 2, 15, 'nm'],
            [8, 'O', 'Oxygen', 2, 16, 'nm'], [9, 'F', 'Fluorine', 2, 17, 'hl'], [10, 'Ne', 'Neon', 2, 18, 'ng'],
            [11, 'Na', 'Sodium', 3, 1, 'am'], [12, 'Mg', 'Magnesium', 3, 2, 'ae'],
            [13, 'Al', 'Aluminium', 3, 13, 'pt'], [14, 'Si', 'Silicon', 3, 14, 'ml'], [15, 'P', 'Phosphorus', 3, 15, 'nm'],
            [16, 'S', 'Sulfur', 3, 16, 'nm'], [17, 'Cl', 'Chlorine', 3, 17, 'hl'], [18, 'Ar', 'Argon', 3, 18, 'ng'],
            [19, 'K', 'Potassium', 4, 1, 'am'], [20, 'Ca', 'Calcium', 4, 2, 'ae'],
            [21, 'Sc', 'Scandium', 4, 3, 'tm'], [22, 'Ti', 'Titanium', 4, 4, 'tm'], [23, 'V', 'Vanadium', 4, 5, 'tm'],
            [24, 'Cr', 'Chromium', 4, 6, 'tm'], [25, 'Mn', 'Manganese', 4, 7, 'tm'], [26, 'Fe', 'Iron', 4, 8, 'tm'],
            [27, 'Co', 'Cobalt', 4, 9, 'tm'], [28, 'Ni', 'Nickel', 4, 10, 'tm'], [29, 'Cu', 'Copper', 4, 11, 'tm'],
            [30, 'Zn', 'Zinc', 4, 12, 'tm'], [31, 'Ga', 'Gallium', 4, 13, 'pt'], [32, 'Ge', 'Germanium', 4, 14, 'ml'],
            [33, 'As', 'Arsenic', 4, 15, 'ml'], [34, 'Se', 'Selenium', 4, 16, 'nm'], [35, 'Br', 'Bromine', 4, 17, 'hl'],
            [36, 'Kr', 'Krypton', 4, 18, 'ng'],
            [37, 'Rb', 'Rubidium', 5, 1, 'am'], [38, 'Sr', 'Strontium', 5, 2, 'ae'],
            [39, 'Y', 'Yttrium', 5, 3, 'tm'], [40, 'Zr', 'Zirconium', 5, 4, 'tm'], [41, 'Nb', 'Niobium', 5, 5, 'tm'],
            [42, 'Mo', 'Molybdenum', 5, 6, 'tm'], [43, 'Tc', 'Technetium', 5, 7, 'tm'], [44, 'Ru', 'Ruthenium', 5, 8, 'tm'],
            [45, 'Rh', 'Rhodium', 5, 9, 'tm'], [46, 'Pd', 'Palladium', 5, 10, 'tm'], [47, 'Ag', 'Silver', 5, 11, 'tm'],
            [48, 'Cd', 'Cadmium', 5, 12, 'tm'], [49, 'In', 'Indium', 5, 13, 'pt'], [50, 'Sn', 'Tin', 5, 14, 'pt'],
            [51, 'Sb', 'Antimony', 5, 15, 'ml'], [52, 'Te', 'Tellurium', 5, 16, 'ml'], [53, 'I', 'Iodine', 5, 17, 'hl'],
            [54, 'Xe', 'Xenon', 5, 18, 'ng'],
            [55, 'Cs', 'Caesium', 6, 1, 'am'], [56, 'Ba', 'Barium', 6, 2, 'ae'],
            [72, 'Hf', 'Hafnium', 6, 4, 'tm'], [73, 'Ta', 'Tantalum', 6, 5, 'tm'], [74, 'W', 'Tungsten', 6, 6, 'tm'],
            [75, 'Re', 'Rhenium', 6, 7, 'tm'], [76, 'Os', 'Osmium', 6, 8, 'tm'], [77, 'Ir', 'Iridium', 6, 9, 'tm'],
            [78, 'Pt', 'Platinum', 6, 10, 'tm'], [79, 'Au', 'Gold', 6, 11, 'tm'], [80, 'Hg', 'Mercury', 6, 12, 'tm'],
            [81, 'Tl', 'Thallium', 6, 13, 'pt'], [82, 'Pb', 'Lead', 6, 14, 'pt'], [83, 'Bi', 'Bismuth', 6, 15, 'pt'],
            [84, 'Po', 'Polonium', 6, 16, 'pt'], [85, 'At', 'Astatine', 6, 17, 'hl'], [86, 'Rn', 'Radon', 6, 18, 'ng'],
            [87, 'Fr', 'Francium', 7, 1, 'am'], [88, 'Ra', 'Radium', 7, 2, 'ae'],
            [104, 'Rf', 'Rutherfordium', 7, 4, 'tm'], [105, 'Db', 'Dubnium', 7, 5, 'tm'],
            [106, 'Sg', 'Seaborgium', 7, 6, 'tm'], [107, 'Bh', 'Bohrium', 7, 7, 'tm'],
            [108, 'Hs', 'Hassium', 7, 8, 'tm'], [109, 'Mt', 'Meitnerium', 7, 9, 'tm'],
            [110, 'Ds', 'Darmstadtium', 7, 10, 'tm'], [111, 'Rg', 'Roentgenium', 7, 11, 'tm'],
            [112, 'Cn', 'Copernicium', 7, 12, 'tm'], [113, 'Nh', 'Nihonium', 7, 13, 'pt'],
            [114, 'Fl', 'Flerovium', 7, 14, 'pt'], [115, 'Mc', 'Moscovium', 7, 15, 'pt'],
            [116, 'Lv', 'Livermorium', 7, 16, 'pt'], [117, 'Ts', 'Tennessine', 7, 17, 'hl'],
            [118, 'Og', 'Oganesson', 7, 18, 'ng'],
            // Lanthanides — row 9
            [57, 'La', 'Lanthanum', 9, 4, 'ln'], [58, 'Ce', 'Cerium', 9, 5, 'ln'], [59, 'Pr', 'Praseodymium', 9, 6, 'ln'],
            [60, 'Nd', 'Neodymium', 9, 7, 'ln'], [61, 'Pm', 'Promethium', 9, 8, 'ln'], [62, 'Sm', 'Samarium', 9, 9, 'ln'],
            [63, 'Eu', 'Europium', 9, 10, 'ln'], [64, 'Gd', 'Gadolinium', 9, 11, 'ln'], [65, 'Tb', 'Terbium', 9, 12, 'ln'],
            [66, 'Dy', 'Dysprosium', 9, 13, 'ln'], [67, 'Ho', 'Holmium', 9, 14, 'ln'], [68, 'Er', 'Erbium', 9, 15, 'ln'],
            [69, 'Tm', 'Thulium', 9, 16, 'ln'], [70, 'Yb', 'Ytterbium', 9, 17, 'ln'], [71, 'Lu', 'Lutetium', 9, 18, 'ln'],
            // Actinides — row 10
            [89, 'Ac', 'Actinium', 10, 4, 'ac'], [90, 'Th', 'Thorium', 10, 5, 'ac'], [91, 'Pa', 'Protactinium', 10, 6, 'ac'],
            [92, 'U', 'Uranium', 10, 7, 'ac'], [93, 'Np', 'Neptunium', 10, 8, 'ac'], [94, 'Pu', 'Plutonium', 10, 9, 'ac'],
            [95, 'Am', 'Americium', 10, 10, 'ac'], [96, 'Cm', 'Curium', 10, 11, 'ac'], [97, 'Bk', 'Berkelium', 10, 12, 'ac'],
            [98, 'Cf', 'Californium', 10, 13, 'ac'], [99, 'Es', 'Einsteinium', 10, 14, 'ac'],
            [100, 'Fm', 'Fermium', 10, 15, 'ac'], [101, 'Md', 'Mendelevium', 10, 16, 'ac'],
            [102, 'No', 'Nobelium', 10, 17, 'ac'], [103, 'Lr', 'Lawrencium', 10, 18, 'ac']
        ];

        // Sort by row, then column for stagger order
        const sorted = [...elements].sort((a, b) => a[3] - b[3] || a[4] - b[4]);

        // Add marker tiles for lanthanide/actinide rows
        const mkr1 = document.createElement('div');
        mkr1.className = 'ptable__marker';
        mkr1.textContent = '57-71';
        mkr1.style.gridRow = '6';
        mkr1.style.gridColumn = '3';
        ptableGrid.appendChild(mkr1);

        const mkr2 = document.createElement('div');
        mkr2.className = 'ptable__marker';
        mkr2.textContent = '89-103';
        mkr2.style.gridRow = '7';
        mkr2.style.gridColumn = '3';
        ptableGrid.appendChild(mkr2);

        // Row labels for lanthanide/actinide
        const lnLabel = document.createElement('div');
        lnLabel.className = 'ptable__marker';
        lnLabel.textContent = 'Ln';
        lnLabel.style.gridRow = '9';
        lnLabel.style.gridColumn = '3';
        ptableGrid.appendChild(lnLabel);

        const acLabel = document.createElement('div');
        acLabel.className = 'ptable__marker';
        acLabel.textContent = 'Ac';
        acLabel.style.gridRow = '10';
        acLabel.style.gridColumn = '3';
        ptableGrid.appendChild(acLabel);

        // Create all tiles
        const tiles = [];
        sorted.forEach((el, i) => {
            const [num, sym, name, row, col, cat] = el;
            const tile = document.createElement('div');
            tile.className = `ptable__tile ptable__tile--${cat}`;
            tile.style.gridRow = row;
            tile.style.gridColumn = col;
            tile.dataset.delay = i * 15;

            tile.innerHTML =
                `<span class="ptable__tile-num">${num}</span>` +
                `<span class="ptable__tile-sym">${sym}</span>` +
                `<span class="ptable__tile-name">${name}</span>`;

            ptableGrid.appendChild(tile);
            tiles.push(tile);
        });

        // Intersection Observer for staggered reveal
        const ptableObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        tiles.forEach((tile) => {
                            const delay = parseInt(tile.dataset.delay, 10);
                            setTimeout(() => tile.classList.add('is-shown'), delay);
                        });
                        ptableObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        ptableObserver.observe(ptableGrid);
    }
});
