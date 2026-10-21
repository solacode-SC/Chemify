# Code Map Index — Chemify (React + TypeScript Edition)

This is the **Code Map Index** for the modernized Chemify project, now built with **React 18, TypeScript, and Vite**.

---

### 1. GLOBAL ARCHITECTURE

- **Framework:** React 18 with TypeScript & Vite
- **Theme:** Botanical Parchment (`#E6E2D3`, `#4E5B47`, `#6F7F63`)
- **Main Entry:** `index.html` -> `src/main.tsx` -> `src/App.tsx`
- **Routing:** Stateful View Coordinator with URL hash synchronisation (`#elements`, `#lab`, `#tools`, `#about`, `#home`)

---

### 2. CORE MODULE MAP

#### `src/types/`
- `element.ts`: Type definitions for `ElementItem`, `ElementDetail`, `ElementCategory`, `ElementPhase`.
- `reaction.ts`: Types for `ReactantItem`, `ReactionState`, `ReactionStatus`, conditions and calculations.
- `tool.ts`: Types for `ToolItem`, `ToolCategory`, `ToolDifficulty`.

#### `src/data/`
- `elementsData.ts`: Complete data for all 118 elements with grid coordinates, periods, groups, masses, and category tokens.
- `elementDetailsData.ts`: Extended atomic data: phases, melting/boiling points, densities, electronegativities, Bohr electron shells, discoverer, history, and uses.
- `toolsData.ts`: Catalog of all 10 interactive chemistry calculators with icons and descriptions.

#### `src/utils/`
- `formulaParser.ts`: Recursive-descent chemical formula parser with hydrate (`CuSO4·5H2O`) and nested parentheses support, formula validation, and molar mass breakdown.
- `equationBalancer.ts`: Gaussian elimination matrix equation balancer for finding integer stoichiometric coefficients with atom conservation checking.
- `reactionEngine.ts`: Simulation engine for reactions, presets, conditions, and stoichiometric yield math.
- `chemistryCalculations.ts`: Mathematical engines for pH/pOH, Molarity/Dilution, Gibbs Free Energy ($\Delta G$), Ideal Gas Law ($PV = nRT$), Empirical Formula, and Oxidation States.

#### `src/components/`
- `common/`
  - `Navbar.tsx`: Strict 3-column responsive header layout (Left: Logo, Center: Nav links, Right: CTA + Hamburger) with sub-pixel centering, sticky blur backdrop, and mobile overlay drawer.
  - `Footer.tsx`: Vintage footer with links, copyright, and brand tagline.
  - `HeroCanvas.tsx`: Traveling pulse light grid simulation with interactive mouse proximity glow.
  - `AtomVisualizer.tsx`: 3D CSS rotating atom model with nucleus and 3 orbiting electron rings in botanical observatory frame.
- `home/`
  - `HomeView.tsx`: Main landing page orchestrator with clear section rhythm and zero visual collisions.
  - `HeroSection.tsx`: Landing hero with interactive canvas, copy, primary/ghost CTAs, and curated 10-element floating deck.
  - `AboutSection.tsx`: Split layout with botanical typography, metrics pills, and 3D atom model.
  - `FeaturesSection.tsx`: 3 feature summary cards with clean line-art icons and custom check lists.
  - `PeriodicTableTeaser.tsx`: Interactive category filter tabs, element specimen deck, and mini 18-column grid preview.
  - `PersonasSection.tsx`: 1:1 aspect-ratio botanical specimen cards perfectly proportioned for 1024x1024 artworks (Student, Researcher, Curious Mind) with aligned CTAs, plus a 2-column Reaction Studio Showcase banner.
  - `CtaBanner.tsx`: High-contrast botanical olive call-to-action banner.
- `explorer/`
  - `ExplorerView.tsx`: Periodic table explorer with real-time search, category scroll chips, state/period filters, grid vs responsive cards view toggle, and highlight mode.
  - `ElementModal.tsx`: Detailed element popup modal with navigation arrows, properties grid, and uses tags.
  - `ElectronShells.tsx`: Interactive SVG Bohr model with concentric shells and animated orbiting electrons.
- `lab/`
  - `LabView.tsx`: Reaction studio with reactant chip management, quick presets, "Run Reaction" simulation, and stoichiometry accordions.
  - `ReactionDiagram.tsx`: Multi-stage chemical molecular simulation engine tailored for each reaction (molecular geometries, CPK-coded bonded atoms, real-time activation energy sparks, thermodynamic thermometer gauge, effervescent gas bubbles, and precipitate settling).
- `tools/`
  - `ToolsView.tsx`: Chemistry tool catalog featuring full-width edge-to-edge illustration cards with hover zoom and quick launch dialogs.
  - `ToolModal.tsx`: Modal hosting individual interactive calculators:
    - `MolarMassCalc.tsx`
    - `EquationBalancerCalc.tsx`
    - `StoichiometryCalc.tsx`
    - `PHCalc.tsx`
    - `MolarityCalc.tsx`
    - `PercentCompositionCalc.tsx`
    - `GibbsCalc.tsx`
    - `IdealGasCalc.tsx`
    - `EmpiricalFormulaCalc.tsx`
    - `OxidationStateCalc.tsx`

---

### 3. ASSETS & ILLUSTRATIONS

- `assets/images/img4.png`: Student Persona
- `assets/images/img3.png`: Researcher Persona
- `assets/images/curious-mind.png`: Curious Mind Persona (generated via Nano Banana image generator)
- `assets/images/lab-studio.png`: Reaction Studio Setup (generated via Nano Banana image generator)
- `assets/icons/`: High-resolution tool card icons
- `assets/favicon.png`: Brand favicon
