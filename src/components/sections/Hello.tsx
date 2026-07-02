import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import '../../css/about.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hello() {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    const isMobile = window.innerWidth <= 768;
    const startTrigger = isMobile ? 'top 85%' : 'top 80%';

    const helloText = el.querySelector('.hello-section__hello-text');
    if (helloText && !isMobile) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
        animation: gsap.fromTo(helloText, { yPercent: 5 }, { yPercent: -5, ease: 'none' }),
      });
    }

    const photoCar = el.querySelector('.hello-section__photo--car');
    if (photoCar) {
      gsap.from(photoCar, {
        scrollTrigger: {
          trigger: el,
          start: startTrigger,
          end: 'top 30%',
          scrub: 1,
        },
        x: -80,
        opacity: 0,
        ease: 'power2.out',
      });
    }

    const photoSelfie = el.querySelector('.hello-section__photo--selfie');
    if (photoSelfie) {
      gsap.from(photoSelfie, {
        scrollTrigger: {
          trigger: el,
          start: startTrigger,
          end: 'top 30%',
          scrub: 1,
        },
        x: 80,
        opacity: 0,
        ease: 'power2.out',
      });
    }

    const statNums = el.querySelectorAll('.stat-item__num');
    statNums.forEach((statEl) => {
      const target = parseFloat(statEl.getAttribute('data-target') || '0');
      const suffix = statEl.getAttribute('data-suffix') || '';
      const counterObj = { value: 0 };

      gsap.to(counterObj, {
        scrollTrigger: {
          trigger: el,
          start: startTrigger,
          once: true,
        },
        value: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          statEl.textContent = Math.round(counterObj.value) + suffix;
        },
      });
    });

    const bio = el.querySelector('.hello-section__bio');
    const hobbyist = el.querySelector('.hello-section__hobbyist');
    const cta = el.querySelector('.hello-section__cta');

    gsap.from([bio, hobbyist, cta].filter(Boolean), {
      scrollTrigger: {
        trigger: el,
        start: startTrigger,
        toggleActions: 'play none none none',
      },
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <section className="hello-section" id="hello" ref={containerRef}>
      <div className="hello-section__container">
        <div className="hello-section__main">
          <div className="hello-section__left-group">
            <div className="hello-section__hello-wrapper">
              <div className="hello-section__hello-text" aria-hidden="true">
                HELLO!
              </div>
            </div>
            <div className="hello-section__photo hello-section__photo--car">
              <img src="/src/assets/images/car.webp" alt="Classic car photo" width="400" height="500" loading="lazy" />
            </div>
          </div>

          <div className="hello-section__right-group">
            <div className="hello-section__bio">
              <p className="hello-section__bio-text">
                I'm Emmanuel Okaka a software developer passionate about crafting meaningful and impactful services
              </p>
            </div>
            <div className="hello-section__photo hello-section__photo--selfie">
              <img src="/src/assets/images/Me.webp" alt="Emmanuel Okaka selfie" width="400" height="500" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="hello-section__lower">
          <div className="hello-section__hobbyist">
            <p>
              I like playing Games ,<br />
              designing and i also<br />
              dwindle in music<br />
              production too
            </p>
          </div>

          <div className="hello-section__stats">
            <div className="stat-item">
              <div className="stat-item__num" data-target="2" data-suffix="+">
                0
              </div>
              <div className="stat-item__label">
                years of<br />
                experience
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-item__num" data-target="4" data-suffix="">
                0
              </div>
              <div className="stat-item__label">
                completed<br />
                projects
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-item__num" data-target="5" data-suffix="+">
                0
              </div>
              <div className="stat-item__label">
                clients<br />
                worldwide
              </div>
            </div>
          </div>
        </div>

        <div className="hello-section__bottom">
          <div className="hello-section__cta">
            <a href="#about" className="btn-pill" data-cursor="hover">
              About Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
