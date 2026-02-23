/* ===================================================
   Chemify — Search & Filter Logic
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
   'use strict';

   const searchInput = document.getElementById('searchInput');
   const filterChips = document.getElementById('filterChips');
   const filterCounter = document.getElementById('filterCounter');
   const filterClear = document.getElementById('filterClear');
   const highlightToggle = document.getElementById('highlightToggle');
   const periodSelect = document.getElementById('periodSelectMobile');
   const grid = document.getElementById('periodicGrid');
   if (!grid || !filterChips) return;

   const allTiles = grid.querySelectorAll('.el-tile');
   const totalCount = allTiles.length;

   // Active filter state
   const state = {
      search: '',
      category: 'all',
      stateSTP: 'all',
      period: 'all',
      highlight: false
   };

   /* ---- Chip click handling ---- */
   filterChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;

      const filterType = chip.dataset.filter;
      const value = chip.dataset.value;

      // Deactivate siblings in same filter group
      const siblings = filterChips.querySelectorAll(`[data-filter="${filterType}"]`);
      siblings.forEach(s => s.classList.remove('is-active'));
      chip.classList.add('is-active');

      // Bounce animation
      chip.classList.remove('chip-bounce');
      void chip.offsetWidth; // trigger reflow
      chip.classList.add('chip-bounce');

      // Update state
      if (filterType === 'category') state.category = value;
      else if (filterType === 'state') state.stateSTP = value;
      else if (filterType === 'period') state.period = value;

      // Sync period dropdown if desktop chip clicked
      if (filterType === 'period' && periodSelect) {
         periodSelect.value = value;
      }

      applyFilters();
   });

   /* ---- Period dropdown (mobile) ---- */
   if (periodSelect) {
      periodSelect.addEventListener('change', () => {
         state.period = periodSelect.value;

         // Sync desktop chips
         const desktopChips = filterChips.querySelectorAll('[data-filter="period"]');
         desktopChips.forEach(c => {
            c.classList.toggle('is-active', c.dataset.value === state.period);
         });

         applyFilters();
      });
   }

   /* ---- Search input ---- */
   searchInput.addEventListener('input', () => {
      state.search = searchInput.value.trim().toLowerCase();
      applyFilters();
   });

   /* ---- Highlight toggle ---- */
   highlightToggle.addEventListener('change', () => {
      state.highlight = highlightToggle.checked;
      applyFilters();
   });

   /* ---- Clear All ---- */
   filterClear.addEventListener('click', () => {
      // Reset state
      state.search = '';
      state.category = 'all';
      state.stateSTP = 'all';
      state.period = 'all';
      state.highlight = false;

      searchInput.value = '';
      highlightToggle.checked = false;
      if (periodSelect) periodSelect.value = 'all';

      // Reset all chips to their 'all' defaults
      filterChips.querySelectorAll('.filter-chip').forEach(c => {
         c.classList.toggle('is-active', c.dataset.value === 'all');
      });

      applyFilters();
   });

   /* ---- Keyboard shortcuts ---- */
   document.addEventListener('keydown', (e) => {
      // / focuses search (unless in modal or already focused)
      if (e.key === '/' && document.activeElement !== searchInput) {
         const overlay = document.getElementById('modalOverlay');
         if (overlay && overlay.classList.contains('is-active')) return;
         e.preventDefault();
         searchInput.focus();
      }

      // Escape clears search and filters
      if (e.key === 'Escape' && document.activeElement === searchInput) {
         e.preventDefault();
         filterClear.click();
         searchInput.blur();
      }
   });

   /* ---- Core filter logic ---- */
   function applyFilters() {
      let visibleCount = 0;
      const hasFilters = state.search || state.category !== 'all' || state.stateSTP !== 'all' || state.period !== 'all';

      allTiles.forEach(tile => {
         const num = parseInt(tile.dataset.number, 10);
         const name = tile.dataset.name;
         const symbol = tile.dataset.symbol;

         // Find matching element data
         const elem = ELEMENTS.find(e => e.atomicNumber === num);
         if (!elem) return;

         const ext = (typeof ELEMENT_DETAILS !== 'undefined') ? ELEMENT_DETAILS[num] : null;

         let matches = true;

         // Search filter
         if (state.search) {
            const q = state.search;
            const nameMatch = name.includes(q);
            const symMatch = symbol.includes(q);
            const numMatch = String(num) === q;
            if (!nameMatch && !symMatch && !numMatch) matches = false;
         }

         // Category filter
         if (matches && state.category !== 'all') {
            if (elem.category !== state.category) matches = false;
         }

         // State filter
         if (matches && state.stateSTP !== 'all') {
            const phase = ext ? ext.phase : '—';
            if (phase !== state.stateSTP) matches = false;
         }

         // Period filter
         if (matches && state.period !== 'all') {
            if (String(elem.period) !== state.period) matches = false;
         }

         // Apply visibility
         if (state.highlight && hasFilters) {
            // Highlight mode: keep all visible, highlight matches
            tile.classList.remove('is-dimmed', 'is-muted');
            if (matches) {
               tile.classList.add('is-highlighted');
               tile.classList.remove('is-muted');
               tile.style.pointerEvents = '';
            } else {
               tile.classList.remove('is-highlighted');
               tile.classList.add('is-muted');
               tile.style.pointerEvents = '';
            }
         } else {
            // Default mode: fade non-matches
            tile.classList.remove('is-highlighted', 'is-muted');
            if (matches) {
               tile.classList.remove('is-dimmed');
               tile.style.pointerEvents = '';
            } else {
               tile.classList.add('is-dimmed');
               tile.style.pointerEvents = 'none';
            }
         }

         if (matches) visibleCount++;
      });

      // Update counter with fade
      updateCounter(visibleCount, hasFilters);

      // Show/hide clear button
      filterClear.hidden = !hasFilters;
   }

   function updateCounter(count, hasFilters) {
      filterCounter.classList.add('is-fading');
      setTimeout(() => {
         if (count === 0) {
            filterCounter.textContent = 'No elements match your search 😔';
         } else if (hasFilters) {
            filterCounter.textContent = `Showing ${count} of ${totalCount} elements`;
         } else {
            filterCounter.textContent = `Showing ${totalCount} elements`;
         }
         filterCounter.classList.remove('is-fading');
      }, 150);
   }

   /* ---- Arrow scroll navigation ---- */
   const chipsScroll = document.getElementById('chipsScroll');
   const arrowLeft = document.getElementById('chipArrowLeft');
   const arrowRight = document.getElementById('chipArrowRight');
   const SCROLL_STEP = 200;

   function updateArrows() {
      if (!chipsScroll || !arrowLeft || !arrowRight) return;
      const { scrollLeft, scrollWidth, clientWidth } = chipsScroll;
      arrowLeft.classList.toggle('is-hidden', scrollLeft <= 2);
      arrowRight.classList.toggle('is-hidden', scrollLeft + clientWidth >= scrollWidth - 2);
   }

   if (arrowLeft && arrowRight && chipsScroll) {
      arrowLeft.addEventListener('click', () => {
         chipsScroll.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
      });
      arrowRight.addEventListener('click', () => {
         chipsScroll.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
      });
      chipsScroll.addEventListener('scroll', updateArrows);
      window.addEventListener('resize', updateArrows);
      // Initial state
      updateArrows();
   }
});
