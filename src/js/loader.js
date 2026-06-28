/* ============================================
   LOADER — First-visit animation sequence
   ============================================ */

import gsap from "gsap";
import { splitTextIntoChars, prefersReduced } from "./main.js";

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

  // Split name text into chars
  const allChars = [];
  nameLines.forEach((line) => {
    const chars = splitTextIntoChars(line);
    allChars.push(...chars);
  });

  // Master timeline
  const tl = gsap.timeline({
    onComplete: () => {
      loader.classList.add("is-hidden");
      // Remove loader from DOM after transition
      gsap.set(loader, { display: "none", delay: 0.1 });
      onComplete?.();
    },
  });

  // Set initial states
  gsap.set(allChars, { y: 100, opacity: 0 });
  gsap.set(subtitle, { y: 20, opacity: 0 });

  // t=0.2s — Chars stagger in
  tl.to(allChars, {
    y: 0,
    opacity: 1,
    stagger: 0.04,
    duration: 0.8,
    ease: "power4.out",
    delay: 0.2,
  });

  // t=1.2s — Subtitle fades in
  tl.to(
    subtitle,
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
    },
    "-=0.2"
  );

  // t=1.8s — Brief brand hold
  tl.to({}, { duration: 0.3 });

  // t=2.0s — Loader exits upward
  tl.to(loader, {
    y: "-100%",
    duration: 0.7,
    ease: "power3.inOut",
  });
}
