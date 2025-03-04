"use client";

import { Tourney } from "next/font/google";
import { Roboto_Slab } from "next/font/google";
import { Oswald } from "next/font/google";

import Link from "next/link";
import Image from "next/image";
import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutLoading from "../components/about/AboutLoading";
import { useSession } from "next-auth/react";

import { MdDashboard } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";


const tourney = Tourney({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap"
});

const oswald = Oswald({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap"
});

const robotoSlab = Roboto_Slab({
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
    const [gsapRan, setGsapRan] = useState<boolean>(false);
    const { data: session } = useSession(); // Ensure this is defined before use

    const token = session?.user?.authToken || localStorage.getItem("token");




    useEffect(() => {
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
        if (gsapRan === true) return

        const totalScrollDistance = 150 * (sections.length - 1);

        const animations: gsap.core.Tween[] = [];
        const triggers: ScrollTrigger[] = [];

        setTimeout(() => {
            // Horizontal scrolling
            const animation = gsap.to(sections, {
                xPercent: -totalScrollDistance,
                ease: "none",
                scrollTrigger: {
                    trigger: scrollContainerRef.current,
                    pin: true,
                    scrub: 2.5,
                    snap: 1 / (sections.length - 1),
                    end: "+=4000",
                    invalidateOnRefresh: true
                },
            });

            animations.push(animation);
        }, 100);

        // Parallax effect ScrollTrigger
        const parallaxTrigger = ScrollTrigger.create({
            trigger: scrollContainerRef.current,
            start: "top center",
            end: `+=${totalScrollDistance * 15}`,
            scrub: 1,
            pin: false,
            onUpdate: (self) => {
                const progress = self.progress;
                const moveAmount = -progress * totalScrollDistance * 0.4;
                gsap.set(".parallax-bg", { backgroundPositionX: `${moveAmount}vw` });
            }
        });

        triggers.push(parallaxTrigger);

        ScrollTrigger.refresh();

        ScrollTrigger.refresh(); // Ensure proper calculation
        setGsapRan(true);

    }, [sections]);






    if (loading) {
        // return (<p>Loading...</p>);
        return <AboutLoading />;
    }
    return (
        <div>
            <div ref={scrollContainerRef} id="about-page">

                <header>
                    <h1 className="page-header">About <span className="app-name">GainsDB</span></h1>
                    {
                        token ? (
                            <Link href="/dashboard" className="hover:text-blue-300 flex items-center">
                                <MdDashboard className="mr-2 text-xl" />
                                <h2 className={`${oswald.className} text-lg font-bold  text-[12pt] sm:text-[14pt] md:text-[16pt] lg:text-[20pt]`}>Dashboard</h2>
                            </Link>
                        ) : (
                            <Link href="/" className="hover:text-blue-300 flex items-center">
                                <AiFillHome className="mr-2 text-xl" />
                                <h2 className={`${oswald.className} text-lg font-bold  text-[12pt] sm:text-[14pt] md:text-[16pt] lg:text-[20pt]`}>Home</h2>
                            </Link>
                        )
                    }
                </header>

                {/* Parallax Background */}
                <div className="parallax-bg"></div>


                <div className="about-body">
                    {/* Content */}
                    <div className="about-track">





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
                            <div className="animate-pulse nav-arrow-right">{'->'}</div>
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
                            <div className="animate-pulse nav-arrow-right">{'->'}</div>
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
                            <div className="animate-pulse nav-arrow-right">{'->'}</div>
                        </div>





                        <div id="p4" className="about-section">

                            <div className="left">
                                <p>
                                    <span className="p-lead">I wanted something simple</span>  to make sure I was accomplishing my goals, which was to pump more iron than the last workout. What began as simple notes in the Samsung notes app became this database web app that I can use at the gym to quickly and easily log my sets and see my progress immediately.
                                </p>
                            </div>

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
                            <div className="animate-pulse nav-arrow-right">{'->'}</div>

                        </div>




                        <div id="p5" className="about-section">
                            <div className="animate-pulse nav-arrow-left">{'<-'}</div>

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
        </div>
    );
}
