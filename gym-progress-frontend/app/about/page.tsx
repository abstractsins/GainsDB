"use client";

import { Oswald, Tourney, Roboto_Slab } from "next/font/google";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import About1 from "../../components/about/About1";
import About2 from "../../components/about/About1";
import About3 from "../../components/about/About1";
import About4 from "../../components/about/About1";
import About5 from "../../components/about/About1";

gsap.registerPlugin(ScrollTrigger);

const handleWheel = (e: React.WheelEvent) => {
    console.log("wheel deltaY:", e.deltaY);
}


export default function About() {
    const [width, setWidth] = useState<number>(0);
    const pinRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const [sections, setSections] = useState<Element[]>([]);
    const [gsapRan, setGsapRan] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);


    useLayoutEffect(() => {
        console.group('useLayoutEffect1');

        setWidth(window.innerWidth);

        const checkSections = () => {
            const foundSections = Array.from(document.querySelectorAll(".about-section"));
            console.log(foundSections);
            if (foundSections.length > 0) {
                setSections(foundSections);
            }
        };

        checkSections();

        if (sections.length === 0) return;
        if (gsapRan === true) return

        console.log('isMobile: ' + isMobile);

        const animations: gsap.core.Tween[] = [];
        const triggers: ScrollTrigger[] = [];

        if (!pinRef.current) {
            console.error("ScrollTrigger not initialized: pinRef is null");
            return;
        }

        if (isMobile === false) {
            const totalScrollDistance = 150 * (sections.length - 1);

            // Horizontal scrolling
            const animation = gsap.to(sections, {
                xPercent: -totalScrollDistance,
                ease: "none",
                scrollTrigger: {
                    start: 0,
                    trigger: pinRef.current,
                    pin: true,
                    // markers: true,
                    scrub: 2.5,
                    snap: 1 / (sections.length - 1),
                    end: "+=4000",
                    // end: `+=${document.body.querySelector('.about-track')?.scrollWidth}`,
                    invalidateOnRefresh: true
                },
            });

            animations.push(animation);

            // Parallax effect ScrollTrigger
            const parallaxTrigger = ScrollTrigger.create({
                trigger: pinRef.current,
                start: "top top",
                // end: `+=${totalScrollDistance * 15}`,
                end: `+=${document.body.querySelector('.about-track')?.scrollWidth}`,

                scrub: 1,
                pin: false,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const moveAmount = -progress * totalScrollDistance * 0.4;
                    console.log('moveAmount: ' + moveAmount);

                    gsap.set(".parallax-bg", { backgroundPositionX: `${moveAmount}vw` });
                }
            });
            triggers.push(parallaxTrigger);

        }

        setGsapRan(true);

        // one more safety refresh in case
        // ScrollTrigger.refresh();

        // clean up
        console.groupEnd();

        return () => ScrollTrigger.getAll().forEach(st => st.kill());

    }, []);


    return (

        <div
            ref={pinRef}
            id="about-page"
            onWheel={handleWheel}
        >

            {/* Parallax Background */}
            <div className="parallax-bg"></div>


            <div className="about-body" ref={bodyRef}>
                {/* Content */}
                <div className="about-track" >

                    <About1 isMobile={isMobile} width={width} />
                    <About2 isMobile={isMobile} width={width} />
                    <About3 isMobile={isMobile} width={width} />
                    <About4 isMobile={isMobile} width={width} />
                    <About5 isMobile={isMobile} width={width} />

                </div>
            </div>
        </div>

    );
}




/* 
 
   // ---------- refs & state ---------- //
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [panelCount] = useState(5);                // we know there are 5 <AboutX/>
    const [index, setIndex] = useState(0);           // current panel
    const isAnimating = useRef(false);               // guard against rapid wheel spam

   //  ---------- resize helper ---------- //
    const panelWidth = () => window.innerWidth;      // one panel == one viewport width

    //---------- wheel handler ---------- //
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const handleWheel = (e: WheelEvent) => {
            if (isAnimating.current) return;            // ignore while tween is running
            e.preventDefault();

            const dir = Math.sign(e.deltaY);            // 1 => down, -1 => up
            let newIndex = index + dir;
            newIndex = Math.max(0, Math.min(panelCount - 1, newIndex));
            if (newIndex === index) return;             // already at an edge

            isAnimating.current = true;
            gsap.to(track, {
                duration: 0.8,
                ease: "power2.out",
                scrollTo: { x: newIndex * panelWidth() },
                onComplete: () => {
                    isAnimating.current = false;
                    setIndex(newIndex);
                }
            });
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => window.removeEventListener("wheel", handleWheel);
    }, [index, panelCount]);

    // ---------- snap on window resize ---------- //
    useEffect(() => {
        const snapOnResize = () => {
            const track = trackRef.current;
            if (track) gsap.set(track, { scrollLeft: index * panelWidth() });
        };
        window.addEventListener("resize", snapOnResize);
        return () => window.removeEventListener("resize", snapOnResize);
    }, [index]);

 */