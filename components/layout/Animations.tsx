"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Animations() {
  useEffect(() => {
    // Clone arrows, dodecahedrons, and lines into their placeholder elements
    const arrowSource = document.querySelector(".mil-hidden-elements .mil-arrow");
    const dodecahedronSource = document.querySelector(".mil-hidden-elements .mil-dodecahedron");
    const linesSource = document.querySelector(".mil-hidden-elements .mil-lines");

    document.querySelectorAll(".mil-arrow-place").forEach((el) => {
      if (arrowSource && !el.querySelector(".mil-arrow")) {
        el.appendChild(arrowSource.cloneNode(true));
      }
    });

    document.querySelectorAll(".mil-animation").forEach((el) => {
      if (dodecahedronSource && !el.querySelector(".mil-dodecahedron")) {
        el.appendChild(dodecahedronSource.cloneNode(true));
      }
    });

    document.querySelectorAll(".mil-lines-place").forEach((el) => {
      if (linesSource && !el.querySelector(".mil-lines")) {
        el.appendChild(linesSource.cloneNode(true));
      }
    });

    // Preloader animation
    const timeline = gsap.timeline();

    timeline.to(".mil-preloader-animation", { opacity: 1 });
    timeline.fromTo(
      ".mil-animation-1 .mil-h3",
      { y: "30px", opacity: 0 },
      { y: "0px", opacity: 1, stagger: 0.2 }
    );
    timeline.to(".mil-animation-1 .mil-h3", { opacity: 0, y: "-30" }, "+=.1");
    timeline.fromTo(".mil-reveal-box", { opacity: 0 }, { opacity: 1, x: "-30", duration: 0.05 });
    timeline.to(".mil-reveal-box", { width: "100%", x: 0, duration: 0.25 }, "+=.05");
    timeline.to(".mil-reveal-box", { right: "0" });
    timeline.to(".mil-reveal-box", { width: "0%", duration: 0.15 });
    timeline.fromTo(".mil-animation-2 .mil-h3", { opacity: 0 }, { opacity: 1 }, "-=.25");
    timeline.to(".mil-animation-2 .mil-h3", { opacity: 0, y: "-30", duration: 0.3 }, "+=.2");
    timeline.to(".mil-preloader", { opacity: 0, ease: "sine", duration: 0.4 }, "+=.1");
    timeline.fromTo(
      ".mil-up",
      { opacity: 0, y: 40, scale: 0.98, ease: "sine" },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        onComplete: () => {
          const preloader = document.querySelector(".mil-preloader");
          if (preloader) preloader.classList.add("mil-hidden");
        },
      },
      "-=.5"
    );

    // Progress bar
    gsap.to(".mil-progress", {
      height: "100%",
      ease: "sine",
      scrollTrigger: { scrub: 0.3 },
    });

    // Back to top
    const btt = document.querySelector(".mil-back-to-top .mil-link");
    if (btt) {
      gsap.set(btt, { x: -30, opacity: 0 });
      gsap.to(btt, {
        x: 0,
        opacity: 1,
        ease: "sine",
        scrollTrigger: {
          trigger: "body",
          start: "top -40%",
          end: "top -40%",
          toggleActions: "play none reverse none",
        },
      });
    }

    // Scroll reveal animations (.mil-up)
    document.querySelectorAll(".mil-up").forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 40, scale: 0.98, ease: "sine" },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          scrollTrigger: {
            trigger: section,
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Scale on scroll (.mil-scale)
    document.querySelectorAll(".mil-scale").forEach((section) => {
      const el = section as HTMLElement;
      const value1 = parseFloat(el.dataset.value1 || el.getAttribute("data-value-1") || "1");
      const value2 = parseFloat(el.dataset.value2 || el.getAttribute("data-value-2") || "1");
      gsap.fromTo(
        section,
        { ease: "sine", scale: value1 },
        {
          scale: value2,
          scrollTrigger: {
            trigger: section,
            scrub: true,
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Parallax (.mil-parallax)
    if (window.innerWidth > 960) {
      document.querySelectorAll(".mil-parallax").forEach((section) => {
        const el = section as HTMLElement;
        const value1 = parseFloat(el.getAttribute("data-value-1") || "0");
        const value2 = parseFloat(el.getAttribute("data-value-2") || "0");
        gsap.fromTo(
          section,
          { ease: "sine", y: value1 },
          {
            y: value2,
            scrollTrigger: {
              trigger: section,
              scrub: true,
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    // Rotate on scroll (.mil-rotate)
    document.querySelectorAll(".mil-rotate").forEach((section) => {
      const el = section as HTMLElement;
      const value = parseFloat(el.getAttribute("data-value") || "0");
      gsap.fromTo(
        section,
        { ease: "sine", rotate: 0 },
        {
          rotate: value,
          scrollTrigger: {
            trigger: section,
            scrub: true,
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Custom cursor
    const cursor = document.querySelector(".mil-ball") as HTMLElement;
    if (cursor) {
      gsap.set(cursor, { xPercent: -50, yPercent: -50 });

      document.addEventListener("pointermove", (e) => {
        gsap.to(cursor, {
          duration: 0.6,
          ease: "sine",
          x: e.clientX,
          y: e.clientY,
        });
      });

      // Hide cursor on links/inputs
      document.querySelectorAll("a, input, textarea").forEach((el) => {
        el.addEventListener("mouseenter", () => {
          gsap.to(cursor, { scale: 0, duration: 0.2, ease: "sine" });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(cursor, { scale: 1, duration: 0.2, ease: "sine" });
        });
      });
    }

    // Anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (!href || href === "#" || href === "#.") return;
        const target = document.querySelector(href);
        if (target) {
          const offset = window.innerWidth < 1200 ? 90 : 0;
          window.scrollTo({
            top: (target as HTMLElement).offsetTop - offset,
            behavior: "smooth",
          });
        }
      });
    });

    // Menu toggle
    document.querySelectorAll(".mil-menu-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".mil-menu-btn").forEach((b) => b.classList.toggle("mil-active"));
        document.querySelector(".mil-menu-frame")?.classList.toggle("mil-active");
      });
    });

    // Submenu toggle
    document.querySelectorAll(".mil-has-children > a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll(".mil-has-children ul").forEach((ul) => ul.classList.remove("mil-active"));
        document.querySelectorAll(".mil-has-children > a").forEach((a) => a.classList.remove("mil-active"));
        (link as HTMLElement).classList.toggle("mil-active");
        (link.nextElementSibling as HTMLElement)?.classList.toggle("mil-active");
      });
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="mil-preloader">
      <div className="mil-preloader-animation">
        <div className="mil-pos-abs mil-animation-1">
          <p className="mil-h3 mil-muted mil-thin">Pioneering</p>
          <p className="mil-h3 mil-muted">Creative</p>
          <p className="mil-h3 mil-muted mil-thin">Excellence</p>
        </div>
        <div className="mil-pos-abs mil-animation-2">
          <div className="mil-reveal-frame">
            <p className="mil-reveal-box"></p>
            <p className="mil-h3 mil-muted mil-thin">lvetica.co</p>
          </div>
        </div>
      </div>
    </div>
  );
}
