import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomCursor from './components/common/CustomCursor';
import Loader from './components/common/Loader';
import Hello from './components/sections/Hello';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const mainContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0, 0);

    lenis.stop();

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleLoaderComplete = () => {
    if (lenisRef.current) lenisRef.current.start();
    ScrollTrigger.refresh();
    setLoaderDone(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-white)', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      {!loaderDone && (
        <Loader onComplete={handleLoaderComplete} mainRef={mainContentRef} />
      )}
      {loaderDone && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: 60, height: '100%',
          backgroundColor: '#8388FF', zIndex: 9999,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <span style={{
            writingMode: 'vertical-rl', textOrientation: 'mixed',
            fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 900,
            color: 'var(--color-black)', letterSpacing: '0.15em'
          }}>
            E:O
          </span>
        </div>
      )}

      <CustomCursor />
      
      <main 
        ref={mainContentRef}
        style={{ 
          width: 'calc(100% - 60px)', 
          marginLeft: 60,
          minHeight: '100vh',
          backgroundColor: 'var(--color-white)',
          willChange: 'transform, width, margin-left'
        }}
      >
        <Hello />
      </main>
    </div>
  );
}
