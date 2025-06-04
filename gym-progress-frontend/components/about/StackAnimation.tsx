import { useState, useEffect, useRef } from "react";

import { FaNodeJs, FaReact } from "react-icons/fa";
import { RiNextjsFill, RiJavascriptLine } from "react-icons/ri";
import { BiLogoTypescript, BiLogoPostgresql } from "react-icons/bi";
import { IoCloudDownloadSharp, IoCloudUploadSharp } from "react-icons/io5";
import { SiExpress, SiPrisma } from "react-icons/si";
import { GoShieldLock } from "react-icons/go";
import { GiWeightLiftingUp } from "react-icons/gi";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


export default function StackAnimation() {

    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const [pause, setPause] = useState(false);

    // Create the timeline ONCE
    useEffect(() => {

        let upload = true;

        const tl = gsap.timeline({ repeat: -1 });

        tl
            .to('#upload', {
                duration: 3,
                onCompleteParams: ['off'],
                onComplete: toggleClouds
            })
            .to('.sheet', {
                rotateX: '40deg',
                y: '-150px',
                duration: 1,
                ease: 'power3.in',
                onStartParams: [true],
                onStart: showSheetText
            }, '<3')
            .to('#sheet-3', {
                y: -150,
                duration: 1,
                ease: "power2.out",
            }, '<')
            .to('#sheet-1', {
                y: 125,
                duration: 1,
                ease: "power2.out"
            }, '<')
            .to('#sheet-2', {
                y: -15,
                duration: 1,
                ease: "power2.out"
            }, '<')
            .to('.sheet', {
                rotateY: -40,
                ease: "power1.out",
            }, '<2')
            .to('#sheet-3', {
                onStartParams: [false],
                onStart: showSheetText,
                y: 0,
                duration: 0.35,
                ease: "bounce",
            }, '<2')
            .to('#sheet-2', {
                y: 0,
                duration: 0.5,
                ease: "bounce"
            }, '<')
            .to('#sheet-1', {
                y: 0,
                duration: 0.35,
                ease: "bounce",
            }, '<')
            .to('.sheet', {
                rotateY: 0,
                rotateX: '0deg',
                ease: "power1.out",
                onCompleteParams: ['on'],
                onComplete: toggleClouds
            }, '<1')

        tlRef.current = tl;

        return () => tl.kill() as unknown as void;

        function toggleClouds(i: string) {
            const id = upload ? 'upload' : 'download';
            const other = upload ? 'download' : 'upload';

            switch (i) {
                case 'off':
                    document.getElementsByClassName('active-cloud')[0]?.classList.add('hidden');
                    document.getElementsByClassName('active-cloud')[0]?.classList.remove('glowPulse');
                    document.getElementById(id)?.classList.toggle('active-cloud');
                    document.getElementById(other)?.classList.toggle('active-cloud');
                    break;
                case 'on':
                    document.getElementsByClassName('active-cloud')[0]?.classList.remove('hidden');
                    document.getElementsByClassName('active-cloud')[0]?.classList.add('glowPulse');
                    break;
            }

            upload = !upload;
        }

        function showSheetText(on: boolean) {

            const toggleById = (ids: string[], add: boolean) =>
                ids.forEach(id => document.getElementById(id)?.classList.toggle('opaque', add));

            const toggleBySelector = (selector: string, add: boolean) =>
                document.querySelector(selector)?.classList.toggle('opaque', add);

            const toggleAllBySelector = (selector: string, add: boolean) =>
                document.querySelectorAll<HTMLElement>(selector)
                    .forEach(el => el.classList.toggle('opaque', add));

            toggleById(['sheet-text-3', 'sheet-text-2', 'sheet-text-1'], on);   // text layers
            toggleBySelector('.pretext-container', !on);  // pre‑text
            toggleAllBySelector('.sheet-icons-container', on);   // icon rows
        }

    }, []);


    // Control pause/play separately
    useEffect(() => {
        if (!tlRef.current) return;

        if (pause) tlRef.current.pause();
        else tlRef.current.play();
    }, [pause]);


    return (
        < div className="animation-container" >
            {/* <input type='button' className="pause-btn" onClick={() => setPause(prev => !prev)} value={!pause ? '⏸️' : '▶️'} /> */}

            <IoCloudUploadSharp className="cloud-icon glowPulse active-cloud" id="upload" />
            <IoCloudDownloadSharp className="cloud-icon glowPulse hidden" id="download" />

            <div className="sheet-container">
                <div className="animation-layer sheet" id="sheet-1">
                    <span className="sheet-text" id="sheet-text-1">Backend</span>
                    <div className="sheet-icons-container">
                        <SiExpress className="sheet-icon" />
                        <SiPrisma className="sheet-icon" />
                        <FaNodeJs className="sheet-icon" />
                        <BiLogoPostgresql className="sheet-icon" />
                    </div>
                </div>
            </div>
            <div className="sheet-container">
                <div className="animation-layer sheet" id="sheet-2">
                    <div>
                        <span className="sheet-text" id="sheet-text-2">Authentication</span>
                    </div>
                    <div className="sheet-icons-container" id="icons-container-2">
                        <GoShieldLock className="sheet-icon" id="shield-lock" />
                    </div>
                </div>
            </div>
            <div className="sheet-container">
                <div className="animation-layer sheet" id="sheet-3">
                    <span className="sheet-text" id="sheet-text-3">Frontend</span>
                    <div className="pretext-container opaque">
                        <GiWeightLiftingUp className="sheet-icon" />
                        <span className="sheet-pretext" id="stack-text">GainsDB</span>
                    </div>
                    <div className="sheet-icons-container">
                        <FaReact className="sheet-icon" />
                        <RiNextjsFill className="sheet-icon" />
                        <BiLogoTypescript className="sheet-icon" />
                        <RiJavascriptLine className="sheet-icon" />

                    </div>
                </div>
            </div>
        </div >
    )
}