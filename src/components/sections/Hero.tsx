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
  const finalGroupRef = useRef<HTMLDivElement>(null);

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

    tl.set('.eo-letter', { y: '100vh' })
      .set('.dev-word', { y: '100vh' })
      .set('.emmanuel-letter', { y: '100vh' })
      .set('.okaka-letter', { y: '100vh' })
      .set('.final-subtext', { y: '100vh' });

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

    tl.to('.dev-word', {
      y: '0%',
      duration: 0.8,
      stagger: 0.08,
      ease: 'power4.out',
    })
    .to('.dev-word', {
      y: '-100vh',
      duration: 0.8,
      stagger: 0.08,
      ease: 'power4.in',
    }, '+=0.6');

    tl.to('.emmanuel-letter', {
      y: '0%',
      duration: 1.0,
      stagger: 0.06,
      ease: 'power4.out',
    })
    .to('.okaka-letter', {
      y: '0%',
      duration: 1.0,
      stagger: 0.06,
      ease: 'power4.out',
    }, '-=0.6')
    .to('.final-subtext', {
      y: '0%',
      duration: 1.0,
      ease: 'power4.out',
    }, '-=0.6');

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
        <div
          ref={eoRef}
          style={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
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

        <div
          ref={devRef}
          style={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            padding: '0 20px',
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

        <div
          ref={finalGroupRef}
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(20px, 4vw, 40px)',
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

          <div style={{ overflow: 'hidden', padding: '4px 0' }}>
            <div
              className="final-subtext"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(14px, 2vw, 24px)',
                color: 'var(--color-black)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 700,
                textAlign: 'center',
                willChange: 'transform',
              }}
            >
              Software Engineer & Mobile Developer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
