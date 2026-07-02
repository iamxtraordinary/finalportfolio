/* ============================================
   ABOUT — Section 2 (HELLO) scroll animations
   ============================================ */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced } from "./main.js";

export function initAbout() {
  const helloSection = document.querySelector(".hello-section");
  if (!helloSection) return;

  if (prefersReduced) {
    // Reveal everything instantly if reduced motion is preferred
    gsap.set([
      ".hello-section__photo",
      ".hello-section__bio",
      ".hello-section__hobbyist",
      ".hello-section__stats",
      ".hello-section__cta"
    ], { opacity: 1, x: 0, y: 0 });

    // Set stats directly to targets
    const statNums = helloSection.querySelectorAll(".stat-item__num");
    statNums.forEach((el) => {
      const target = el.getAttribute("data-target") || "0";
      const suffix = el.getAttribute("data-suffix") || "";
      el.textContent = target + suffix;
    });
    return;
  }

  const isMobile = window.innerWidth <= 768;
  const startTrigger = isMobile ? "top 85%" : "top 80%";

  // 1. "HELLO!" Vertical Background Text Parallax
  const helloText = helloSection.querySelector(".hello-section__hello-text");
  if (helloText && !isMobile) {
    ScrollTrigger.create({
      trigger: helloSection,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5,
      animation: gsap.fromTo(helloText, { yPercent: 5 }, { yPercent: -5, ease: "none" })
    });
  }

  // 2. Photo 1 (Classic Car) slide in from left
  const photoCar = helloSection.querySelector(".hello-section__photo--car");
  if (photoCar) {
    gsap.from(photoCar, {
      scrollTrigger: {
        trigger: helloSection,
        start: startTrigger,
        end: "top 30%",
        scrub: 1,
      },
      x: -80,
      opacity: 0,
      ease: "power2.out",
    });
  }

  // 3. Photo 2 (Selfie) slide in from right
  const photoSelfie = helloSection.querySelector(".hello-section__photo--selfie");
  if (photoSelfie) {
    gsap.from(photoSelfie, {
      scrollTrigger: {
        trigger: helloSection,
        start: startTrigger,
        end: "top 30%",
        scrub: 1,
      },
      x: 80,
      opacity: 0,
      ease: "power2.out",
    });
  }

  // 4. Stats Count-Up Animation
  const statNums = helloSection.querySelectorAll(".stat-item__num");
  statNums.forEach((el) => {
    const target = parseFloat(el.getAttribute("data-target")) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const counterObj = { value: 0 };

    gsap.to(counterObj, {
      scrollTrigger: {
        trigger: helloSection,
        start: startTrigger,
        once: true,
      },
      value: target,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = Math.round(counterObj.value) + suffix;
      },
    });
  });

  // 5. Bio Text, Hobbyist & Bottom Items Fade Up Stagger
  const bio = helloSection.querySelector(".hello-section__bio");
  const hobbyist = helloSection.querySelector(".hello-section__hobbyist");
  const cta = helloSection.querySelector(".hello-section__cta");

  gsap.from([bio, hobbyist, cta].filter(Boolean), {
    scrollTrigger: {
      trigger: helloSection,
      start: startTrigger,
      toggleActions: "play none none none",
    },
    y: 30,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: "power3.out",
  });
}
