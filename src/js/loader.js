/* ============================================
   LOADER — Shuffle text reveal animation
   Vanilla JS port of the React Bits Shuffle component
   ============================================ */

import gsap from "gsap";
import { splitTextIntoChars, prefersReduced } from "./main.js";

// ---- Shuffle Engine ---- //
// Creates a slot-machine style character reveal for a given element
function createShuffle(element, {
  direction = "down",
  duration = 0.35,
  ease = "power3.out",
  shuffleTimes = 1,
  stagger = 0.03,
  scrambleCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*",
} = {}) {
  const chars = splitTextIntoChars(element);
  if (!chars.length) return { timeline: gsap.timeline(), wrappers: [] };

  const isVertical = direction === "up" || direction === "down";
  const wrappers = [];

  // Measure each character, build the strip
  chars.forEach((charEl) => {
    const rect = charEl.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (!w) return;

    // 1. Create the clipping wrapper (overflow: hidden)
    const clipWrap = document.createElement("span");
    clipWrap.className = "shuffle-clip";
    clipWrap.style.width = w + "px";
    if (isVertical) clipWrap.style.height = h + "px";

    // 2. Create the sliding inner strip
    const strip = document.createElement("span");
    strip.className = "shuffle-strip";
    if (isVertical) {
      strip.classList.add("shuffle-strip--vertical");
    }

    // 3. Insert clipWrap where charEl was
    charEl.parentNode.insertBefore(clipWrap, charEl);
    clipWrap.appendChild(strip);

    // 4. Build the strip: [scramble copies] + [real char]
    const rolls = Math.max(1, Math.floor(shuffleTimes));
    const rand = () => scrambleCharset.charAt(Math.floor(Math.random() * scrambleCharset.length));
    const computedFont = getComputedStyle(element).fontFamily;

    // First: a copy of the original (starting position)
    const firstCopy = charEl.cloneNode(true);
    firstCopy.className = isVertical ? "shuffle-cell shuffle-cell--block" : "shuffle-cell";
    firstCopy.style.width = w + "px";
    firstCopy.style.fontFamily = computedFont;
    strip.appendChild(firstCopy);

    // Scrambled intermediates
    for (let k = 0; k < rolls; k++) {
      const scramble = charEl.cloneNode(true);
      scramble.textContent = charEl.textContent.trim() === "" ? "\u00A0" : rand();
      scramble.className = isVertical ? "shuffle-cell shuffle-cell--block" : "shuffle-cell";
      scramble.style.width = w + "px";
      scramble.style.fontFamily = computedFont;
      strip.appendChild(scramble);
    }

    // The real character (final resting position)
    charEl.className = isVertical ? "shuffle-cell shuffle-cell--block" : "shuffle-cell";
    charEl.style.width = w + "px";
    charEl.style.fontFamily = computedFont;
    charEl.setAttribute("data-orig", "1");
    strip.appendChild(charEl);

    // 5. Calculate start/end positions
    const steps = rolls + 1; // total cells to slide past

    if (direction === "down") {
      // Strip starts offset upward, slides down to reveal final char
      const startY = -steps * h;
      gsap.set(strip, { y: startY });
      strip._shuffleFinalY = 0;
    } else if (direction === "up") {
      gsap.set(strip, { y: 0 });
      strip._shuffleFinalY = -steps * h;
    } else if (direction === "right") {
      const startX = -steps * w;
      gsap.set(strip, { x: startX });
      strip._shuffleFinalX = 0;
    } else if (direction === "left") {
      gsap.set(strip, { x: 0 });
      strip._shuffleFinalX = -steps * w;
    }

    wrappers.push({ clipWrap, strip });
  });

  // 6. Build the animation timeline
  const tl = gsap.timeline({ paused: true });
  const strips = wrappers.map((w) => w.strip);

  // Even/odd stagger pattern for a premium overlapping feel
  const oddStrips = strips.filter((_, i) => i % 2 === 1);
  const evenStrips = strips.filter((_, i) => i % 2 === 0);

  const buildTween = (targets, position) => {
    if (!targets.length) return;
    const vars = {
      duration,
      ease,
      force3D: true,
      stagger,
    };

    if (isVertical) {
      vars.y = (i, t) => t._shuffleFinalY;
    } else {
      vars.x = (i, t) => t._shuffleFinalX;
    }

    tl.to(targets, vars, position);
  };

  // Odd chars go first, even chars overlap at 70%
  const oddTotal = duration + Math.max(0, oddStrips.length - 1) * stagger;
  const evenStart = oddStrips.length ? oddTotal * 0.7 : 0;

  if (oddStrips.length) buildTween(oddStrips, 0);
  if (evenStrips.length) buildTween(evenStrips, evenStart);

  return { timeline: tl, wrappers };
}

// ---- Main Loader Export ---- //
export function initLoader(onComplete) {
  const loader = document.querySelector(".loader");
  if (!loader) {
    onComplete?.();
    return;
  }

  const nameLines = loader.querySelectorAll(".loader__name");
  const subtitle = loader.querySelector(".loader__subtitle");

  // If user prefers reduced motion, skip animations
  if (prefersReduced) {
    loader.style.display = "none";
    onComplete?.();
    return;
  }

  // Wait for fonts to be ready before measuring characters
  const fontsReady = document.fonts?.ready ?? Promise.resolve();

  fontsReady.then(() => {
    // Set initial states
    gsap.set(subtitle, { y: 20, opacity: 0 });

    // Build shuffles for each name line
    const shuffles = [];
    nameLines.forEach((line) => {
      const shuffle = createShuffle(line, {
        direction: "down",
        duration: 0.4,
        ease: "power3.out",
        shuffleTimes: 2,
        stagger: 0.04,
        scrambleCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*",
      });
      shuffles.push(shuffle);
    });

    // Master loader timeline
    const masterTl = gsap.timeline({
      delay: 0.3, // Brief pause before animation starts
      onComplete: () => {
        loader.classList.add("is-hidden");
        gsap.set(loader, { display: "none", delay: 0.1 });
        onComplete?.();
      },
    });

    // t=0s — Shuffle reveals for each name line (staggered)
    shuffles.forEach((shuffle, i) => {
      masterTl.add(shuffle.timeline.play(), i * 0.15);
    });

    // t=after shuffles — Subtitle fades in
    masterTl.to(
      subtitle,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.25"
    );

    // t=after subtitle — Brief brand hold
    masterTl.to({}, { duration: 0.4 });

    // t=final — Loader exits upward
    masterTl.to(loader, {
      y: "-100%",
      duration: 0.7,
      ease: "power3.inOut",
    });
  });
}
