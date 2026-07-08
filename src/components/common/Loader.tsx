import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface LoaderProps {
  onComplete: () => void;
  mainRef: React.RefObject<HTMLElement | null>;
}

const SIDEBAR_W = 60;

export default function Loader({ onComplete, mainRef }: LoaderProps) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const devRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const introCompleteRef = useRef(false);
  const wipedRef = useRef(false);

  const eoLetters = ['E', ':', 'O'];
  const devWords = ['Software', 'Engineer', '&', 'Mobile', 'Developer'];
  const emmanuelLetters = ['E', 'M', 'M', 'A', 'N', 'U', 'E', 'L'];
  const okakaLetters = ['O', 'K', 'A', 'K', 'A'];

  /* ── squish wipe (The final scroll action) ─────────────────── */
  const triggerWipe = useCallback(() => {
    if (!introCompleteRef.current || wipedRef.current) return;
    wipedRef.current = true;
    gsap.killTweensOf('.scroll-arrow');

    const tl = gsap.timeline({ onComplete });
    const duration = 2; 
    const ease = 'power3.inOut';

    // slide out hero text + fade out hint
    tl.to(scrollHintRef.current, { opacity: 0, duration: 0.3 }, 0);
    
    // Slide text out to the left instead of fading
    tl.to('.dev-word, .emmanuel-letter, .okaka-letter', {
      x: -window.innerWidth,
      duration: duration,
      ease: ease,
      stagger: 0.01
    }, 0);

    // squish loader width from 85vw to 60px
    tl.to(curtainRef.current, {
      width: SIDEBAR_W, duration, ease,
    }, 0);

    // slide main content completely in
    if (mainRef.current) {
      tl.to(mainRef.current, {
        x: 0, duration, ease,
      }, 0);
      
      const otherElements = mainRef.current.querySelectorAll('.hello-section__photo, .hello-section__bio, .hello-section__lower, .hello-section__cta');
      if (otherElements.length) {
        gsap.fromTo(otherElements, 
          { x: '10vw' }, 
          { x: 0, duration: duration, stagger: 0.08, ease }
        );
      }
    }

    // fade in sidebar E:O
    tl.to(sidebarRef.current, {
      opacity: 1, duration: 0.6, ease: 'power2.out',
    }, duration - 0.4);
  }, [onComplete, mainRef]);

  /* ── scroll / touch listeners ───────────────────────────── */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 0) triggerWipe(); };
    let tY = 0;
    const onTS = (e: TouchEvent) => { tY = e.touches[0].clientY; };
    const onTM = (e: TouchEvent) => { if (e.touches[0].clientY < tY - 12) triggerWipe(); };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTS, { passive: true });
    window.addEventListener('touchmove', onTM, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTS);
      window.removeEventListener('touchmove', onTM);
    };
  }, [triggerWipe]);

  /* ── intro animation ────────────────────────────────────── */
  useGSAP(() => {
    if (!curtainRef.current) return;

    if (mainRef.current) {
      // 1. Initial State: Loader is 100vw, main is completely off-screen.
      // Left edge of main is shifted 100vw - 60px to push it right to the screen edge.
      gsap.set(mainRef.current, { x: 'calc(100vw - 60px)' });
    }

    gsap.set(scrollHintRef.current, { y: '110%' });
    gsap.set(sidebarRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        // Arm the scroll listeners only after everything, including the peek, is done
        introCompleteRef.current = true;
      },
    });

    tl.set('.eo-letter', { y: '100vh' })
      .set('.dev-word', { y: '100vh' })
      .set('.emmanuel-letter', { y: '100vh' })
      .set('.okaka-letter', { y: '100vh' });

    // E:O enters, holds, exits upward
    tl.to('.eo-letter', { y: '0%', duration: 0.8, stagger: 0.15, ease: 'power4.out' })
      .to('.eo-letter', { y: '-100vh', duration: 0.7, stagger: 0.1, ease: 'power4.in' }, '+=0.1');

    // Software Engineer enters
    tl.to('.dev-word', { y: '0%', duration: 0.7, stagger: 0.08, ease: 'power4.out' });

    // Assembly: EMMANUEL + OKAKA enter, dev text docks below
    tl.addLabel('assembly', '+=0.3');
    tl.to('.emmanuel-letter', { y: '0%', duration: 1.0, stagger: 0.06, ease: 'power4.out' }, 'assembly');
    tl.to('.okaka-letter', { y: '0%', duration: 1.0, stagger: 0.06, ease: 'power4.out' }, 'assembly+=0.4');

    const nameHeight = nameRef.current?.querySelector('h1')?.getBoundingClientRect().height || 200;
    const slideOffset = (nameHeight / 2) + 40;
    tl.to(devRef.current, { y: slideOffset, duration: 1.0, ease: 'power4.out' }, 'assembly');

    // 2. The Peek: After the assembly holds for a moment, slide the curtain to 85vw
    // to reveal the peeking "HELLO!" section.
    tl.addLabel('peek', '+=0');
    tl.to(curtainRef.current, { width: '85vw', duration: 0.5, ease: 'power3.inOut' }, 'peek');
    
    if (mainRef.current) {
      tl.to(mainRef.current, { x: 'calc(85vw - 60px)', duration: 2, ease: 'power3.inOut' }, 'peek');
    }

    // Bring up the scroll hint at the same time
    tl.to(scrollHintRef.current, { y: '0%', duration: 0.75, ease: 'power3.out' }, 'peek+=0.4');
    tl.add(() => {
      gsap.to('.scroll-arrow', { y: 4, repeat: -1, yoyo: true, duration: 0.85, ease: 'power1.inOut' });
    }, 'peek+=1.0');

  }, { scope: curtainRef });

  return (
    <div
      ref={curtainRef}
      style={{
        position: 'fixed', left: 0, top: 0,
        width: '100vw', height: '100vh',
        backgroundColor: '#8388FF', zIndex: 9999,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        overflow: 'hidden',
        color: 'var(--color-black)', userSelect: 'none',
        willChange: 'transform, width',
      }}
    >
      {/* E:O Layer */}
      <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', gap: 'clamp(5px, 1vw, 15px)' }}>
          {eoLetters.map((c, i) => (
            <span key={i} className="eo-letter" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 10vw, 120px)', fontWeight: 900, color: 'var(--color-black)', lineHeight: 1, display: 'inline-block', willChange: 'transform' }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Software Engineer Layer */}
      <div ref={devRef} style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', pointerEvents: 'none', padding: '0 20px', willChange: 'transform' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(8px, 1.5vw, 20px)' }}>
          {devWords.map((w, i) => (
            <span key={i} className="dev-word" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(18px, 3vw, 36px)', fontWeight: 700, color: 'var(--color-black)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block', willChange: 'transform' }}>{w}</span>
          ))}
        </div>
      </div>

      {/* EMMANUEL OKAKA Layer */}
      <div ref={nameRef} style={{ position: 'absolute', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', pointerEvents: 'none', padding: '0 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 11vw, 160px)', fontWeight: 900, lineHeight: 0.85, color: 'var(--color-black)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0, userSelect: 'none' }}>
          <span style={{ overflow: 'hidden', display: 'flex', gap: 'clamp(2px, 0.5vw, 6px)', padding: '10px 0' }}>
            {emmanuelLetters.map((c, i) => (
              <span key={i} className="emmanuel-letter" style={{ display: 'inline-block', willChange: 'transform' }}>{c}</span>
            ))}
          </span>
          <span style={{ overflow: 'hidden', display: 'flex', gap: 'clamp(2px, 0.5vw, 6px)', padding: '10px 0' }}>
            {okakaLetters.map((c, i) => (
              <span key={i} className="okaka-letter" style={{ display: 'inline-block', willChange: 'transform' }}>{c}</span>
            ))}
          </span>
        </h1>
      </div>

      {/* Scroll hint (bottom-right of the container) */}
      <div style={{ position: 'absolute', bottom: 'clamp(32px, 5vw, 64px)', right: 'clamp(32px, 5vw, 64px)', overflow: 'hidden', padding: '4px 0', width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: 'clamp(32px, 5vw, 64px)', pointerEvents: 'none' }}>
        <div ref={scrollHintRef} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-black)', opacity: 0.5, willChange: 'transform' }}>
          <span>Scroll to enter</span>
          <span className="scroll-arrow" style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4.5" y1="1" x2="4.5" y2="8" /><polyline points="2,6 4.5,8 7,6" />
            </svg>
          </span>
        </div>
      </div>

      {/* Sidebar content (hidden until squish completes) */}
      <div ref={sidebarRef} style={{ position: 'absolute', top: 0, left: 0, width: SIDEBAR_W, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0, pointerEvents: 'none' }}>
        <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 900, color: 'var(--color-black)', letterSpacing: '0.15em' }}>
          E:O
        </span>
      </div>
    </div>
  );
}
