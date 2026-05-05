# Code Map Index

Here is the **Code Map Index** for the Chemify project. It acts as a GPS system for future AI agents to immediately understand, locate, and modify application logic without reading every file.

---

### 1. GLOBAL STRUCTURE

- **Project Name:** Chemify
- **Purpose:** A modern chemistry platform for students and researchers to explore elements visually, simulate reactions, and use chemical calculators.
- **Main Entry Points:**
  - Landing Page: `/index.html` (Styles: `/styles.css`, Script: `/script.js`)
  - Explorer View: `/pages/explorer/index.html`
  - Lab View: `/pages/lab/index.html`
  - Tools View: `/pages/tools/index.html`
- **Key Features:**
  - Interactive custom canvas background (Hero).
  - Periodic Table Element Explorer.
  - Interactive Reaction Lab (Stoichiometry, Equations).
  - Various Chemistry Calculators (Molar mass, pH, Ideal gas, etc.).

---

### 2. MAJOR FILE MAP

**File: `/index.html`**
- **Purpose:** Structure of the landing page (Hero, Features, Personas, CTA).
- **Depends on:** `/styles.css`, `/script.js`
- **Sections:**
  - `Navbar` (Lines: 20–68): Navigation mapping & mobile overlay trigger.
  - `Hero` (Lines: 85–138): Hero canvas animations and visual element tiles.
  - `About & Features` (Lines: 140–210): Core feature summaries with SVGs.
  - `Personas & Footer` (Lines: 230–330): User targeting panels and footer links.

**File: `/styles.css`** (Global UI & Styling)
- **Purpose:** Shared styling, typography, variables, responsive layouts, and redesign updates.
- **Used by:** Every `.html` file across the project.
- **Sections:**
  - `Variables & Typography` (Lines: 1–25): Brand constants (olive greens, vintage borders).
  - `Navbar` (Lines: 50–150): App Header.
  - `Cards Redesign` (Lines: 1400–1450): `.features__card` soft botanical updates.
  - `Global Buttons` (Lines: 1460–1496): Soft pill shape UI elements.

**File: `/script.js`**
- **Purpose:** Landing page interaction handlers.
- **Sections:**
  - `Navbar Logic` (Lines: 5–45): Scroll thresholds, hamburger toggle, overlay tracking.
  - `Hero Canvas Animation` (Lines: 60–160): Generates the interactive canvas `Pulse` lighting effect over grids.
  - `Scroll Reveals` (Lines: 165–200): Intersection observers for fading in element tiles.
  - `Periodic Table Teaser` (Lines: 200–260): Generating the mini periodic table mesh grid programmatically.

**File: `/js/lab/main.js` & `/js/lab/store.js`**
- **Purpose:** State manager and root initialization for the Reactive Lab. Includes lab elements parsing.
- **Depends on:** `/js/utils/parser.js`, `/js/lab/reactants.js`, `/js/lab/reaction.js`

**File(s): `/js/tools/*.js`**
- **Purpose:** Chemistry computation formulas attached to specific modular UI panels.
- **Sections (Typical):** 
  - Initialization -> DOM attachment -> `calculate()` function -> Render.

---

### 3. FEATURE MAP (CROSS-FILE)

**Feature A: "Lab Simulation Engine"**
- **Files involved:**
  - `/pages/lab/index.html` (Structure)
  - `/css/lab.css` (UI Styles)
  - `/js/lab/store.js` (State and memory storage)
  - `/js/lab/reaction.js` (Computes reaction logic/outcomes)
  - `/js/lab/calculations.js` (Stoichiometry/Yield math)
  - `/js/lab/equation.js` (Visual balancer output)
- **Flow:**
  1. User selects reactants via `/js/lab/reactants.js`.
  2. Data is kept in `/js/lab/store.js`.
  3. `reaction.js` processes reaction type.
  4. Visual nodes render updates via `/js/lab/diagram.js` and `equation.js`.

**Feature B: "Tools / Calculators"**
- **Files involved:**
  - `/pages/tools/index.html` (List of tools UI)
  - `/js/tools/modal.js` (Tool presentation framing)
  - `/js/tools/*.js` (Individual computational logic)
- **Flow:** 
  User opens tool -> `modal.js` frames the UI -> Individual script (e.g. `molar-mass.js`) runs parser events -> Returns UI results.

---

### 4. QUICK ACCESS INDEX (LOOKUP TABLE)

| Logic / Component | File to Modify | Target Lines (Approx.) |
| --- | --- | --- |
| **Landing Navbar** | `script.js` | 5–45 |
| **Landing Hero Canvas** | `script.js` | 60–160 |
| **Brand Colors / Typography** | `styles.css` | 1–30 |
| **Card Borders / Aesthetic** | `styles.css` | 1400–1450 |
| **Buttons / CTA Styling** | `styles.css` | 1460–1496 |
| **Lab Reactants State** | `js/lab/store.js` | Full module |
| **Molecule Math/Parsing** | `js/utils/parser.js` | Full module |
| **Periodic Table Explorer** | `js/explorer.js` / `js/data/elements.js` | Full module |

---

### 5. MODIFICATION GUIDE

**Task: "Change Hero Title or Button Linking"**
→ Go to: `/index.html` (Lines 90–110).

**Task: "Change color variables or fonts"**
→ Go to: `/styles.css` (Lines 10–25). Make sure to keep `--color-bg-scroll`, `--color-text` synced with the soft botanical theme.

**Task: "Tweak Canvas Background Lines"**
→ Go to: `/script.js` (Lines 80–120 in the `Pulse` class constructor).

**Task: "Add a new Calculator Tool"**
1. Add an entry card inside `/pages/tools/index.html`.
2. Append a `.css` file mapped to `/css/tools.css`.
3. Add a dedicated module logic block in `/js/tools/`.
4. Register the trigger logic via `js/tools-search.js` & `modal.js`.

---

### 6. DEPENDENCY GRAPH (SIMPLIFIED)

- **Entry / DOM Elements** (`index.html`, `/pages/*`) 
  ⬇️ loads styles
- **CSS Block** (`styles.css`, `global.css`, `explorer.css`)
  ⬇️ renders layout, then JS initializes functionality
- **Global JS Controllers** (`script.js`, `modal.js`, `utils.js`)
  ⬇️ orchestrates page activity and routes to Domain Layers
- **Domain Handlers** 
  - `js/lab/main.js` ➔ Drives Simulation.
  - `js/explorer.js` ➔ Drives element grids via `js/data/elements.js`.
  - `js/tools/*.js` ➔ Specific mathematical engines for calculation.