"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import styles from './page.module.css';
import About1 from "@/components/about/About1";
import About2 from "@/components/about/About2";
import About3 from "@/components/about/About3";
import About4 from "@/components/about/About4";
import About5 from "@/components/about/About5";
import { tree } from "next/dist/build/templates/app-page";

gsap.registerPlugin(ScrollTrigger);

export default function Gsap() {


    useEffect(() => {

        const squares = Array.from(document.querySelectorAll('.square'));

        const tlTitle = gsap.timeline({
            yoyo: true,
            repeat: -1,
        });

        // tl.to("h1", { x: 300, duration: 20, ease: "power1.inOut" });
        tlTitle.to("h2", { x: 30, duration: 2, ease: "power1.inOut" })
            .to("h1", { x: -30, duration: 2, ease: "power1.inOut" }, '<')
            .to("h2", { x: -30, duration: 2, ease: "power1.inOut" })
            .to("h1", { x: 30, duration: 2, ease: "power1.inOut" }, '<')

        const tlIntro = gsap.timeline();

        tlIntro.to('.a', {
            y: "800px",
            delay: 0.5,
            ease: "power1.in"
        })
            .to('.b', {
                y: "800px",
                delay: 0.75,
                ease: "power1.in"
            })



    }, [])


    return (
        <>

            <div className="body">
                <header>
                    <h1>ABOUT</h1>
                    <h2>Scroll Down</h2>
                </header>
                {/* <h1>GSAP</h1> */}

                <div className="container1">

                    <div className="square a">A</div>

                    <div className="square b">B</div>

                    <div className="square c">C</div>

                    <div className="square d">D</div>

                    <div className="square e">E</div>

                    {/* <About1 isMobile={false} width={window.innerWidth}></About1>
                    <About2 isMobile={false} width={window.innerWidth}></About2>
                    <About3 isMobile={false} width={window.innerWidth}></About3>
                    <About4 isMobile={false} width={window.innerWidth}></About4>
                    <About5 isMobile={false} width={window.innerWidth}></About5> */}

                </div>

            </div>
        </>
    )

}