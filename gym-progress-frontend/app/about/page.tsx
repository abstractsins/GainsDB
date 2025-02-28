"use client";

import { Tourney } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tourney = Tourney({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap"
});

const sections = [
    { id: "p1", image: "/bg1.jpg" },
    { id: "p2", image: "/bg2.jpg" },
    { id: "p3", image: "/bg3.jpg" }
];

export default function About() {
    const [width, setWidth] = useState<number>(0);
    const [bgImage, setBgImage] = useState(sections[0].image);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setWidth(window.innerWidth);

        const triggers = sections.map(({ id, image }) => {
            return ScrollTrigger.create({
                trigger: `#${id}`,
                start: "center center",
                end: "center center",
                // markers: true,
                onEnter: () => setBgImage(image),
                onEnterBack: () => setBgImage(image),
            });
        });

        return () => {
            triggers.forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div id="about-page" ref={containerRef} className="relative overflow-hidden">
            {/* Background Transition */}
            <div
                className="moving-bg"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>

            {/* Content */}
            <div className="relative z-10 text-white">
                <header>
                    <h1 className="page-header">About <span className="app-name">GainsDB</span></h1>
                </header>

                <div className="about-body">
                    <div id="p1" className="text-section">
                        <h2>
                            This web application is designed to help users log, visualize, and analyze their workout progress over time. The app provides an intuitive interface for tracking exercises, viewing interactive charts, and gaining insights into strength and endurance improvements.
                        </h2>

                        <ul className="about-list"><span className="ul-title">Key Features</span>
                            <li>Workout Logging: Easily input exercises, sets, reps, and weights.</li>
                            <li>Interactive Charts: Visualize progress with dynamic graphs powered by Recharts.</li>
                            <li>Secure Authentication: Protect user data with secure login and session management.</li>
                            <li>Cloud-Based Storage: Access workout history from anywhere.</li>
                        </ul>

                        <ul className="about-list"><span className="ul-title">Tech Stack</span>
                            <li>Frontend: Next.js (React + TypeScript), Recharts for data visualization.</li>
                            <li>Backend: Node.js with Express, PostgreSQL for database management.</li>
                            <li>Authentication: Secure login system with JWT-based authentication.</li>
                            <li>Hosting & Deployment: Cloud-hosted for scalability and accessibility.</li>
                        </ul>

                        This project showcases my full-stack development skills, including building a modern, interactive UI, designing RESTful APIs, and implementing secure authentication and database management.
                    </div>

                    <div id="p2" className="text-section">
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

                    <div id="p3" className="text-section">
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
