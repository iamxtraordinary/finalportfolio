---
name: frontend-design
description: Master frontend design implementation for premium, high-fidelity, Awwwards-winning web applications. Covers micro-interactions, advanced typography, custom cursors, smooth scrolling (Lenis), complex GSAP scroll animations, and precise alignment to design specifications.
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:

- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
**Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: you are capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

- Implementing Awwwards-caliber layouts and interactions
- Creating custom cursor interactions and blend-mode effects
- Setting up fluid typography scales (`clamp()`) and custom design tokens
- Structuring complex GSAP timelines, ScrollTrigger pinning, and SplitText character reveals
- Integrating smooth scrolling (Lenis) and seamless page transitions (Barba.js)
- Translating Figma design specifications into pixel-perfect Vanilla HTML/CSS/JS or modern frameworks

## Best Practices

1. **Pixel & Token Precision**: Strictly follow established design tokens (colors, font families, custom properties) without introducing unvetted ad-hoc values.
2. **Dynamic Micro-Interactions**: Build rich hover, focus, and press states for all interactive elements. Use custom cursors to amplify engagement where appropriate.
3. **Smooth Performance**: Tie smooth scrolling (Lenis) directly to the GSAP ticker (`gsap.ticker.add`) for zero-lag ScrollTrigger execution.
4. **Clean Entrance & Exit Flows**: Account for initial loading curtains, stagger reveals, and page transition wiping mechanics (e.g., Barba.js leave/enter hooks).
5. **Hardware Acceleration**: Leverage `will-change: transform` dynamically during active transitions and clear it `onComplete` to maintain 60FPS performance.
6. **Robust Fallbacks**: Provide elegant fallbacks for touch devices (`@media (pointer: coarse)`) and respect user accessibility preferences (`prefers-reduced-motion`).

## Quality Checklist

- [ ] **Typography**: Custom fonts loaded efficiently (`font-display: swap`) with fluid font scaling.
- [ ] **Contrast & Aesthetics**: Colors adhere exactly to the defined palette; proper dark/light theme handling for navigation and floating indicators.
- [ ] **Interaction**: Underline expansions, magnetic text effects, and card lift shadows feel responsive and buttery smooth.
- [ ] **Clean DOM**: Semantic HTML structure with appropriate `aria-hidden` attributes on decorative split-text elements.
