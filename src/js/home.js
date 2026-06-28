/* ============================================
   HOME — Home page scroll animations
   ============================================ */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitTextIntoChars, prefersReduced } from "./main.js";

export function initHome() {
  const heroSection = document.querySelector(".hero");
  if (!heroSection) return;

  initHeroEntrance();
  initHeroParallax();
  initNameMagnetic();
}

// ---- Split subtitle into individual character spans ---- //
function splitSubtitleIntoChars(innerEl) {
  const text = innerEl.textContent.trim();
  innerEl.textContent = "";
  innerEl.setAttribute("aria-label", text);

  const chars = [];
  for (const char of text) {
    const span = document.createElement("span");
    span.className = "hero__subtitle-char";
    span.textContent = char === " " ? "\u00A0" : char;
    span.setAttribute("aria-hidden", "true");
    innerEl.appendChild(span);
    chars.push(span);
  }

  return chars;
}

// ---- Hero Section Entrance ---- //
function initHeroEntrance() {
  const nameLines = document.querySelectorAll(".hero__name-line");
  const subtitle = document.querySelector(".hero__subtitle");

  if (prefersReduced) {
    if (subtitle) gsap.set(subtitle, { opacity: 1 });
    return;
  }

  // Split name lines into chars
  const allChars = [];
  nameLines.forEach((line) => {
    const chars = splitTextIntoChars(line);
    allChars.push(...chars);
  });

  // Set initial states
  gsap.set(allChars, { y: 120, opacity: 0, rotateX: -20 });
  gsap.set(subtitle, { y: -20, opacity: 0 });

  // Entrance timeline
  const tl = gsap.timeline();

  tl.to(allChars, {
    y: 0,
    opacity: 1,
    rotateX: 0,
    stagger: 0.035,
    duration: 1.0,
    ease: "power4.out",
  });

  tl.to(
    subtitle,
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
    },
    "-=0.6"
  );
}

// ---- Hero Scroll: Pin + Scrub Name to Center + Subtitle Dissolve/Reassemble ---- //
function initHeroParallax() {
  const hero = document.querySelector(".hero");
  const heroWrapper = document.querySelector(".hero-wrapper");
  const heroName = document.querySelector(".hero__name");
  const subtitle = document.querySelector(".hero__subtitle");
  const subtitleInner = document.querySelector(".hero__subtitle-inner");

  if (!hero || !heroName || !heroWrapper || !subtitleInner || prefersReduced) return;

  // Split subtitle text into individual character spans
  const subtitleChars = splitSubtitleIntoChars(subtitleInner);

  // ---- Compute the final Y delta for the subtitle ---- //
  // Uses static CSS values — no getBoundingClientRect — to avoid feedback loops
  const getSubtitleDelta = () => {
    const vh = window.innerHeight;
    const nameH = heroName.offsetHeight;

    // Scaled name bottom edge when centered
    const scaledNameBottom = (vh / 2) + ((nameH * 1.5) / 2);

    // Target: 16px below the scaled name bottom
    const targetSubtitleTop = scaledNameBottom + 16;

    // Subtitle's initial CSS top position
    const initialSubtitleTop = parseFloat(getComputedStyle(subtitle).top) || 80;

    return targetSubtitleTop - initialSubtitleTop;
  };

  // Pin the hero section
  ScrollTrigger.create({
    trigger: heroWrapper,
    start: "top top",
    end: "bottom bottom",
    pin: hero,
    pinSpacing: false,
  });

  // ---- Master Scroll Timeline ---- //
  // A single timeline handles all animations in perfect synchronization across the entire scroll
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: heroWrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      invalidateOnRefresh: true,
    },
  });

  // 1. NAME: Center name & scale up (runs 0% -> 100%)
  mainTl.to(heroName, {
    scale: 1.5,
    y: () => {
      const vh = window.innerHeight;
      const nameH = heroName.offsetHeight;
      const bottomOffset = parseFloat(getComputedStyle(heroName).bottom) || 64;
      const currentTop = vh - nameH - bottomOffset;
      const targetTop = (vh - nameH) / 2;
      return -(currentTop - targetTop);
    },
    transformOrigin: "center center",
    duration: 1.0,
  }, 0);

  // 2. SUBTITLE Y: Shift subtitle downward (runs 0% -> 100% in lockstep with the name)
  mainTl.to(subtitle, {
    y: () => getSubtitleDelta(),
    duration: 1.0,
  }, 0);

  // 3. PHASE 1: Dissolve chars (runs 0% -> 30%)
  // Starts immediately on scroll, completed by 30% of scroll
  mainTl.to(subtitleChars, {
    opacity: 0,
    filter: "blur(8px)",
    y: () => gsap.utils.random(-15, 15),
    x: () => gsap.utils.random(-8, 8),
    scale: 0.6,
    stagger: {
      each: 0.005,
      from: "center",
    },
    ease: "power2.in",
    duration: 0.3,
  }, 0);

  // 4. PHASE 2: Reassemble chars (runs 30% -> 60%)
  // Completely reassembled with full opacity and zero blur by 60% of scroll
  mainTl.to(subtitleChars, {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    x: 0,
    scale: 1,
    stagger: {
      each: 0.006,
      from: "edges",
    },
    ease: "back.out(1.7)",
    duration: 0.3,
  }, 0.3);

  // 5. PHASE 3: Underline Draw (runs 60% -> 85%)
  // Draws the underline left-to-right via CSS custom property
  const underlineObj = { progress: 0 };
  mainTl.to(underlineObj, {
    progress: 1,
    duration: 0.25,
    onUpdate: () => {
      subtitleInner.style.setProperty("--ul-progress", underlineObj.progress);
    },
  }, 0.6);
}

// ---- Magnetic Letter Repulsion on Hero Name ---- //
function initNameMagnetic() {
  const heroName = document.querySelector(".hero__name");
  if (!heroName || prefersReduced) return;

  // Grab all character spans created by splitTextIntoChars during entrance
  const charSpans = heroName.querySelectorAll(".hero__name-line span");
  if (!charSpans.length) return;

  // Configuration
  const RADIUS = 120;        // Influence radius in pixels
  const MAX_PUSH = 25;       // Max displacement in pixels
  const MOVE_DURATION = 0.3; // How fast chars react to the cursor
  const SNAP_DURATION = 0.6; // How fast chars return when cursor leaves

  const handleMouseMove = (e) => {
    const nameRect = heroName.getBoundingClientRect();

    charSpans.forEach((span) => {
      const rect = span.getBoundingClientRect();

      // Center of the character
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      // Vector from cursor to character center
      const dx = charCenterX - e.clientX;
      const dy = charCenterY - e.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < RADIUS) {
        // Strength falls off with distance (1 at cursor, 0 at edge of radius)
        const strength = 1 - (distance / RADIUS);
        // Eased strength for a more natural feel
        const easedStrength = strength * strength;

        // Normalize the direction vector and apply push
        const angle = Math.atan2(dy, dx);
        const pushX = Math.cos(angle) * MAX_PUSH * easedStrength;
        const pushY = Math.sin(angle) * MAX_PUSH * easedStrength;

        gsap.to(span, {
          x: pushX,
          y: pushY,
          duration: MOVE_DURATION,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        // Outside radius — gently return to origin
        gsap.to(span, {
          x: 0,
          y: 0,
          duration: SNAP_DURATION,
          ease: "elastic.out(1, 0.3)",
          overwrite: "auto",
        });
      }
    });
  };

  const handleMouseLeave = () => {
    // Snap all characters back with a satisfying elastic bounce
    charSpans.forEach((span, i) => {
      gsap.to(span, {
        x: 0,
        y: 0,
        duration: SNAP_DURATION,
        ease: "elastic.out(1, 0.3)",
        delay: i * 0.008, // Tiny stagger for a ripple feel
        overwrite: "auto",
      });
    });
  };

  heroName.addEventListener("mousemove", handleMouseMove);
  heroName.addEventListener("mouseleave", handleMouseLeave);
}
