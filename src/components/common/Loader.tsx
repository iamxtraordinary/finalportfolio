import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const topSubtextRef = useRef<HTMLDivElement>(null);
  const emmanuelRef = useRef<HTMLDivElement>(null);
  const okakaRef = useRef<HTMLDivElement>(null);
  const bottomSubtextRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(true);

  useGSAP(() => {
    if (!curtainRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        onComplete();
      },
    });

    tl.set(topSubtextRef.current, { y: '100%' })
      .set(emmanuelRef.current, { y: '100%' })
      .set(okakaRef.current, { y: '100%' })
      .set(bottomSubtextRef.current, { y: '100%' });

    tl.to(topSubtextRef.current, {
      y: '0%',
      duration: 0.9,
      ease: 'power4.out',
    }, 0.3);

    tl.to(topSubtextRef.current, {
      opacity: 0,
      y: '-20%',
      duration: 0.6,
      ease: 'power2.inOut',
    }, 1.0);

    tl.to(emmanuelRef.current, {
      y: '0%',
      duration: 0.8,
      ease: 'power4.out',
    }, 1.0);

    tl.to(okakaRef.current, {
      y: '0%',
      duration: 0.8,
      ease: 'power4.out',
    }, 1.3);

    tl.to(bottomSubtextRef.current, {
      y: '0%',
      duration: 0.8,
      ease: 'power4.out',
    }, 1.6);

    tl.to(curtainRef.current, {
      clipPath: 'inset(0 0 0 100%)',
      duration: 1.0,
      ease: 'power4.inOut',
    }, 2.4);

  }, { scope: curtainRef });

  if (!isVisible) return null;

  return (
    <div
      ref={curtainRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: '#8388FF',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--color-black)',
        userSelect: 'none',
        clipPath: 'inset(0 0 0 0)',
        willChange: 'clip-path',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 'clamp(32px, 5vw, 64px)',
          left: 'clamp(32px, 5vw, 64px)',
          overflow: 'hidden',
          padding: '4px 0',
        }}
      >
        <div
          ref={topSubtextRef}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(16px, 2vw, 28px)',
            color: 'var(--color-black)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 700,
            willChange: 'transform, opacity',
          }}
        >
          Software Developer & Mobile Engineer
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(20px, 4vw, 40px)',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(50px, 13vw, 180px)',
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: '-0.03em',
            color: 'var(--color-black)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            margin: 0,
            userSelect: 'none',
          }}
        >
          <span style={{ overflow: 'hidden', display: 'inline-block', padding: '10px 0' }}>
            <span ref={emmanuelRef} style={{ display: 'inline-block', willChange: 'transform' }}>
              EMMANUEL
            </span>
          </span>
          <span style={{ overflow: 'hidden', display: 'inline-block', padding: '10px 0' }}>
            <span ref={okakaRef} style={{ display: 'inline-block', willChange: 'transform' }}>
              OKAKA
            </span>
          </span>
        </h1>

        <div style={{ overflow: 'hidden', padding: '4px 0' }}>
          <div
            ref={bottomSubtextRef}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(16px, 2vw, 28px)',
              color: 'var(--color-black)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 700,
              textAlign: 'center',
              willChange: 'transform',
            }}
          >
            Software Developer & Mobile Engineer
          </div>
        </div>
      </div>
    </div>
  );
}
