/* ============================================
   MAIN.JS — Entry point
   Lenis, GSAP plugins, Barba, Custom Cursor
   ============================================ */

// CSS Imports
import "../css/reset.css";
import "../css/tokens.css";
import "../css/global.css";
import "../css/loader.css";
import "../css/nav.css";
import "../css/home.css";
import "../css/about.css";

// Dependencies
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import barba from "@barba/core";
import barbaPrefetch from "@barba/prefetch";

// Page modules
import { initLoader } from "./loader.js";
import { initHome } from "./home.js";
import { ClickSpark } from "./clickSpark.js";
// import { initAbout } from "./about.js";
// import { initTransitions } from "./transitions.js";

// ---- Register GSAP Plugins ---- //
gsap.registerPlugin(ScrollTrigger);

// ---- Lenis Smooth Scroll ---- //
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  smoothWheel: true,
});

// Sync Lenis to GSAP ticker for ScrollTrigger accuracy
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ---- Custom Cursor ---- //
function initCursor() {
  const cursor = document.querySelector(".cursor");
  if (!cursor) return;

  // Check for touch device
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const moveCursor = (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  // Hover targets — links, buttons, interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .btn-pill, [data-cursor="hover"]'
  );

  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () =>
      cursor.classList.add("is-hovering")
    );
    target.addEventListener("mouseleave", () =>
      cursor.classList.remove("is-hovering")
    );
  });

  // Press state
  document.addEventListener("mousedown", () =>
    cursor.classList.add("is-pressed")
  );
  document.addEventListener("mouseup", () =>
    cursor.classList.remove("is-pressed")
  );

  window.addEventListener("mousemove", moveCursor);
}

// ---- Scroll Progress Indicator ---- //
function initScrollProgress() {
  const progress = document.querySelector(".scroll-progress");
  if (!progress) return;

  ScrollTrigger.create({
    trigger: document.documentElement,
    start: "top top",
    end: "bottom bottom",
    scrub: 0,
    onUpdate: (self) => {
      gsap.set(progress, { scaleX: self.progress });
    },
  });
}

// ---- SplitText Utility (free alternative) ---- //
// Splits text into individual <span> wrapped characters
export function splitTextIntoChars(element) {
  const text = element.textContent;
  element.textContent = "";
  element.setAttribute("aria-label", text);

  const chars = [];
  for (const char of text) {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    span.setAttribute("aria-hidden", "true");
    element.appendChild(span);
    chars.push(span);
  }

  return chars;
}

// ---- Reduced Motion Check ---- //
export const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ---- Initialize ---- //
function init() {
  initCursor();
  initScrollProgress();
  new ClickSpark({ sparkSize: 12, sparkRadius: 20, sparkCount: 8, duration: 400 });

  // Always run loader on page refresh/load as requested
  initLoader(() => {
    initHome();
  });
}

// Wait for DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
