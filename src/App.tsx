import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomCursor from './components/common/CustomCursor';
import Hero from './components/sections/Hero';
import Hello from './components/sections/Hello';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-white)', minHeight: '100vh', width: '100%' }}>
      <CustomCursor />
      <main style={{ width: '100%', overflow: 'hidden', backgroundColor: 'var(--color-white)' }}>
        <Hero />
        <Hello />
      </main>
    </div>
  );
}
