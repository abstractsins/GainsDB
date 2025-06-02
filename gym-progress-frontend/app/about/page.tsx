"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { gsap, snap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import About1 from "../../components/about/About1";
import About2 from "../../components/about/About2";
import About3 from "../../components/about/About3";
import About4 from "../../components/about/About4";
import About5 from "../../components/about/About5";
import { start } from "repl";

gsap.registerPlugin(ScrollTrigger);

const handleWheel = (e: React.WheelEvent) => {
    console.log("wheel deltaY:", e.deltaY);
}


export default function About() {
    const [width, setWidth] = useState<number>(0);
    const pinRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    // const [sections, setSections] = useState<Element[]>([]);
    const [gsapRan, setGsapRan] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);


    // useLayoutEffect(() => {
    //     if (!pinRef.current || !trackRef.current) {
    //         console.warn("⛔ Missing ref");
    //         return;
    //     }


    //     const sections = Array.from(trackRef.current.children);
    //     const sectionCount = sections.length;
    //     console.log(sections);

    //     // const totalScrollDistance = 100 * (sectionCount - 1); // for xPercent

    //     const timeline = gsap.timeline({
    //         scrollTrigger: {
    //             trigger: pinRef.current,
    //             start: "top top",
    //             end: `+=${window.innerWidth * (sectionCount - 1)}`,
    //             scrub: 1,
    //             pin: true,
    //             anticipatePin: 1,
    //             snap: {
    //                 snapTo: 1 / (sectionCount - 1),
    //                 duration: 0.4,
    //                 ease: "power1.inOut",
    //             },
    //             markers: true,
    //             onUpdate: (self) => {
    //                 const moveAmount = -self.progress * 50;
    //                 gsap.set(".parallax-bg", {
    //                     backgroundPositionX: `${moveAmount * 5}vw`,
    //                 });
    //             },
    //         }
    //     });

    //     timeline.to(trackRef.current, {
    //         xPercent: -100 * (sectionCount - 1), // 👈 key fix
    //         duration: 1,
    //         ease: "none",
    //     });


    //     ScrollTrigger.refresh();


    //     return () => {
    //         timeline.scrollTrigger?.kill();
    //         timeline.kill();
    //     };

    // }, []);

    useLayoutEffect(() => {
        if (!pinRef.current || !trackRef.current) {
            console.warn("⛔ Missing ref");
            return;
        }

        const sections = gsap.utils.toArray(".panel");
        const sectionCount = sections.length;

        const totalScroll = trackRef.current.scrollWidth + window.innerWidth;   // full width of the track (incl. padding)

        // gsap.to(sections, {
        //     xPercent: -100 * (sectionCount - 1),
        //     ease: "none",
        //     scrollTrigger: {
        //         trigger: "#about-page",
        //         pin: true,
        //         scrub: 1,
        //         snap: 1 / (sectionCount - 1),
        //         end: () => `+=${totalScroll}`,
        //         // end: () => "+=" + document.querySelector('.about-track')?.scrollWidth,
        //         // onToggle: (self) => console.log("update", self.progress.toFixed(7))
        //     },
        // })



    }, []);

    useEffect(() => {

        // gsap.to(".panel", {
        //     scrollTrigger: {
        //         trigger: ".panel.p1",
        //         toggleActions: "restart restart"
        //     },
        //     // start: "top 50vh",
        //     // x: -720,
        //     rotation: 45,
        //     duration: 1
        // }).then(() => {
        //     gsap.to(".panel", {
        //         scrollTrigger: "#about-page",
        //         // x: -720,
        //         rotation: -45,
        //         duration: 1
        //     });
        // });
    }, [])



    return (
        // <div className="pin-container">

        <div ref={pinRef} id="about-page">

            {/* Parallax Background */}
            <div className="parallax-bg"></div>

            {/* <div className="about-body" ref={bodyRef} > */}
            {/* Content */}
            <div className="about-track" ref={trackRef}>

                <About1 isMobile={isMobile} width={width} />
                <About2 isMobile={isMobile} width={width} />
                <About3 isMobile={isMobile} width={width} />
                <About4 isMobile={isMobile} width={width} />
                <About5 isMobile={isMobile} width={width} />

            </div>
            {/* </div> */}
        </div>
        // </div>

    );
}

