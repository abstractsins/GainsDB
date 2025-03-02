"use client";

import { Tourney } from "next/font/google";
import Image from "next/image";
import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutLoading from "../components/about/AboutLoading";

const tourney = Tourney({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap"
});

const bgImage = '/bg1.jpg';

gsap.registerPlugin(ScrollTrigger);




export default function About() {
    const [width, setWidth] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [sections, setSections] = useState<Element[]>([]);


    useEffect(() => {
        setLoading(true);
        setWidth(window.innerWidth);

        const checkSections = () => {
            // const foundSections = Array.from(document.querySelectorAll(".about-section"));
            const foundSections = Array.from(document.querySelectorAll(".about-section"));
            if (foundSections.length > 0) {
                setSections(foundSections); // ✅ Update state when elements exist
            }
        };

        checkSections(); // Run immediately
        setTimeout(checkSections, 10); // Double-check after delay

        setLoading(false);
    }, []);



    useEffect(() => {
        if (sections.length === 0) return;

        const totalScrollDistance = 150 * (sections.length - 1); // Matches the xPercent movement

        gsap.to(sections, {
            xPercent: -totalScrollDistance,
            ease: "none",
            scrollTrigger: {
                trigger: scrollContainerRef.current,
                pin: true,
                scrub: 0.5,
                snap: 1 / (sections.length - 1),
                end: "+=3000",
            },
        });

        // Background parallax effect (Now dynamic & extends over full scroll)
        ScrollTrigger.create({
            trigger: scrollContainerRef.current,
            start: "left center",
            end: `+=${totalScrollDistance * 15}`, // Extends end to match full scroll distance
            scrub: 1,
            pin: false,
            onUpdate: (self) => {
                const progress = self.progress; // Gets a value between 0 and 1 over the entire scroll
                const moveAmount = -progress * totalScrollDistance * 0.4; // Moves slower for parallax

                gsap.set(".parallax-bg", { backgroundPositionX: `${moveAmount}vw` });

                console.log("Progress:", progress.toFixed(2), "Move:", moveAmount.toFixed(2)); // Debug
            }
        });

        // gsap.to(".parallax-bg", { backgroundPositionX: "-100vw", duration: 5 });
    }, [sections]);





    if (loading) {
        return (<p>Loading...</p>);
        // return <AboutLoading />;
    }
    return (
        <div id="about-page">

            <header>
                <h1 className="page-header">About <span className="app-name">GainsDB</span></h1>
            </header>

            {/* Parallax Background */}
            <div className="parallax-bg"></div>


            <div ref={scrollContainerRef} className="about-body">
                {/* Content */}
                <div className="about-track">


                    <div id="p1" className="about-section">
                        <h2>
                            This web application is designed to help users log, visualize, and analyze their workout progress over time. The app provides an intuitive interface for tracking exercises, viewing interactive charts, and gaining insights into strength and endurance improvements.
                        </h2>

                        <ul className="about-list"><span className="ul-title">Key Features</span>
                            <li>Workout Logging: Easily input exercises, sets, reps, and weights.</li>
                            <li>Interactive Charts: Visualize progress with dynamic graphs powered by Recharts.</li>
                            <li>Secure Authentication: Protect user data with secure login and session management.</li>
                            <li>Cloud-Based Storage: Access workout history from anywhere.</li>
                        </ul>
                    </div>


                    <div id="p2" className="about-section">

                        <ul className="about-list"><span className="ul-title">Tech Stack</span>
                            <li>Frontend: Next.js (React + TypeScript), Recharts for data visualization.</li>
                            <li>Backend: Node.js with Express, PostgreSQL for database management.</li>
                            <li>Authentication: Secure login system with JWT-based authentication.</li>
                            <li>Hosting & Deployment: Cloud-hosted for scalability and accessibility.</li>
                        </ul>
                    </div>

                    <div id="p3" className="about-section">


                        This project showcases my full-stack development skills, including building a modern, interactive UI, designing RESTful APIs, and implementing secure authentication and database management.
                    </div>





                    <div id="p4" className="about-section">
                        This app originally started as a desktop Java application that would sync the gym records on my phone with a local directory. I then had a script that would parse the plaintext notes with REGEX and chart the values using Google charts.

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
                                height={400}
                                width={600}
                                alt="image of app window"
                                className="img-app-window"
                            />
                        }
                    </div>




                    <div id="p5" className="about-section">
                        I wanted something simple to make sure I was accomplishing my goals, which was to pump more iron than the last workout. What began as simple notes in the Samsung notes app became this database web app that I can use at the gym to quickly and easily log my sets and see my progress immediately.

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
                                width={350}
                                height={400}
                                alt="image of note-taking app"
                                className="img-notes-app zoom-image"
                            />
                        }
                    </div>

                </div>
            </div>
        </div>
    );
}
