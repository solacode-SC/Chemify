/* ===================================================
   ChemVerse — Table Grid Logic
   Renders the periodic table, search, click, animation
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
   const grid = document.getElementById('periodicGrid');
   const legendWrap = document.getElementById('legend');
   if (!grid) return;

   const allTiles = [];
   let activeTile = null;

   /* ---- Marker cells for lanthanide/actinide refs ---- */
   const markers = [
      { text: '57-71', row: 6, col: 3 },
      { text: '89-103', row: 7, col: 3 },
      { text: 'Lan', row: 9, col: 3 },
      { text: 'Act', row: 10, col: 3 }
   ];

   markers.forEach(m => {
      const el = document.createElement('div');
      el.className = 'el-marker';
      el.textContent = m.text;
      el.style.gridRow = m.row;
      el.style.gridColumn = m.col;
      grid.appendChild(el);
   });

   /* ---- Sort elements for stagger order (row then col) ---- */
   const sorted = [...ELEMENTS].sort((a, b) => a.gridRow - b.gridRow || a.gridColumn - b.gridColumn);

   /* ---- Render tiles ---- */
   sorted.forEach((elem, idx) => {
      const tile = document.createElement('div');
      tile.className = `el-tile el-tile--${elem.category}`;
      tile.style.gridRow = elem.gridRow;
      tile.style.gridColumn = elem.gridColumn;
      tile.dataset.name = elem.name.toLowerCase();
      tile.dataset.symbol = elem.symbol.toLowerCase();
      tile.dataset.number = elem.atomicNumber;

      tile.innerHTML =
         `<span class="el-tile__number">${elem.atomicNumber}</span>` +
         `<span class="el-tile__symbol">${elem.symbol}</span>` +
         `<span class="el-tile__name">${elem.name}</span>` +
         `<span class="el-tile__mass">${elem.atomicMass}</span>`;

      // Staggered animation delay
      tile.style.animationDelay = `${idx * 12}ms`;

      // Click handler
      tile.addEventListener('click', () => {
         // Remove previous active
         if (activeTile) activeTile.classList.remove('is-active');
         // Set new active
         tile.classList.add('is-active');
         activeTile = tile;
         // Log and call modal function (placeholder)
         console.log('Element clicked:', elem);
         if (typeof openElementModal === 'function') {
            openElementModal(elem);
         }
      });

      grid.appendChild(tile);
      allTiles.push(tile);
   });

   /* ---- Staggered entrance animation via IntersectionObserver ---- */
   const gridObserver = new IntersectionObserver(
      (entries) => {
         entries.forEach(entry => {
            if (entry.isIntersecting) {
               allTiles.forEach(tile => tile.classList.add('is-visible'));
               gridObserver.unobserve(entry.target);
            }
         });
      },
      { threshold: 0.05 }
   );
   gridObserver.observe(grid);

   /* ---- Legend ---- */
   if (legendWrap) {
      Object.entries(CATEGORIES).forEach(([key, { label, color }]) => {
         const item = document.createElement('div');
         item.className = 'legend-item';
         item.innerHTML =
            `<div class="legend-swatch" style="background:${color}"></div>` +
            `<span class="legend-label">${label}</span>`;
         legendWrap.appendChild(item);
      });
   }
});
