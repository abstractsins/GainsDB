"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import About1 from "@/components/about/About1";
import About2 from "@/components/about/About2";
import About3 from "@/components/about/About3";
import About4 from "@/components/about/About4";
import About5 from "@/components/about/About5";
import RightArrows from "@/components/about/RightArrows";
import LeftArrows from "@/components/about/LeftArrows";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const [width, setWidth] = useState<number>(0);
    const pinRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);


    //* ─────────────────────────────────────────
    //* 🌀 Scroll-triggered animation
    //* ─────────────────────────────────────────
    useLayoutEffect(() => {
        const parallaxElement = document.querySelector(".parallax-bg") as HTMLElement;
        const sections = gsap.utils.toArray(".about-section-container");
        const sectionCount = sections.length;
        const sectionsLess = sectionCount - 1;

        const slidesShow = gsap.to(sections, {
            xPercent: -100 * sectionsLess,
            ease: "none",
            scrollTrigger: {
                trigger: pinRef.current,
                pin: true,
                scrub: true,
                snap: 1 / sectionsLess,
                end: () => '+=' + (window.innerWidth * sections.length),
                onUpdate: (self) => {
                    if (parallaxElement) {
                        console.log(self.progress);
                        const parallaxOffset = self.progress * -35; // tweak this for speed
                        parallaxElement.style.transform = `translateX(${parallaxOffset}vw)`;
                    }
                }
            }
        });

        ScrollTrigger.refresh();

        return () => {
            slidesShow.scrollTrigger?.kill();
            ScrollTrigger.getAll().forEach(st => st.kill()); 
        };

    }, []);


    //* ─────────────────────────────────
    //* 🔁 Arrow signal timeline
    //* ─────────────────────────────────
    useEffect(() => {
        const leftArrows = gsap.timeline({ repeat: -1 });
        const rightArrows = gsap.timeline({ repeat: -1 });

        leftArrows
            .to('#nav-signal-line-left-1', {
                x: '-50px',
                duration: 1.5,
                ease: "power3.inOut",
                opacity: 0
            })
            .to('#nav-signal-line-left-2', {
                x: '-100px',
                duration: 1.5,
                ease: "power3.inOut",
                opacity: 0
            }, '<');

        rightArrows
            .to('#nav-signal-line-right-1', {
                x: '50px',
                duration: 1.5,
                ease: "power3.inOut",
                opacity: 0
            })
            .to('#nav-signal-line-right-2', {
                x: '100px',
                duration: 1.5,
                ease: "power3.inOut",
                opacity: 0
            }, '<');

    }, []);


    //* ──────────────────────────────
    //* ⌨️ Keyboard remapping
    //* ──────────────────────────────
    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                window.scrollBy({ top: 100, behavior: 'smooth' });
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                window.scrollBy({ top: -100, behavior: 'smooth' });
            }
        };

        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, []);


    return (

        <div ref={pinRef} id="about-page">

            {/* Parallax Background */}
            <div className="parallax-bg"></div>

            {/* Content */}
            <div ref={trackRef} className="about-track">

                <div className='about-section-container' id="about-section-container-1">
                    <About1 isMobile={isMobile} width={width} />
                    <RightArrows />
                </div>

                <div className='about-section-container' id="about-section-container-2">
                    <About2 isMobile={isMobile} width={width} />
                </div>

                <div className='about-section-container' id="about-section-container-3">
                    <About3 isMobile={isMobile} width={width} />
                </div>

                <div className='about-section-container' id="about-section-container-4">
                    <About4 isMobile={isMobile} width={width} />
                </div>

                <div className='about-section-container' id="about-section-container-5">
                    <LeftArrows />
                    <About5 isMobile={isMobile} width={width} />
                </div>

            </div>

            <div className="instruction">
                <span>Scroll to Explore</span>
            </div>

        </div>

    );
}

