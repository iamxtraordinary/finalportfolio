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
}

// ---- Hero Section Entrance ---- //
function initHeroEntrance() {
  const nameLines = document.querySelectorAll(".hero__name-line");
  const subtitle = document.querySelector(".hero__subtitle");

  if (prefersReduced) {
    // Just make everything visible immediately
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

  // Chars reveal with 3D tilt
  tl.to(allChars, {
    y: 0,
    opacity: 1,
    rotateX: 0,
    stagger: 0.035,
    duration: 1.0,
    ease: "power4.out",
  });

  // Subtitle fades in
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

// ---- Hero Scroll: Pin + Scrub Name to Center ---- //
function initHeroParallax() {
  const hero = document.querySelector(".hero");
  const heroWrapper = document.querySelector(".hero-wrapper");
  const heroName = document.querySelector(".hero__name");
  const subtitle = document.querySelector(".hero__subtitle");

  if (!hero || !heroName || !heroWrapper || prefersReduced) return;

  // Pin the hero section while we scroll through the wrapper
  ScrollTrigger.create({
    trigger: heroWrapper,
    start: "top top",
    end: "bottom bottom",
    pin: hero,
    pinSpacing: false,
  });

  // Scrub the name from its CSS bottom position to vertical center and scale up.
  gsap.to(heroName, {
    scale: 1.5,
    y: () => {
      const vh = window.innerHeight;
      const nameH = heroName.offsetHeight;
      const bottomOffset = parseFloat(getComputedStyle(heroName).bottom) || 64;

      // Where the name currently sits (from top of hero)
      const currentTop = vh - nameH - bottomOffset;
      // Where we want it (vertically centered)
      const targetTop = (vh - nameH) / 2;

      return -(currentTop - targetTop);
    },
    transformOrigin: "center center",
    scrollTrigger: {
      trigger: heroWrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      invalidateOnRefresh: true, // recalculate on resize
    },
  });

  // Scrub the subtitle down to sit directly below the centered, scaled name
  gsap.to(subtitle, {
    y: () => {
      const vh = window.innerHeight;
      const nameH = heroName.offsetHeight;

      // Bottom of the scaled-up name when centered (matching scale: 1.5)
      const scaledNameBottom = (vh / 2) + ((nameH * 1.5) / 2);

      // Target position for subtitle (directly below name with tight 12px gap)
      const targetSubtitleTop = scaledNameBottom + 12;

      // Current initial top position of subtitle
      const currentSubtitleTop = subtitle.getBoundingClientRect().top - hero.getBoundingClientRect().top;

      return targetSubtitleTop - currentSubtitleTop;
    },
    scrollTrigger: {
      trigger: heroWrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      invalidateOnRefresh: true, // recalculate on resize
    },
  });
}
