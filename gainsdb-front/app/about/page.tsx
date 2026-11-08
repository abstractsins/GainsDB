"use client";

import { useEffect, useRef, useState } from "react";

import { gsap } from "gsap";

import About1 from "@/components/about/About1";
import About2 from "@/components/about/About2";
import About3 from "@/components/about/About3";
import About4 from "@/components/about/About4";
import About5 from "@/components/about/About5";
import DownArrows from "@/components/about/DownArrows";
import UpArrows from "@/components/about/UpArrows";

export default function About() {
  const [width, setWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      setWidth(window.innerWidth);
      setIsMobile(window.innerWidth <= 768);
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  //* ─────────────────────────────────
  //* 🌄 Vertical parallax background
  //* ─────────────────────────────────
  useEffect(() => {
    const page = pageRef.current;
    const parallaxBg = parallaxBgRef.current;

    if (!page || !parallaxBg) {
      return;
    }

    const parallaxRatio = 0.1;
    let rafId = 0;
    let resizeObserver: ResizeObserver | null = null;

    const updateParallax = () => {
      const scrollTop = page.scrollTop;
      const parallaxOffset = scrollTop * -parallaxRatio;
      parallaxBg.style.transform = `translateY(${parallaxOffset}px)`;
      rafId = 0;
    };

    const updateParallaxBounds = () => {
      const maxScroll = Math.max(page.scrollHeight - page.clientHeight, 0);
      const maxParallaxShift = maxScroll * parallaxRatio;
      const requiredHeight = Math.ceil(
        window.innerHeight + maxParallaxShift + 64,
      );

      parallaxBg.style.height = `${requiredHeight}px`;
    };

    const queueUpdate = () => {
      if (rafId === 0) {
        rafId = window.requestAnimationFrame(updateParallax);
      }
    };

    updateParallaxBounds();
    queueUpdate();

    page.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", updateParallaxBounds);

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        updateParallaxBounds();
        queueUpdate();
      });
      resizeObserver.observe(page);
    }

    return () => {
      page.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", updateParallaxBounds);
      resizeObserver?.disconnect();
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  //* ─────────────────────────────────
  //* 🔁 Arrow signal timeline
  //* ─────────────────────────────────
  useEffect(() => {
    const hasUp = document.getElementById("nav-signal-line-up-1");
    const hasDown = document.getElementById("nav-signal-line-down-1");

    const leftArrows = gsap.timeline({ repeat: -1 });
    const rightArrows = gsap.timeline({ repeat: -1 });
    const upArrows = gsap.timeline({ repeat: -1 });
    const downArrows = gsap.timeline({ repeat: -1 });

    if (hasUp) {
      upArrows
        .to("#nav-signal-line-up-1", {
          y: "-50px",
          duration: 1.5,
          ease: "power3.inOut",
          opacity: 0,
        })
        .to(
          "#nav-signal-line-up-2",
          {
            y: "-100px",
            duration: 1.5,
            ease: "power3.inOut",
            opacity: 0,
          },
          "<",
        );
    }

    if (hasDown) {
      downArrows
        .to("#nav-signal-line-down-1", {
          y: "50px",
          duration: 1.5,
          ease: "power3.inOut",
          opacity: 0,
        })
        .to(
          "#nav-signal-line-down-2",
          {
            y: "100px",
            duration: 1.5,
            ease: "power3.inOut",
            opacity: 0,
          },
          "<",
        );
    }

    return () => {
      leftArrows.kill();
      rightArrows.kill();
      upArrows.kill();
      downArrows.kill();
    };
  }, []);

  //* ──────────────────────────────
  //* ⌨️ Keyboard remapping
  //* ──────────────────────────────

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        window.scrollBy({ top: 100, behavior: "smooth" });
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        window.scrollBy({ top: -100, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeys);

    return () => {
      window.removeEventListener("keydown", handleKeys);
    };
  }, []);

  return (
    <div ref={pageRef} id="about-page" className="about-page-vertical">
      {/* Parallax Background */}
      <div ref={parallaxBgRef} className="parallax-bg"></div>

      {/* Content */}
      <div className="about-track">
        <div className="about-section-container" id="about-section-container-1">
          <About1 isMobile={isMobile} width={width} />
        </div>

        <div className="about-section-container" id="about-section-container-2">
          <About2 isMobile={isMobile} width={width} />
        </div>

        <div className="about-section-container" id="about-section-container-3">
          <About3 isMobile={isMobile} width={width} />
        </div>

        <div className="about-section-container" id="about-section-container-4">
          <About4 isMobile={isMobile} width={width} />
        </div>

        <div className="about-section-container" id="about-section-container-5">
          <About5 isMobile={isMobile} width={width} />
        </div>
      </div>

      {/* <div className="instruction">
        <span>Scroll to Explore</span>
      </div> */}
    </div>
  );
}
