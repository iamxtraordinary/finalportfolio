import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const eoRef = useRef<HTMLDivElement>(null);
  const devRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  const eoLetters = ['E', ':', 'O'];
  const devWords = ['Software', 'Engineer', '&', 'Mobile', 'Developer'];
  const emmanuelLetters = ['E', 'M', 'M', 'A', 'N', 'U', 'E', 'L'];
  const okakaLetters = ['O', 'K', 'A', 'K', 'A'];

  useGSAP(() => {
    if (!containerRef.current || !stickyRef.current) return;

    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = 'auto';
      },
    });

    // Initial positions — everything off-screen below
    tl.set('.eo-letter', { y: '100vh' })
      .set('.dev-word', { y: '100vh' })
      .set('.emmanuel-letter', { y: '100vh' })
      .set('.okaka-letter', { y: '100vh' });

    // ─── E:O enters, holds, exits upward ───
    tl.to('.eo-letter', {
      y: '0%',
      duration: 0.8,
      stagger: 0.15,
      ease: 'power4.out',
    })
    .to('.eo-letter', {
      y: '-100vh',
      duration: 0.8,
      stagger: 0.1,
      ease: 'power4.in',
    }, '+=0.5');

    // ─── Phase 1: "Software Engineer & Mobile Developer" enters and HOLDS at center ───
    tl.to('.dev-word', {
      y: '0%',
      duration: 0.8,
      stagger: 0.08,
      ease: 'power4.out',
    });

    // ─── Phase 2: EMMANUEL OKAKA enters while dev text slides down to dock below ───
    tl.addLabel('assembly', '+=0.6');

    // EMMANUEL letters enter from below
    tl.to('.emmanuel-letter', {
      y: '0%',
      duration: 1.0,
      stagger: 0.06,
      ease: 'power4.out',
    }, 'assembly');

    // OKAKA letters enter from below (overlapping)
    tl.to('.okaka-letter', {
      y: '0%',
      duration: 1.0,
      stagger: 0.06,
      ease: 'power4.out',
    }, 'assembly+=0.4');

    // Simultaneously, dev text slides DOWN from center to dock below the name
    // Compute offset from actual name block height so subtext clears OKAKA
    const nameHeight = nameRef.current?.querySelector('h1')?.getBoundingClientRect().height || 200;
    const slideOffset = (nameHeight / 2) + 40; // half name height + gap

    tl.to(devRef.current, {
      y: slideOffset,
      duration: 1.0,
      ease: 'power4.out',
    }, 'assembly');

    // ─── ScrollTrigger: horizontal wipe on scroll ───
    gsap.to(stickyRef.current, {
      clipPath: 'inset(0 0 0 100%)',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '200vh',
        backgroundColor: 'var(--color-white)',
        zIndex: 10,
      }}
    >
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: '#8388FF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          clipPath: 'inset(0 0 0 0)',
          willChange: 'clip-path',
        }}
      >
        {/* ─── E:O Layer ─── */}
        <div
          ref={eoRef}
          style={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', gap: 'clamp(5px, 1vw, 15px)' }}>
            {eoLetters.map((char, i) => (
              <span
                key={i}
                className="eo-letter"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(40px, 10vw, 120px)',
                  fontWeight: 900,
                  color: 'var(--color-black)',
                  lineHeight: 1,
                  display: 'inline-block',
                  willChange: 'transform',
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* ─── Software Engineer Layer — starts centered, slides down to dock below name ─── */}
        <div
          ref={devRef}
          style={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            padding: '0 20px',
            willChange: 'transform',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(8px, 1.5vw, 20px)' }}>
            {devWords.map((word, i) => (
              <span
                key={i}
                className="dev-word"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(18px, 3vw, 36px)',
                  fontWeight: 700,
                  color: 'var(--color-black)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'inline-block',
                  willChange: 'transform',
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* ─── EMMANUEL OKAKA Layer — name only, no subtext ─── */}
        <div
          ref={nameRef}
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            padding: '0 20px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 11vw, 160px)',
              fontWeight: 900,
              lineHeight: 0.85,
              color: 'var(--color-black)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: 0,
              userSelect: 'none',
            }}
          >
            <span style={{ overflow: 'hidden', display: 'flex', gap: 'clamp(2px, 0.5vw, 6px)', padding: '10px 0' }}>
              {emmanuelLetters.map((char, i) => (
                <span
                  key={i}
                  className="emmanuel-letter"
                  style={{ display: 'inline-block', willChange: 'transform' }}
                >
                  {char}
                </span>
              ))}
            </span>
            <span style={{ overflow: 'hidden', display: 'flex', gap: 'clamp(2px, 0.5vw, 6px)', padding: '10px 0' }}>
              {okakaLetters.map((char, i) => (
                <span
                  key={i}
                  className="okaka-letter"
                  style={{ display: 'inline-block', willChange: 'transform' }}
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
