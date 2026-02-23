import re

with open('css/lab.css', 'r') as f:
    css = f.read()

# Typography
css = css.replace("'DM Sans', sans-serif", "var(--font-family)")
css = css.replace("'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", "var(--font-family)")
css = css.replace("'Playfair Display', Georgia, serif", "Georgia, 'Times New Roman', serif")

# Body / Base
css = css.replace("background: #0a0d14;", "background: var(--color-bg);")
css = css.replace("color: #f9fafb;", "color: var(--color-text);")

# General Dark Colors -> Light Colors
css = css.replace("background: #111827;", "background: rgba(255, 255, 255, 0.6);")
css = css.replace("background: #0d1117;", "background: #fff;") # Diagram card
css = css.replace("border: 1px solid #1f2937;", "border: 1px solid rgba(26, 26, 26, 0.15);")
css = css.replace("border-bottom: 1px solid #1f2937;", "border-bottom: 1px solid rgba(26, 26, 26, 0.15);")
css = css.replace("border-top: 1px solid #1f2937;", "border-top: 1px solid rgba(26, 26, 26, 0.15);")

# Accents / Texts
css = css.replace("color: #9ca3af;", "color: #444;")
css = css.replace("color: #6b7280;", "color: #666;")
css = css.replace("color: #4b5563;", "color: #888;")

# Hero Section
css = css.replace(".lab-hero {\n    text-align: center;\n    padding: 3rem 2rem 1.5rem;", ".lab-hero {\n    text-align: center;\n    padding: calc(var(--navbar-height) + 40px) 32px 1.5rem;")
css = css.replace("font-size: 2.5rem;", "font-size: 3.5rem;")
css = css.replace("color: #1a1a1a;", "color: var(--color-text);") # Just in case

# Buttons/Chips
css = css.replace("background: #1f2937;", "background: transparent;") # Reactant chip
css = css.replace("border: 1px solid #374151;", "border: 1px solid rgba(26, 26, 26, 0.2);")

# .btn--primary
css = css.replace("background: #00d4ff;", "background: var(--color-text);")
css = css.replace("color: #0a0d14;", "color: #faf9f7;")
css = css.replace("color: #00d4ff;", "color: var(--color-text);") # Catch-all
css = css.replace("box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);", "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);")
css = css.replace("box-shadow: 0 0 32px rgba(0, 212, 255, 0.5);", "box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);")

# btn ghost
css = css.replace("border: 1px solid var(--color-text);", "border: 1.5px solid var(--color-border);")
css = css.replace("background: rgba(0, 212, 255, 0.08);", "background: var(--color-accent);")
css = css.replace("background: rgba(0, 212, 255, 0.12);", "background: rgba(26, 26, 26, 0.05);")
css = css.replace("box-shadow: 0 0 12px rgba(0, 212, 255, 0.15);", "box-shadow: none; color: #fff;")

# Equation coloring
css = css.replace("color: #00d4ff;", "color: var(--color-text);")

with open('css/lab.css', 'w') as f:
    f.write(css)

print("lab.css processed")
