import re
import os

html_path = 'pages/tools/index.html'
css_path = 'css/tools.css'

# Update HTML
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# We need to turn:
# <a href="..." class="tool-card" data-category="..." style="...">
#    <span class="tool-card__badge">...</span>
#    <svg ...>...</svg>
#    <h3 class="tool-card__title">...</h3>
#    <p class="tool-card__desc">...</p>
#    <span class="tool-card__link">...</span>
# </a>
# Into the new structure.
# Instead of complex regex, we can just replace the whole tools-grid section.
grid_start = html_content.find('<section class="tools-grid" id="tools-grid">')
grid_end = html_content.find('</section>', grid_start) + len('</section>')

new_grid = '''<section class="tools-grid" id="tools-grid">

            <!-- Molar Mass Calculator -->
            <a href="/pages/tools/molar-mass.html" class="tool-card" data-category="Calculations"
                style="animation-delay: 0s">
                <div class="tool-card__cover">
                    <img src="../../assets/icons/Molar Mass Calculator.png" alt="Molar Mass Calculator" />
                    <span class="tool-card__badge">Basic</span>
                </div>
                <div class="tool-card__body">
                    <h3 class="tool-card__title">Molar Mass Calculator</h3>
                    <p class="tool-card__desc">Find the molar mass and average mass of any chemical formula.</p>
                    <span class="tool-card__link">Open tool &rarr;</span>
                </div>
            </a>

            <!-- Stoichiometry Calculator -->
            <a href="/pages/tools/stoichiometry.html" class="tool-card" data-category="Calculations"
                style="animation-delay: 0.08s">
                <div class="tool-card__cover">
                    <img src="../../assets/icons/Stoichiometry Calculator.png" alt="Stoichiometry Calculator" />
                    <span class="tool-card__badge">Intermediate</span>
                </div>
                <div class="tool-card__body">
                    <h3 class="tool-card__title">Stoichiometry Calculator</h3>
                    <p class="tool-card__desc">Calculate reactant and product relationships easily.</p>
                    <span class="tool-card__link">Open tool &rarr;</span>
                </div>
            </a>

            <!-- Chemical Equation Balancer -->
            <a href="/pages/tools/equation-balancer.html" class="tool-card" data-category="Equations"
                style="animation-delay: 0.16s">
                <div class="tool-card__cover">
                    <img src="../../assets/icons/Chemical Equation Balancer.png" alt="Chemical Equation Balancer" />
                    <span class="tool-card__badge">Intermediate</span>
                </div>
                <div class="tool-card__body">
                    <h3 class="tool-card__title">Chemical Equation Balancer</h3>
                    <p class="tool-card__desc">Automatically balance complex chemical reactions.</p>
                    <span class="tool-card__link">Open tool &rarr;</span>
                </div>
            </a>

            <!-- pH & pOH Calculator -->
            <a href="/pages/tools/ph-calculator.html" class="tool-card" data-category="Solutions"
                style="animation-delay: 0.24s">
                <div class="tool-card__cover">
                    <img src="../../assets/icons/pH &amp; pOH Calculator.png" alt="pH &amp; pOH Calculator" />
                    <span class="tool-card__badge">Basic</span>
                </div>
                <div class="tool-card__body">
                    <h3 class="tool-card__title">pH &amp; pOH Calculator</h3>
                    <p class="tool-card__desc">Calculate pH, pOH, and ion concentrations.</p>
                    <span class="tool-card__link">Open tool &rarr;</span>
                </div>
            </a>

            <!-- Molarity & Dilution Calculator -->
            <a href="/pages/tools/molarity-dilution.html" class="tool-card" data-category="Solutions"
                style="animation-delay: 0.32s">
                <div class="tool-card__cover">
                    <img src="../../assets/icons/Molarity &amp; Dilution.png" alt="Molarity &amp; Dilution" />
                    <span class="tool-card__badge">Basic</span>
                </div>
                <div class="tool-card__body">
                    <h3 class="tool-card__title">Molarity &amp; Dilution</h3>
                    <p class="tool-card__desc">Compute solution concentrations and dilutions precisely.</p>
                    <span class="tool-card__link">Open tool &rarr;</span>
                </div>
            </a>

            <!-- Percent Composition -->
            <a href="/pages/tools/percent-composition.html" class="tool-card" data-category="Calculations"
                style="animation-delay: 0.4s">
                <div class="tool-card__cover">
                    <img src="../../assets/icons/Percent Composition.png" alt="Percent Composition" />
                    <span class="tool-card__badge">Basic</span>
                </div>
                <div class="tool-card__body">
                    <h3 class="tool-card__title">Percent Composition</h3>
                    <p class="tool-card__desc">Determine elemental mass percentages within compounds.</p>
                    <span class="tool-card__link">Open tool &rarr;</span>
                </div>
            </a>

            <!-- Gibbs Free Energy -->
            <a href="/pages/tools/gibbs-free-energy.html" class="tool-card" data-category="Thermodynamics"
                style="animation-delay: 0.48s">
                <div class="tool-card__cover">
                    <img src="../../assets/icons/Gibbs Free Energy.png" alt="Gibbs Free Energy" />
                    <span class="tool-card__badge">Advanced</span>
                </div>
                <div class="tool-card__body">
                    <h3 class="tool-card__title">Gibbs Free Energy</h3>
                    <p class="tool-card__desc">Assess reaction spontaneity given enthalpy and entropy.</p>
                    <span class="tool-card__link">Open tool &rarr;</span>
                </div>
            </a>

            <!-- Ideal Gas Law -->
            <a href="/pages/tools/ideal-gas-law.html" class="tool-card" data-category="Gas Laws"
                style="animation-delay: 0.56s">
                <div class="tool-card__cover">
                    <img src="../../assets/icons/Ideal Gas Law.png" alt="Ideal Gas Law" />
                    <span class="tool-card__badge">Intermediate</span>
                </div>
                <div class="tool-card__body">
                    <h3 class="tool-card__title">Ideal Gas Law</h3>
                    <p class="tool-card__desc">Find pressure, volume, temperature, or moles of a gas.</p>
                    <span class="tool-card__link">Open tool &rarr;</span>
                </div>
            </a>

            <!-- Empirical Formula Finder -->
            <a href="/pages/tools/empirical-formula.html" class="tool-card" data-category="Calculations"
                style="animation-delay: 0.64s">
                <div class="tool-card__cover">
                    <img src="../../assets/icons/Empirical Formula Finder.png" alt="Empirical Formula Finder" />
                    <span class="tool-card__badge">Intermediate</span>
                </div>
                <div class="tool-card__body">
                    <h3 class="tool-card__title">Empirical Formula Finder</h3>
                    <p class="tool-card__desc">Calculate lowest whole number ratios of elements.</p>
                    <span class="tool-card__link">Open tool &rarr;</span>
                </div>
            </a>

            <!-- Oxidation State Finder -->
            <a href="/pages/tools/oxidation-state.html" class="tool-card" data-category="Equations"
                style="animation-delay: 0.72s">
                <div class="tool-card__cover">
                    <img src="../../assets/icons/Oxidation State Finder.png" alt="Oxidation State Finder" />
                    <span class="tool-card__badge">Intermediate</span>
                </div>
                <div class="tool-card__body">
                    <h3 class="tool-card__title">Oxidation State Finder</h3>
                    <p class="tool-card__desc">Identify oxidation numbers of atoms in compounds.</p>
                    <span class="tool-card__link">Open tool &rarr;</span>
                </div>
            </a>

        </section>'''

html_content = html_content[:grid_start] + new_grid + html_content[grid_end:]
html_content = html_content.replace('assets/icons/pH &amp; pOH Calculator.png', 'assets/icons/pH%20%26%20pOH%20Calculator.png')
html_content = html_content.replace('assets/icons/Molarity &amp; Dilution.png', 'assets/icons/Molarity%20%26%20Dilution.png')
for i in ['Molar Mass Calculator', 'Stoichiometry Calculator', 'Chemical Equation Balancer', 'Percent Composition', 'Gibbs Free Energy', 'Ideal Gas Law', 'Empirical Formula Finder', 'Oxidation State Finder']:
    html_content = html_content.replace(f'assets/icons/{i}.png', f'assets/icons/{i.replace(" ", "%20")}.png')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

# Update CSS
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

new_css = '''/* Tools Grid Section */
.tools-grid {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2.5rem 5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  box-sizing: border-box;
}

/* Tool Cards */
.tool-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e8e5e0;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  opacity: 0; /* for entrance animation */
}

.tool-card.card-visible {
  animation: cardFadeUp 0.5s ease forwards;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  border-color: #c8c4be;
}

/* ── Square Cover ── */
.tool-card__cover {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1; /* perfect square */
  overflow: hidden;
  background: #f5f3ef;
}

.tool-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.4s ease;
}

.tool-card:hover .tool-card__cover img {
  transform: scale(1.04);
}

/* ── Badge — overlaps top-right of image ── */
.tool-card__badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: #555;
  font-family: var(--font-family);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
}

/* ── Card Body ── */
.tool-card__body {
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
}

/* ── Title ── */
.tool-card__title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.2rem;
  font-weight: 400;
  color: #1a1a1a;
  line-height: 1.3;
  margin: 0;
}

/* ── Description ── */
.tool-card__desc {
  font-family: var(--font-family);
  font-size: 0.9rem;
  color: #555;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

/* ── Open Tool link — bottom right ── */
.tool-card__link {
  display: block;
  text-align: right;
  font-family: var(--font-family);
  font-size: 0.85rem;
  font-weight: 500;
  color: #888;
  text-decoration: none;
  margin-top: 0.5rem;
  transition: color 0.2s;
}

.tool-card:hover .tool-card__link {
  color: #1a1a1a;
}

@keyframes cardFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}'''

# Extract css before tools grid
grid_start = css_content.find('/* Tools Grid Section */')
# Extract after tool-card__link
link_end = css_content.find('.tool-card:hover .tool-card__link {')
end_block = css_content.find('}', link_end) + 1

css_content = css_content[:grid_start] + new_css + css_content[end_block:]

# Replace media query 480px parts
old_mobile = '''    .tool-card {
        padding: 1.25rem;
    }

    .tool-card__icon {
        width: 60px;
        height: 60px;
        margin-bottom: 16px;
    }

    .tool-card__title {
        font-size: 1.2rem;
    }

    .tool-card__desc {
        font-size: 0.9rem;
    }'''

new_mobile = '''    .tool-card__title {
        font-size: 1.1rem;
    }

    .tool-card__body {
        padding: 1rem 1.25rem 1.25rem;
    }'''

if old_mobile in css_content:
    css_content = css_content.replace(old_mobile, new_mobile)
else:
    print("Warning: Mobile block not found exactly as specified.")

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Done")
