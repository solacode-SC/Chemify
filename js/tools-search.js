// js/tools-search.js

const tools = [
    {
        id: "molar-mass",
        title: "Molar Mass Calculator",
        category: "Calculations",
        difficulty: "Basic",
        description: "Find the molar mass and average mass of any chemical formula."
    },
    {
        id: "stoichiometry",
        title: "Stoichiometry Calculator",
        category: "Calculations",
        difficulty: "Intermediate",
        description: "Calculate reactant and product relationships easily."
    },
    {
        id: "equation-balancer",
        title: "Chemical Equation Balancer",
        category: "Equations",
        difficulty: "Intermediate",
        description: "Automatically balance complex chemical reactions."
    },
    {
        id: "ph-calculator",
        title: "pH & pOH Calculator",
        category: "Solutions",
        difficulty: "Basic",
        description: "Calculate pH, pOH, and ion concentrations."
    },
    {
        id: "molarity-dilution",
        title: "Molarity & Dilution",
        category: "Solutions",
        difficulty: "Basic",
        description: "Compute solution concentrations and dilutions precisely."
    },
    {
        id: "percent-composition",
        title: "Percent Composition",
        category: "Calculations",
        difficulty: "Basic",
        description: "Determine elemental mass percentages within compounds."
    },
    {
        id: "gibbs-free-energy",
        title: "Gibbs Free Energy",
        category: "Thermodynamics",
        difficulty: "Advanced",
        description: "Assess reaction spontaneity given enthalpy and entropy."
    },
    {
        id: "ideal-gas-law",
        title: "Ideal Gas Law",
        category: "Gas Laws",
        difficulty: "Intermediate",
        description: "Find pressure, volume, temperature, or moles of a gas."
    },
    {
        id: "empirical-formula",
        title: "Empirical Formula Finder",
        category: "Calculations",
        difficulty: "Intermediate",
        description: "Calculate lowest whole number ratios of elements."
    },
    {
        id: "oxidation-state",
        title: "Oxidation State Finder",
        category: "Equations",
        difficulty: "Intermediate",
        description: "Identify oxidation numbers of atoms in compounds."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-tools');
    const filterChips = document.querySelectorAll('.tools-filter');
    const toolsGrid = document.getElementById('tools-grid');
    const emptyState = document.getElementById('empty-state');
    const resultsCount = document.getElementById('results-count');
    const toolCards = Array.from(toolsGrid.querySelectorAll('.tool-card'));

    // Scroll Elements
    const chipsScroll = document.getElementById('chipsScroll');
    const chipArrowLeft = document.getElementById('chipArrowLeft');
    const chipArrowRight = document.getElementById('chipArrowRight');

    let currentSearchTerm = '';
    let currentCategory = 'All';

    // 0. Horizontal Scroll Logic
    function updateArrows() {
        if (!chipsScroll) return;
        const maxScroll = chipsScroll.scrollWidth - chipsScroll.clientWidth;

        if (chipsScroll.scrollLeft <= 0) {
            chipArrowLeft?.classList.add('is-hidden');
        } else {
            chipArrowLeft?.classList.remove('is-hidden');
        }

        if (chipsScroll.scrollLeft >= maxScroll - 1) {
            chipArrowRight?.classList.add('is-hidden');
        } else {
            chipArrowRight?.classList.remove('is-hidden');
        }
    }

    if (chipsScroll) {
        chipsScroll.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        // Initial check
        updateArrows();
    }

    chipArrowLeft?.addEventListener('click', () => {
        chipsScroll.scrollBy({ left: -150, behavior: 'smooth' });
    });

    chipArrowRight?.addEventListener('click', () => {
        chipsScroll.scrollBy({ left: 150, behavior: 'smooth' });
    });

    // 1. URL State Management
    function parseUrlParams() {
        const params = new URLSearchParams(window.location.search);
        currentSearchTerm = params.get('q') || '';
        currentCategory = params.get('category') || 'All';

        // Update UI to match
        searchInput.value = currentSearchTerm;
        filterChips.forEach(chip => {
            if (chip.dataset.category === currentCategory) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
    }

    function updateUrlParams() {
        const url = new URL(window.location);
        if (currentSearchTerm) {
            url.searchParams.set('q', currentSearchTerm);
        } else {
            url.searchParams.delete('q');
        }

        if (currentCategory !== 'All') {
            url.searchParams.set('category', currentCategory);
        } else {
            url.searchParams.delete('category');
        }

        // Only push state if it changed
        if (window.location.search !== url.search) {
            history.pushState({}, '', url);
        }
    }

    // 2. Filtering Logic
    function filterCards() {
        let visibleCount = 0;
        const normalizedSearchTerm = currentSearchTerm.toLowerCase().trim();

        toolCards.forEach(card => {
            // Because DOM parsing gives different link formatting compared to our ID, we rely 
            // on the in-memory array properties explicitly synced to DOM index.
            // Using DOM index is safe because tool array maps perfectly to the order in the DOM.
            const index = toolCards.indexOf(card);
            const toolData = tools[index];

            const matchesSearch = !normalizedSearchTerm ||
                toolData.title.toLowerCase().includes(normalizedSearchTerm) ||
                toolData.description.toLowerCase().includes(normalizedSearchTerm);

            const matchesCategory = currentCategory === 'All' || toolData.category === currentCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
                visibleCount++;
                // Slight hack: we need to ensure observer animations trigger properly when re-shown.
                card.classList.remove('card-visible');
                // Allow browser reflow
                void card.offsetWidth;
                observer.observe(card);
            } else {
                card.style.display = 'none';
                card.classList.remove('card-visible'); // Reset animation state
                observer.unobserve(card);
            }
        });

        // Update Results Count
        if (visibleCount === 1) {
            resultsCount.textContent = `Showing 1 tool`;
        } else if (visibleCount > 1) {
            resultsCount.textContent = `Showing ${visibleCount} tools`;
        } // We don't display "Showing 0 tools" because of the empty state. 

        // Empty State handling
        if (visibleCount === 0) {
            emptyState.style.display = 'flex';
            emptyState.classList.add('empty-visible');
            toolsGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            emptyState.classList.remove('empty-visible');
            toolsGrid.style.display = 'grid';
        }

        updateUrlParams();
    }

    // 3. Event Listeners
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        filterCards();
    });

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Reset active classes
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            currentCategory = chip.dataset.category;
            filterCards();
        });
    });

    // Handle Browser Back/Forward buttons
    window.addEventListener('popstate', () => {
        parseUrlParams();
        filterCards();
    });

    // 4. Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Pressing '/' focuses search input, ignoring if inside an input already
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            searchInput.focus();
        }

        // Pressing 'Escape' clears search and resets filter
        if (e.key === 'Escape') {
            currentSearchTerm = '';
            searchInput.value = '';

            currentCategory = 'All';
            filterChips.forEach(c => {
                c.classList.toggle('active', c.dataset.category === 'All');
            });

            searchInput.blur();
            filterCards();
        }
    });

    // 5. Entrance Animations via IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
                // Stop observing once animated in
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial load sequence
    parseUrlParams();
    filterCards(); // Will observe visible cards after filtering
});
