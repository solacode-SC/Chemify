/* ===================================================
   ChemVerse — Modal Open / Close / Render
   =================================================== */

(function () {
   'use strict';

   const overlay = document.getElementById('modalOverlay');
   const panel = document.getElementById('modalPanel');
   const closeBtn = document.getElementById('modalCloseBtn');
   if (!overlay || !panel) return;

   /* ---------- Open / Close ---------- */
   function openElementModal(elem) {
      renderModal(elem);
      overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
   }

   function closeModal() {
      overlay.classList.remove('is-active');
      document.body.style.overflow = '';
   }

   // Close on overlay click (not panel)
   overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
   });

   // Close on button
   closeBtn.addEventListener('click', closeModal);

   // Close on Escape
   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
         closeModal();
      }
   });

   // Expose globally
   window.openElementModal = openElementModal;

   /* ---------- Render modal content ---------- */
   function renderModal(el) {
      // Get extended data
      const ext = (typeof ELEMENT_DETAILS !== 'undefined' && ELEMENT_DETAILS[el.atomicNumber])
         ? ELEMENT_DETAILS[el.atomicNumber] : {};

      const cat = CATEGORIES[el.category] || { label: el.category, color: '#f5f5f5' };

      // Header
      document.getElementById('mdBadge').textContent = cat.label;
      document.getElementById('mdSymbol').textContent = el.symbol;
      document.getElementById('mdName').textContent = el.name;
      document.getElementById('mdMeta').textContent =
         `Atomic Number: ${el.atomicNumber}  ·  Atomic Mass: ${el.atomicMass}`;

      const circle = document.getElementById('mdCircle');
      circle.style.background = cat.color;
      document.getElementById('mdCircleSym').textContent = el.symbol;

      // Properties grid
      const propsGrid = document.getElementById('mdProps');
      const props = [
         ['Atomic Number', el.atomicNumber],
         ['Atomic Mass', el.atomicMass],
         ['Period', el.period],
         ['Group', el.group],
         ['Category', cat.label],
         ['Phase at STP', ext.phase || '—'],
         ['Melting Point', ext.mp || '—'],
         ['Boiling Point', ext.bp || '—'],
         ['Density', ext.density || '—'],
         ['Electronegativity', ext.en || '—'],
         ['Electron Config', ext.ec || '—'],
         ['Oxidation States', ext.ox || '—'],
         ['Discovery Year', ext.year || '—'],
         ['Discovered By', ext.by || '—']
      ];

      propsGrid.innerHTML = props.map(([label, value]) =>
         `<div class="modal-prop">
                <div class="modal-prop__label">${label}</div>
                <div class="modal-prop__value">${value}</div>
            </div>`
      ).join('');

      // Description
      document.getElementById('mdDesc').textContent = ext.desc ||
         `${el.name} is element ${el.atomicNumber} on the periodic table with the symbol ${el.symbol}.`;

      // Uses
      const usesWrap = document.getElementById('mdUses');
      const uses = ext.uses || ['General research'];
      usesWrap.innerHTML = uses.map(u =>
         `<span class="modal-uses__pill">${u}</span>`
      ).join('');

      // Electron shell SVG
      const shellWrap = document.getElementById('mdShells');
      const shells = ext.shells || [el.atomicNumber <= 2 ? el.atomicNumber : 2];
      shellWrap.innerHTML = renderShellSVG(shells);
   }

   /* ---------- Electron Shell SVG ---------- */
   function renderShellSVG(shells) {
      const size = 240;
      const cx = size / 2;
      const cy = size / 2;
      const maxR = (size / 2) - 16;
      const nucleusR = 8;
      const electronR = 4;
      const shellCount = shells.length;
      const ringStep = (maxR - 20) / Math.max(shellCount, 1);

      let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;

      // Nucleus
      svg += `<circle cx="${cx}" cy="${cy}" r="${nucleusR}" fill="#1a1a1a"/>`;

      // Shells
      shells.forEach((electronCount, i) => {
         const r = 28 + ringStep * i;

         // Ring
         svg += `<circle cx="${cx}" cy="${cy}" r="${r}" class="shell-ring"/>`;

         // Electrons in animated group
         svg += `<g class="shell-group shell-group--${i}">`;
         for (let e = 0; e < electronCount; e++) {
            const angle = (2 * Math.PI * e) / electronCount - Math.PI / 2;
            const ex = cx + r * Math.cos(angle);
            const ey = cy + r * Math.sin(angle);
            svg += `<circle cx="${ex}" cy="${ey}" r="${electronR}" class="shell-electron"/>`;
         }
         svg += '</g>';
      });

      svg += '</svg>';
      return svg;
   }
})();
