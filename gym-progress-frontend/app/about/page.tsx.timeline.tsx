"use client";

import { Oswald, Tourney, Roboto_Slab } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tourney = Tourney({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const robotoSlab = Roboto_Slab({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export default function About() {
    const pinRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [width, setWidth] = useState(window.innerWidth);

    // Update mobile flag on resize
    useEffect(() => {
        const onResize = () => {
            setIsMobile(window.innerWidth <= 768);
            setWidth(window.innerWidth);
        }
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useLayoutEffect(() => {
        const pin = pinRef.current;
        const track = trackRef.current;
        const bg = bgRef.current;
        if (!pin || !track || !bg || isMobile) return;

        // Wait for fonts/images
        document.fonts.ready.then(() => {
            const totalWidth = track.scrollWidth - window.innerWidth;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: pin,
                    start: "top top",
                    end: () => `+=${track.scrollWidth}`,
                    scrub: true,
                    pin: true,
                    invalidateOnRefresh: true
                }
            });

            // horizontal slide
            tl.to(track, { x: -totalWidth, ease: "none" }, 0)
                // parallax background at 40% of movement
                .to(bg, { backgroundPositionX: `${-totalWidth * 0.4}vw`, ease: "none" }, 0);

            // ensure correct measurements on refresh
            ScrollTrigger.refresh();
        });

        return () => ScrollTrigger.getAll().forEach(st => st.kill());
    }, [isMobile]);

    return (
        <div ref={pinRef} id="about-page">
            <div ref={bgRef} className="parallax-bg" />
            <div className="about-body">
                <div className="about-track" ref={trackRef}>
                    <div id="p1" className="about-section">
                        <div className="left">
                            <p>
                                <span className="p-lead">This web application </span>is designed to help users log, visualize, and analyze their workout progress over time. The app provides an intuitive interface for tracking exercises, viewing interactive charts, and gaining insights into strength and endurance improvements.
                            </p>
                        </div>

                        <div className="right">
                            <ul className="about-list">
                                <li><span className="about-li-lead">Workout Logging</span> Easily input exercises, sets, reps, and weights.</li>
                                <li><span className="about-li-lead">Interactive Charts</span> Visualize progress with dynamic graphs powered by Recharts.</li>
                                <li><span className="about-li-lead">Secure Authentication</span> Protect user data with secure login and session management.</li>
                                <li><span className="about-li-lead">Cloud-Based Storage</span> Access workout history from anywhere.</li>
                            </ul>
                        </div>
                        {!isMobile && <div className="animate-pulse nav-arrow-right">{'->'}</div>}
                    </div>


                    <div id="p2" className="about-section">
                        <div className="body">
                            <ul className="about-list"><span className="p-lead ul-title">Tech Stack</span>
                                <li><span className="about-li-lead">Frontend</span> Next.js (React + TypeScript), Recharts for data visualization, GSAP for animations.</li>
                                <li><span className="about-li-lead">Backend</span> Node.js with Express, PostgreSQL for database management.</li>
                                <li><span className="about-li-lead">Authentication</span> Secure login system with JWT-based authentication.</li>
                                <li><span className="about-li-lead">Hosting & Deployment</span> Cloud-hosted for scalability and accessibility.</li>
                            </ul>
                        </div>
                        {!isMobile && <div className="animate-pulse nav-arrow-right">{'->'}</div>}
                    </div>


                    <div id="p3" className="about-section">
                        <div className="left">
                            <p>
                                <span className="p-lead">This app originally started</span> as a desktop Java application that would sync the gym records on my phone with a local directory. I then had a script that would parse the plaintext notes with REGEX and chart the values using Google charts.
                            </p>
                        </div>
                        <div className="right">
                            {width <= 1000 &&
                                <Image
                                    src='/java_app_2.png'
                                    height={300}
                                    width={450}
                                    alt="image of app window"
                                    className="img-app-window"
                                />
                            }
                            {width > 1000 &&
                                <Image
                                    src='/java_app_2.png'
                                    width={600}
                                    height={200}
                                    alt="image of app window"
                                    className="img-app-window"
                                />
                            }
                        </div>
                        {!isMobile && <div className="animate-pulse nav-arrow-right">{'->'}</div>}
                    </div>


                    <div id="p4" className="about-section">

                        <div className="left">
                            <p>
                                <span className="p-lead">I wanted something simple</span>  to make sure I was accomplishing my goals, which was to pump more iron than the last workout. What began as simple notes in the Samsung notes app became this database web app that I can use at the gym to quickly and easily log my sets and see my progress immediately.
                            </p>
                        </div>

                        {isMobile
                            ? (
                                <div className="right">
                                    <Image
                                        src='/notes_app_2.jpg'
                                        width={200}
                                        height={300}
                                        alt="image of note-taking app"
                                        className="img-notes-app zoom-image"
                                    />
                                </div>
                            )
                            : (
                                <div className="right">
                                    {width <= 1000 && (
                                        <Image
                                            src='/notes_app_2.jpg'
                                            width={250}
                                            height={300}
                                            alt="image of note-taking app"
                                            className="img-notes-app zoom-image"
                                        />
                                    )}
                                    {width > 1000 &&
                                        <Image
                                            src='/notes_app_2.jpg'
                                            width={300}
                                            height={400}
                                            alt="image of note-taking app"
                                            className="img-notes-app zoom-image"
                                        />
                                    }
                                </div>
                            )}
                        {!isMobile && <div className="animate-pulse nav-arrow-right">{'->'}</div>}

                    </div>


                    <div id="p5" className="about-section">
                        {!isMobile && <div className="animate-pulse nav-arrow-left">{'<-'}</div>}

                        <div className="body">
                            <p>
                                <span className="p-lead">This project showcases</span> my full-stack development skills, including building a modern, interactive UI, designing RESTful APIs, and implementing secure authentication and database management.
                            </p>
                            <p className="flex flex-col justify-center items-center">
                                Check out my other projects or drop me a message at
                                <Link
                                    href="https://divs4u.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`
                                            ${robotoSlab.className} 
                                            flex
                                            items-center
                                            hover:text-blue-300
                                            hover:underline
                                            text-white
                                            font-semibold
                                            text-[16pt]
                                            sm:text-[18pt]
                                            md:text-[20pt]
                                            lg:text-[22pt]
                                            xl:text-[24pt]
                                        `}
                                >
                                    Divs4U
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
