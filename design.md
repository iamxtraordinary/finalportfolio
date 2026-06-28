# Emmanuel Okaka — Portfolio Design Specification
> Complete design + animation blueprint for Claude Code implementation.
> Stack: Vanilla HTML + CSS + JavaScript · Vite · GSAP + ScrollTrigger + SplitText · Lenis · Barba.js

---

## 1. Technical Stack & Architecture

### Why Vanilla (Not Next.js / React)
This portfolio is two pages: `index.html` (Home) and `about.html` (About). React adds framework overhead, router conflicts with Barba.js, and hydration cost — none of which help a portfolio. Vanilla gives full control of every frame.

### Core Dependencies
```
gsap@3.12+         — Animation engine (timeline, tweens)
@gsap/ScrollTrigger — Scroll-linked animations
@gsap/SplitText    — Text splitting for character/word/line reveals
lenis@1.1+         — Smooth scroll with momentum/inertia
@barba/core@2.10+  — Page transitions (hijacks anchor navigation)
@barba/prefetch    — Prefetches next page on hover for instant transitions
vite@5+            — Build tool / dev server
```

### File Structure
```
/
├── index.html               ← Home page
├── about.html               ← About page
├── src/
│   ├── css/
│   │   ├── reset.css        ← Box-sizing, margin reset
│   │   ├── tokens.css       ← CSS custom properties (colors, type, spacing)
│   │   ├── global.css       ← Base styles, cursor, selection color
│   │   ├── loader.css       ← Loading screen styles
│   │   ├── nav.css          ← Navigation
│   │   ├── home.css         ← Home page sections
│   │   └── about.css        ← About page sections
│   ├── js/
│   │   ├── main.js          ← Entry: Lenis init, Barba init, register GSAP plugins
│   │   ├── loader.js        ← First-load animation sequence
│   │   ├── transitions.js   ← Barba page transition definitions
│   │   ├── home.js          ← Home page scroll animations
│   │   └── about.js         ← About page scroll animations
│   └── assets/
│       ├── fonts/           ← Mighty Slab, Druk Wide, Druk Text Wide, DM Sans, Inter
│       └── images/          ← Optimized WebP exports of all photos
├── package.json
└── vite.config.js
```

---

## 2. Design Tokens

### Colors
```css
:root {
  --color-periwinkle: #8388ff;   /* Primary canvas — hero, second section, footer */
  --color-white:      #ffffff;   /* About page bg, card faces, text on dark */
  --color-black:      #000000;   /* Body text, service cards, statement section */
  --color-charcoal:   #1b1b1b;   /* Card hover states, deep backgrounds */
  --color-gray:       #d9d9d9;   /* Timeline markers, placeholder containers */
  --color-overlay:    rgba(0,0,0,0.04); /* Subtle card hover overlay */
}
```

### Typography
```css
:root {
  /* Display — slab serif, high-impact section headers */
  --font-display: 'Mighty Slab W01', serif;

  /* Title — wide bold sans, name + project headings */
  --font-title: 'Druk Wide Web', sans-serif;
  --font-title-weight: 700;

  /* Body — wide medium sans, paragraphs */
  --font-body: 'Druk Text Wide Web', sans-serif;
  --font-body-weight: 500;

  /* Meta — modern sans, dates + sub-labels */
  --font-meta: 'DM Sans', sans-serif;

  /* UI — functional sans, tags + buttons */
  --font-ui: 'Inter', sans-serif;
}
```

### Font Loading
- Self-host all fonts in `/src/assets/fonts/`
- Use `@font-face` with `font-display: swap` in `tokens.css`
- Preload the two most critical fonts (Mighty Slab, Druk Wide) in `<head>` with `<link rel="preload">`

### Type Scale
```css
:root {
  --text-hero:     clamp(72px, 12vw, 160px);   /* EMMANUEL OKAKA */
  --text-display:  clamp(56px, 9vw, 120px);    /* ABOUT ME, I TURN IDEAS */
  --text-heading:  clamp(40px, 6vw, 80px);     /* My Projects, Need Help?, Gallery */
  --text-title:    clamp(24px, 3vw, 36px);     /* WHO I AM, section labels */
  --text-body:     clamp(14px, 1.4vw, 18px);   /* Paragraphs */
  --text-meta:     clamp(11px, 1vw, 13px);     /* Dates, sub-labels, nav */
  --text-ui:       clamp(12px, 1.1vw, 14px);   /* Tags, buttons */
}
```

### Spacing
```css
:root {
  --space-xs:   8px;
  --space-sm:   16px;
  --space-md:   32px;
  --space-lg:   64px;
  --space-xl:   120px;
  --space-2xl:  180px;
  --gutter:     clamp(24px, 5vw, 80px);  /* Page horizontal padding */
}
```

---

## 3. Global Behaviors

### Custom Cursor
Replace the default browser cursor with a custom dot cursor:
- A `12px` white circle that follows mouse position with `gsap.to(cursor, { x, y, duration: 0.4, ease: 'power3.out' })`
- On hover over links/cards: cursor expands to `48px`, changes `mix-blend-mode: difference`
- On mousedown: cursor squishes to `8px` scale
- On dark backgrounds: cursor is white. On light backgrounds: cursor is black.
- The cursor div lives outside `[data-barba="wrapper"]` so it persists across page transitions.

### Lenis Smooth Scroll Setup
```js
// main.js
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

// Sync Lenis to GSAP ticker — critical for ScrollTrigger accuracy
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### Selection Color
```css
::selection {
  background: var(--color-periwinkle);
  color: var(--color-black);
}
```

---

## 4. Loader (First Visit Only)

**Inspiration:** 9to5studio.it — the loader IS the brand, not a spinner.

### Visual
- Full-screen `#000000` overlay
- Logo text "EMMANUEL / OKAKA" rendered in `--font-title` at `--text-hero` size, white, center-aligned
- Below: "SOFTWARE ENGINEER & MOBILE DEVELOPER" in `--font-meta`, letter-spaced, white, small

### Animation Sequence (GSAP Timeline)
```
t=0.0s  — Page is black. Logo chars are split (SplitText) and positioned 100px below, opacity 0.
t=0.2s  — Chars stagger in: y: 0, opacity: 1, stagger: 0.04, ease: 'power4.out', duration: 0.8
t=1.2s  — Subtitle fades in: opacity 0→1, y: 20→0, duration: 0.5
t=1.8s  — Brief hold (the brand moment)
t=2.0s  — CURTAIN WIPE: a black div covers the loader from bottom to top (scaleY: 0→1 from bottom, ease: 'power3.inOut', duration: 0.7)
t=2.5s  — Simultaneously: loader div exits upward (y: 0 → -100%, duration: 0.6)
t=2.6s  — Hero content begins its entrance animation (see Section 6)
```

**Important:** Store a `sessionStorage.setItem('visited', true)` flag. On subsequent page loads within the session, skip the loader entirely and go straight to hero entrance.

---

## 5. Barba.js Page Transitions

### Setup
```html
<!-- Both pages must have this structure -->
<div data-barba="wrapper">
  <main data-barba="container" data-barba-namespace="home">
    <!-- page content -->
  </main>
</div>
```

### Transition: Home → About (and reverse)
A full-screen periwinkle (`#8388ff`) panel wipes across the screen, then wipes away to reveal the new page.

```
LEAVE phase (current page):
  1. A div (#transition-panel) fixed, full-screen, background #8388ff, starts at x: 100%
  2. gsap.to(panel, { x: '0%', duration: 0.6, ease: 'power3.inOut' })
  3. Current page content: opacity fades to 0 simultaneously (duration: 0.3)

ENTER phase (new page):
  1. Panel is at x: 0% (covering screen)
  2. New page is rendered but hidden behind panel
  3. gsap.to(panel, { x: '-100%', duration: 0.6, ease: 'power3.inOut', delay: 0.1 })
  4. New page content entrance animations fire (see respective section)
```

### Re-initialization on transition
After each Barba transition completes:
- Reinitialize `ScrollTrigger.refresh()`
- Reinitialize page-specific scroll animations (home.js or about.js)
- Reinitialize `Lenis` scroll position to top

---

## 6. Navigation

### Layout
```
[About]   [Contact]   [Projects]          [extra button / "Hire Me"]
```
- Position: `fixed` top, full width, `z-index: 100`
- Background: `transparent` — floats over page content
- Font: `--font-meta`, uppercase, letter-spacing: `0.12em`
- Color: white on `--color-periwinkle` sections, black on white sections
- Use `gsap.to(nav, { color })` on `ScrollTrigger` to swap nav color at section boundaries

### Entrance
- On page load (after loader exits): nav links stagger in from `y: -20, opacity: 0` with `stagger: 0.08`

### Hover State
- Each nav link has a duplicate underline span that scales from `scaleX: 0` to `scaleX: 1` on hover, `ease: 'power3.out'`, `duration: 0.3`

---

## 7. Home Page — Section by Section

### Section 1: Hero

**Layout:**
- Full viewport height (`100dvh`), background `--color-periwinkle`
- Centered subtitle at top: `"SOFTWARE ENGINEER & MOBILE DEVELOPER"` — `--font-title`, small caps, white, absolutely positioned ~80px from top, horizontally centered
- Name `"EMMANUEL"` on line 1, `"OKAKA"` on line 2 — anchored to bottom-left, ~60px from bottom, ~60px from left
- Font: `--font-title`, size: `--text-hero`, color: `--color-black`, line-height: 0.9

**Entrance Animation (fires after loader wipe completes):**
```
SplitText on "EMMANUEL" and "OKAKA" into chars
chars start: y: 120px, opacity: 0, rotateX: -20deg (slight 3D tilt)
gsap.from(chars, {
  y: 120, opacity: 0, rotateX: -20,
  stagger: 0.035, duration: 1.0, ease: 'power4.out',
  delay: 0 (fires immediately after curtain)
})
Subtitle: fades in y: -20→0, opacity: 0→1, duration: 0.6, delay: 0.4
Nav: stagger in simultaneously with subtitle
```

**Scroll Behavior:**
- As user scrolls down, the name text has a very subtle `y` parallax (moves up at 0.3x scroll speed) via ScrollTrigger `scrub: 1`

---

### Section 2: HELLO

**Layout:**
- Full-width, background `--color-periwinkle` (continuous from hero, no break)
- Left column: Vertical "HELLO!" text rotated -90deg, `--font-display`, massive, treated as decorative
- Photo 1 (with classic car): rectangular, slight 2–3° clockwise rotation (`rotate: 2deg`), positioned overlapping the HELLO text
- Center: Stats row — `2+`, `4`, `5+` with labels below in `--font-meta`
- Right side: Short bio paragraph in `--font-body`, medium size
- Photo 2 (selfie): rectangular, slight counter-clockwise rotation (`rotate: -1.5deg`), right side
- Bottom left: Hobbyist copy in `--font-body`, small
- Bottom center: `"About Me"` pill button — white background, black text, `--font-ui`, rounded `999px`, `padding: 14px 40px`

**Scroll Animations:**
```
"HELLO!" text: scrubs upward slightly as section enters (parallax, scrub: 1.5)
Photo 1: slides in from left (x: -80px → 0) as section enters viewport
  trigger: the section, start: 'top 80%', end: 'top 30%', scrub: 1
Photo 2: slides in from right (x: 80px → 0), same trigger timing
Stats numbers: count up animation using gsap.to on a custom counter object
  "2+" counts from 0→2, "4" from 0→4, "5+" from 0→5
  duration: 1.5, ease: 'power2.out', onUpdate: render rounded value
Bio text: lines stagger in from y: 30px, opacity: 0, stagger: 0.1
```

**"About Me" Button Hover:**
- Background transitions from white → `--color-black`
- Text transitions from black → white
- Scale: 1 → 1.04
- Duration: `0.3s`, `ease: power2.out`

---

### Section 3: My Projects

**Layout:**
- Background: `--color-white`
- Heading `"My"` then `"Projects"` — left-aligned, `--font-display`, `--text-heading`, color `--color-black`
- Below heading: Project cards stacked/overlapping (Figma shows a layered/floating card effect)
- Each card is a rounded-rectangle (`border-radius: 16px`) showing a project screenshot
- Project name label bottom-right of card, `--font-title`, small, black

**Scroll Animation:**
```
Heading "My Projects": SplitText by word
Words enter from y: 60px, opacity: 0, stagger: 0.15, ease: 'expo.out'
trigger: start: 'top 75%'

Project cards: enter from below with stagger
card 1: y: 100px → 0, opacity: 0→1, rotation: -2deg → 0
card 2: y: 140px → 0, opacity: 0→1, rotation: 1.5deg → 0
stagger: 0.12, ease: 'power3.out'

Cards hover state:
  scale: 1 → 1.03
  box-shadow: 0 20px 60px rgba(0,0,0,0.15)
  The project screenshot inside clips and scales up slightly (scale: 1→1.08 on inner img)
  duration: 0.4, ease: 'power2.out'
```

---

### Section 4: Statement — "I TURN IDEAS INTO REALITY"

**Layout:**
- Full-viewport-height section, background `--color-black`
- Text centered both axes
- Font: `--font-display`, `--text-display`, color `--color-white`
- Each word on its own line: `"I TURN"` / `"IDEAS"` / `"INTO"` / `"REALITY"`

**Scroll Animation:**
```
SplitText by word. As section pins and user scrolls through it:
ScrollTrigger pin: true, scrub: 1
Words animate in one by one, y: 80px → 0, opacity: 0→1
Each word waits for previous to complete (stagger via timeline markers)
Optionally: words start in --color-charcoal (dark gray, barely visible on black)
and transition to --color-white as they're "activated" by scroll position
This creates the "text reveal on scroll" effect popularized by Awwwards sites.
```

---

### Section 5: Need Help? / Services

**Layout:**
- Background: `--color-white`
- Heading `"Need Help?"` — left-edge bleed, `--font-display`, `--text-heading`, black
- Sub-label: `"I offer these services"` in `--font-meta`, small, below heading
- Service tags: Bento-style grid of pill/card buttons
  - Row 1: `[Web Development]` `[Mobile Development]` — larger cards, full `--font-title` bold
  - Row 2: `[Flutter & Dart]` `[☆]` `[React]` — medium cards, star icon in center
  - Row 3: `[Typescript]` `[Front-end Design]` `[Back-end development]` — smaller cards
- All cards: background `--color-black`, text `--color-white`, `border-radius: 12px`

**Scroll Animation:**
```
"Need Help?" heading: x: -100px → 0, opacity: 0→1, duration: 0.8, ease: 'expo.out'
Service cards: stagger in from y: 40px, opacity: 0
stagger: 0.06, ease: 'back.out(1.4)', duration: 0.5
trigger: start: 'top 70%'

Card hover:
  background: --color-black → --color-charcoal
  scale: 1 → 1.04
  The card lifts with box-shadow: 0 12px 32px rgba(0,0,0,0.2)
  duration: 0.25
```

---

### Section 6: Get in Touch (Footer)

**Layout:**
- Full-viewport, background `--color-periwinkle`
- `"Get in Touch"` — centered, `--font-display`, `--text-display`, `--color-white`
- Bottom bar: `[GITHUB]` `[EMAIL]` `[INSTAGRAM]` `[LINKEDIN]` — evenly spaced, `--font-title`, small, white

**Scroll Animation:**
```
"Get in Touch": SplitText by char
chars stagger in from y: 60px, opacity: 0, rotation: 8deg → 0
stagger: 0.04, ease: 'power4.out', duration: 0.8

Social links: fade in from y: 20px, stagger: 0.08, delay: 0.4

"Get in Touch" hover behavior (whole section):
As cursor moves over the text, individual chars respond to mouse proximity
chars nearest cursor: scale up slightly (1.0→1.15), creating a magnetic ripple effect
Implementation: on mousemove, calculate distance from each char to cursor,
apply gsap.to(char, { scale, y: -offset }) proportional to proximity
```

---

## 8. About Page — Section by Section

### Section 1: About Hero

**Layout:**
- Background: `--color-white`
- `"ABOUT"` on line 1, `"ME"` on line 2 — top-left aligned, `--font-display`, `--text-display`, `--color-black`
- Right side: `"WHO I AM"` label — `--font-title`, medium, black, positioned middle-right
- Photo (street photo with building): right side, approximately 300×350px, `border-radius: 8px`
- Left-center: Bio text block in `--font-body`, two paragraphs
  - Paragraph 1: Professional bio
  - Paragraph 2: Personal/hobbies

**Entrance Animation (fires on Barba enter):**
```
"ABOUT" chars: stagger in from y: 100px, rotateX: -15deg
"ME" chars: same, slightly delayed (stagger offset continues)
ease: 'power4.out', duration: 0.9, stagger: 0.05

"WHO I AM": x: 40px → 0, opacity: 0→1, delay: 0.4, duration: 0.6

Photo: scale: 0.92 → 1, opacity: 0 → 1, y: 30px → 0, delay: 0.3
Photo has a subtle rotation: rotate: 1.5deg (matches Figma)

Bio paragraphs: lines stagger in from y: 20px, opacity: 0
stagger: 0.08, delay: 0.6
```

---

### Section 2: Gallery

**Layout:**
- Background: `--color-white`
- Heading `"Gallery"` with a `☆` icon — left-aligned, `--font-display`, `--text-heading`, black
- 4 photos in a horizontal row: each slightly rotated (alternating ±2–3deg, matching Figma's polaroid feel)
- Star `☆` icons beneath each photo
- Each photo: approximately 200×260px, `border-radius: 6px`

**Scroll Animation:**
```
"Gallery" heading: x: -60px → 0, opacity: 0→1, ease: 'expo.out'

Photos: enter as a stagger sequence
gsap.from(photos, {
  y: 60, opacity: 0, rotation: (i) => i % 2 === 0 ? 4 : -4,
  stagger: 0.1, ease: 'power3.out', duration: 0.7
})
trigger: start: 'top 75%'

Photo hover:
  rotation snaps to 0deg (straightens up)
  scale: 1 → 1.06
  z-index raises (card lifts to front)
  box-shadow: 0 16px 48px rgba(0,0,0,0.2)
  duration: 0.35, ease: 'power2.out'
On mouseLeave: rotation returns to original value
```

---

### Section 3: Education & Experience

**Layout:**
- Two-column layout on white background
- Left: `"Education"` — label in `--font-title`, bold, black. Below: degree details in `--font-meta`
  - Card: light gray background (`--color-gray`), `border-radius: 8px`, `padding: 20px`
  - Content: `"SECOND CLASS UPPER HONORS"` small label, `"Computer Science — Bsc."` in `--font-body`, university name in `--font-meta`
- Right: `"Experience"` — same label style
  - Timeline: left-border line in `--color-gray`, `2px solid`
  - Each entry: filled circle marker on the line, title bold, company in `--font-meta`, dates in `--font-meta` faded

**Scroll Animation:**
```
Education card: x: -50px → 0, opacity: 0→1, ease: 'power3.out'
Experience items: stagger from y: 30px, opacity: 0, stagger: 0.12
Timeline line: scaleY: 0 → 1 (drawing effect), transform-origin: top, duration: 0.8
trigger: start: 'top 70%'
```

---

### Section 4: About Footer

**Layout:**
- Social links row: `[GITHUB]` `[EMAIL]` `[INSTAGRAM]` `[LINKEDIN]` — spaced across full width, `--font-title`, small, black
- Below: arrow pointing down `↓`
- Smiley face `☺` icon (large, outline only)
- CTA text: `"Let's build something Xtraordinary"` — `--font-display`, medium, centered
- Background: `--color-white`

**Scroll Animation:**
```
Smiley face: rotates slowly on scroll (rotate: 0 → 360deg, scrub: 2)
CTA text: SplitText by char, stagger in from y: 40px
Social links: stagger in from opacity: 0, y: 15px, stagger: 0.08
```

---

## 9. Micro-interactions & Details

### Star Icons `☆`
Used throughout (Gallery heading, photo captions). These should:
- Rotate 180deg on hover, `duration: 0.4, ease: 'back.out(2)'`
- Fill from outline → filled (`★`) on hover

### Pill Buttons ("About Me", "Visit Site")
```css
.btn-pill {
  background: var(--color-white);
  color: var(--color-black);
  border: 2px solid var(--color-black);
  border-radius: 999px;
  padding: 14px 40px;
  font-family: var(--font-ui);
  font-size: var(--text-ui);
  cursor: none; /* custom cursor takes over */
  transition: background 0.3s, color 0.3s, transform 0.3s;
}
.btn-pill:hover {
  background: var(--color-black);
  color: var(--color-white);
  transform: scale(1.04);
}
```

### Image Reveal on Hover (Project Cards)
Each project card has an `overflow: hidden` wrapper. On hover:
- Inner `<img>` scales from `scale(1)` to `scale(1.08)`, `duration: 0.6, ease: 'power2.out'`
- Creates a subtle "breathing" zoom without clipping

### Scroll Progress Indicator
A thin `2px` horizontal line at the very top of the viewport, `background: --color-black` on light sections, `--color-white` on dark sections. Its `scaleX` goes from 0→1 via ScrollTrigger `scrub: 0` (instant follow).

---

## 10. Performance & Accessibility

### Performance
- All images exported as WebP, max 1200px wide, compressed to <200kb each
- Fonts preloaded for Mighty Slab and Druk Wide only (heaviest visual impact)
- `will-change: transform` applied to animated elements only during animation, removed after (`onComplete`)
- `ScrollTrigger.normalizeScroll(true)` for consistent behavior across devices
- Respect `prefers-reduced-motion`: wrap all GSAP animations in a check
  ```js
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) { /* run animations */ }
  ```

### Accessibility
- All nav links are `<a>` tags with proper `href`
- Custom cursor falls back gracefully (cursor: auto) if JS is disabled
- Images have meaningful `alt` attributes
- Color contrast: black text on `#8388ff` passes WCAG AA (4.7:1)

---

## 11. Responsive Behavior

### Breakpoints
```css
/* Mobile-first. Breakpoints: */
--bp-sm:  480px;
--bp-md:  768px;
--bp-lg:  1024px;
--bp-xl:  1440px;
```

### Key Mobile Adjustments
- Hero name: font-size scales via `clamp()` — no override needed
- Section 2 (HELLO): single column, photos stack vertically, HELLO vertical text hides on mobile
- Projects section: single column card stack
- Services bento grid: 2-column on mobile, 3-column on desktop
- Gallery: horizontal scroll on mobile (`overflow-x: auto`, `-webkit-overflow-scrolling: touch`)
- All GSAP scroll animations: `scrub` values remain the same, `start` triggers adjusted to `'top 85%'` on mobile for earlier reveals

---

## 12. Vite Configuration

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        about: './about.html',
      },
    },
  },
});
```

---

## 13. Animation Timing Cheat Sheet

| Element | Type | Duration | Ease | Trigger |
|---|---|---|---|---|
| Loader chars | GSAP fromTo | 0.8s | power4.out | onLoad |
| Loader curtain wipe | GSAP to | 0.7s | power3.inOut | t=2.0s |
| Hero name chars | GSAP from | 1.0s | power4.out | after loader |
| Barba panel in | GSAP to | 0.6s | power3.inOut | link click |
| Barba panel out | GSAP to | 0.6s | power3.inOut | new page ready |
| Section headings | GSAP from | 0.8s | expo.out | scroll 75% |
| Photos | GSAP from | 0.7s | power3.out | scroll 75% |
| Statement words | GSAP scrub | — | linear | scroll pin |
| Stats count-up | GSAP to | 1.5s | power2.out | scroll 70% |
| Nav color swap | GSAP to | 0.3s | power2.out | section boundary |
| Cursor follow | GSAP to | 0.4s | power3.out | mousemove |
| Button hover | CSS transition | 0.3s | ease | hover |
| Photo hover | GSAP to | 0.35s | power2.out | hover |

---

## 14. Content Reference

### Home Page Copy
- Title: `EMMANUEL / OKAKA`
- Subtitle: `SOFTWARE ENGINEER & MOBILE DEVELOPER`
- Bio: `"I'm Emmanuel Okaka a software developer passionate about crafting meaningful and impactful services"`
- Hobbyist line: `"I like playing Games, designing and I also dwindle in music production too"`
- Stats: `2+ years of experience` · `4 completed projects` · `5+ clients worldwide`
- Statement: `I TURN / IDEAS / INTO / REALITY`
- Services: Web Development, Mobile Development, Flutter & Dart, React, Typescript, Front-end Design, Back-end development
- CTA: `"Get in Touch"`
- Social footer: GITHUB · EMAIL · INSTAGRAM · LINKEDIN

### About Page Copy
- Heading: `ABOUT / ME`
- Label: `WHO I AM`
- Bio P1: `"Software Engineer with over two years of hands-on experience designing and developing scalable software solutions. Strong focus on mobile and backend-driven systems. Proficient in Flutter, React, JavaScript, RESTful APIs, and object-oriented programming. Passionate about solving real-world problems through clean, maintainable, and performance-driven software solutions. My goal is always the same. Ship high-quality, impactful software."`
- Bio P2: `"I enjoy creating a lot, my hobbies are playing games and getting fly. My favorite game of all time is Legend of Zelda Breath of the Wild."`
- Education: `Second Class Upper Honors · Computer Science — Bsc. · Covenant University, Ogun State, Nigeria`
- Experience:
  - `DCP Intern · Dangote Cement plc · Feb 2020 – Present`
  - `Mobile Developer · Auto Safety Nigeria Imtd · April 2023 – June 2023`
  - `Software Developer Intern · Inmotion Software Hub · Mar 2024 – Sept 2024`
- Footer CTA: `"Let's build something Xtraordinary"`
