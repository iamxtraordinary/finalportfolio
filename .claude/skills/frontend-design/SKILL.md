---
name: frontend-design
description: Master frontend design implementation for premium, high-fidelity, Awwwards-winning web applications. Covers micro-interactions, advanced typography, custom cursors, smooth scrolling (Lenis), complex GSAP scroll animations, and precise alignment to design specifications.
---

# Frontend Design

Create visually stunning, highly performant, and deeply interactive web interfaces that deliver premium user experiences matching high-end design specifications.

## When to Use This Skill

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
