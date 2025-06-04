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
    const bodyRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    // const [sections, setSections] = useState<Element[]>([]);
    const [gsapRan, setGsapRan] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);



    useLayoutEffect(() => {
        const sections = gsap.utils.toArray(".about-section-container");
        const sectionCount = sections.length;
        const sectionsLess = sectionCount - 1;

        const animation = gsap.to(sections, {
            xPercent: -100 * sectionsLess,
            ease: 'none',
            scrollTrigger: {
                trigger: '#about-page', 
                pin: true,
                scrub: true,
                snap: 1 / sectionsLess,
                end: () => '+=' + (window.innerWidth * sections.length),
            }
        });

        ScrollTrigger.refresh(); 

        return () => animation.scrollTrigger?.kill();
    }, []);


    return (

        <div ref={pinRef} id="about-page">

            {/* Parallax Background */}
            <div className="parallax-bg"></div>

            {/* Content */}
            <div className="about-track">

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

        </div>

    );
}

