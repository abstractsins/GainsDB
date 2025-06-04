"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { gsap, snap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import About1 from "@/components/about/About1";
import About2 from "@/components/about/About2";
import About3 from "@/components/about/About3";
import About4 from "@/components/about/About4";
import About5 from "@/components/about/About5";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const [width, setWidth] = useState<number>(0);
    const pinRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);


    useLayoutEffect(() => {
        const sections = gsap.utils.toArray(".about-section-container");
        const sectionCount = sections.length;
        const sectionsLess = sectionCount - 1;

        const animation = gsap.to(sections, {
            xPercent: -100 * sectionsLess,
            ease: 'none',
            scrollTrigger: {
                trigger: pinRef.current,
                pin: true,
                scrub: true,
                snap: 1 / sectionsLess,
                end: () => '+=' + (window.innerWidth * sections.length),
                onUpdate: (self) => console.log(document.querySelector('.parallax-bg')),
            }
        });

        ScrollTrigger.refresh();

        return () => animation.scrollTrigger?.kill();
    }, []);


    useEffect(() => {
        const leftArrows = gsap.timeline({ repeat: -1 });

        leftArrows.to('#nav-signal-line-left-1', { x: '-50px', duration: 2, ease: "power2.inOut", delay: 0.25 })
            .to('#nav-signal-line-left-2', { x: '-100px', duration: 2, ease: "power2.inOut" }, '<')

    }, []);


    return (

        <div ref={pinRef} id="about-page">

            {/* Parallax Background */}
            <div className="parallax-bg"></div>

            <div className="nav-signal-container" id="nav-signal-container-left">
                <div className="nav-signal-line nav-signal-line-left" id="nav-signal-line-left-1"></div>
                <div className="nav-signal-line nav-signal-line-left" id="nav-signal-line-left-2"></div>
                <div className="nav-signal-line nav-signal-line-left" id="nav-signal-line-left-3"></div>
            </div>

            {/* Content */}
            <div ref={trackRef} className="about-track">

                <div className='about-section-container'>
                    <About1 isMobile={isMobile} width={width} />
                </div>

                <div className='about-section-container'>
                    <About2 isMobile={isMobile} width={width} />
                </div>

                <div className='about-section-container'>
                    <About3 isMobile={isMobile} width={width} />
                </div>

                <div className='about-section-container'>
                    <About4 isMobile={isMobile} width={width} />
                </div>

                <div className='about-section-container'>
                    <About5 isMobile={isMobile} width={width} />
                </div>

            </div>

            <div className="nav-signal-container" id="nav-signal-container-right">
                <div className="nav-signal-line nav-signal-line-right" id="nav-signal-line-right-1">a</div>
                <div className="nav-signal-line nav-signal-line-right" id="nav-signal-line-right-2">a</div>
                <div className="nav-signal-line nav-signal-line-right" id="nav-signal-line-right-3">a</div>
            </div>

        </div>

    );
}

