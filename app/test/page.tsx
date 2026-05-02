"use client";

import { useEffect, useRef, useState } from "react";
import AboutPage from "./AboutPage";

const CARD_SLOT_DESKTOP = 110;
const CARD_SLOT_MOBILE = 84;
const CARD_HEIGHT = 100;
const TRACK_OFFSET = 2;
const MOBILE_EXTRA = 2;   // hero (0) + about (1)
const MOBILE_HERO_SLOT = 160; // hero slot: topbar + logo + tagline

// Top position of a mobile slot given its index
const mobileSlotTop = (idx: number) =>
  idx === 0 ? 0 : MOBILE_HERO_SLOT + (idx - 1) * CARD_SLOT_MOBILE;

// Total logical height of all mobile slots
const mobileTotalH = () =>
  MOBILE_HERO_SLOT + (MOBILE_EXTRA - 1 + CARDS.length) * CARD_SLOT_MOBILE;

const CARDS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  name: ["Nike Run", "Kunsthalle Basel", "Gemini", "MARP", "Robinhood", "Melissa", "Church", "W Hotels", "Five Years", "Twitch"][i % 10] + (i >= 10 ? ` ${Math.floor(i / 10) + 1}` : ""),
  desc: ["Making Nike the running brand once again", "Building an institutional brand with an anti-institutional spirit", "Ushering in a new era for Google", "Brand identity & strategy, building a modernist icon", "Leveling up a fintech pioneer to lead the next stage of growth", "Crafting a signature for the brand turning plastic into fashion", "Getting unorthodox with the post house", "Rebranding a global portfolio for a new era of hospitality", "An inside look at five years of Porto Rocha", "Building back audience trust"][i % 10],
  img: `/img/works/${(i % 6) + 1}.jpg`,
}));


export default function TestPage() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [view, setView] = useState<"home" | "work" | "about">("home");
  const [mainOpen, setMainOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const windowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Project card refs
  const slotEls = useRef<(HTMLDivElement | null)[]>([]);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const glowEls = useRef<(HTMLDivElement | null)[]>([]);

  // Mobile-only extra card refs [0=hero, 1=about]
  const mobileSlotEls = useRef<(HTMLDivElement | null)[]>([null, null]);
  const mobileGlowEls = useRef<(HTMLDivElement | null)[]>([null, null]);

  const seenCards = useRef(new Set<number>());
  const targetY = useRef(0);
  const currentY = useRef(0);
  const rafRef = useRef<number | null>(null);

  const revealCard = (i: number, delay = 0) => {
    if (seenCards.current.has(i)) return;
    seenCards.current.add(i);
    const el = cardEls.current[i];
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    el.getBoundingClientRect();
    el.classList.add("visible");
    el.addEventListener("transitionend", () => { el.style.transitionDelay = "0ms"; }, { once: true });
  };

  useEffect(() => {
    if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
  }, [view, mainOpen]);

  useEffect(() => {
    const win = windowRef.current;
    if (!win) return;
    const isMobile = window.innerWidth <= 768;
    const slot = isMobile ? CARD_SLOT_MOBILE : CARD_SLOT_DESKTOP;
    const visible = Math.ceil(win.clientHeight / slot) + 1;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      for (let i = 0; i < Math.min(visible, CARDS.length); i++) {
        revealCard(i, i * 65);
      }
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const win = windowRef.current;
    if (!win) return;

    let touchStartY = 0;
    let touchVelocity = 0;
    let lastTouchY = 0;
    let lastTouchTime = 0;

    const mob = () => window.innerWidth <= 768;
    const getMax = () => {
      const h = win.clientHeight;
      return mob()
        ? Math.max(0, mobileTotalH() - h)
        : Math.max(0, CARDS.length * CARD_SLOT_DESKTOP - h);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetY.current = Math.max(0, Math.min(targetY.current + e.deltaY * 0.8, getMax()));
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
      lastTouchTime = Date.now();
      touchVelocity = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const now = Date.now();
      const delta = lastTouchY - e.touches[0].clientY;
      const dt = Math.max(1, now - lastTouchTime);
      touchVelocity = delta / dt;
      lastTouchY = e.touches[0].clientY;
      lastTouchTime = now;
      targetY.current = Math.max(0, Math.min(targetY.current + delta * 2, getMax()));
    };

    const onTouchEnd = () => {
      // carry momentum
      targetY.current = Math.max(0, Math.min(targetY.current + touchVelocity * 120, getMax()));
      touchVelocity = 0;
    };

    win.addEventListener("wheel", onWheel, { passive: false });
    win.addEventListener("touchstart", onTouchStart, { passive: true });
    win.addEventListener("touchmove", onTouchMove, { passive: false });
    win.addEventListener("touchend", onTouchEnd, { passive: true });

    const loop = () => {
      currentY.current += (targetY.current - currentY.current) * 0.1;
      if (Math.abs(targetY.current - currentY.current) < 0.05) currentY.current = targetY.current;

      const containerH = win.clientHeight;
      const isMobile = mob();
      const totalSlots = isMobile ? MOBILE_EXTRA + CARDS.length : CARDS.length;

      // Mobile-only slots: hero (0) and about (1)
      if (isMobile) {
        for (let mi = 0; mi < MOBILE_EXTRA; mi++) {
          const slot = mobileSlotEls.current[mi];
          if (!slot) continue;

          const cardH = mi === 0 ? MOBILE_HERO_SLOT : CARD_HEIGHT;
          const visualTop = mobileSlotTop(mi) - currentY.current + TRACK_OFFSET;
          const visualBottom = visualTop + cardH;
          const excess = visualBottom - containerH;
          const foldProgress = Math.max(0, excess / cardH);

          slot.style.top = `${visualTop}px`;

          const scale = foldProgress <= 0 ? 1 : Math.max(0.52, 1 - foldProgress * 0.25);
          const t = foldProgress <= 0 ? 0 : -(foldProgress * cardH);
          const peekExtra = foldProgress <= 0 ? 0 : Math.min(foldProgress * 10, 26);
          const tFinal = foldProgress <= 0 ? 0 : t + peekExtra;
          slot.style.transform = tFinal === 0 && scale === 1 ? "none" : `translateY(${tFinal}px) scale(${scale})`;
          slot.style.opacity = "1";
          slot.style.zIndex = String(Math.max(1, totalSlots - mi));

          const glow = mobileGlowEls.current[mi];
          if (glow) glow.style.opacity = foldProgress > 0 ? "1" : "0";
        }
      }

      // Project cards
      CARDS.forEach((_, i) => {
        const slot = slotEls.current[i];
        if (!slot) return;

        const visualTop = isMobile
          ? mobileSlotTop(i + MOBILE_EXTRA) - currentY.current + TRACK_OFFSET
          : i * CARD_SLOT_DESKTOP - currentY.current + TRACK_OFFSET;
        const visualBottom = visualTop + CARD_HEIGHT;
        const excess = visualBottom - containerH;
        const foldProgress = Math.max(0, excess / CARD_HEIGHT);

        slot.style.top = `${visualTop}px`;

        const scale = foldProgress <= 0 ? 1 : Math.max(0.52, 1 - foldProgress * 0.25);
        const t = foldProgress <= 0 ? 0 : -(foldProgress * CARD_HEIGHT);
        const peekExtra = foldProgress <= 0 ? 0 : Math.min(foldProgress * 10, 26);
        const tFinal = foldProgress <= 0 ? 0 : t + peekExtra;
        slot.style.transform = tFinal === 0 && scale === 1 ? "none" : `translateY(${tFinal}px) scale(${scale})`;
        slot.style.opacity = "1";
        slot.style.zIndex = String(Math.max(1, CARDS.length - i));

        const glow = glowEls.current[i];
        if (glow) glow.style.opacity = foldProgress > 0 ? "1" : "0";

        if (!seenCards.current.has(i) && (visualTop < containerH + 20 || foldProgress > 0)) {
          revealCard(i, 0);
        }
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      win.removeEventListener("wheel", onWheel);
      win.removeEventListener("touchstart", onTouchStart);
      win.removeEventListener("touchmove", onTouchMove);
      win.removeEventListener("touchend", onTouchEnd);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = (index: number) => {
    const win = windowRef.current;
    if (!win) return;
    const isMobile = window.innerWidth <= 768;
    const top = isMobile
      ? mobileSlotTop(index + MOBILE_EXTRA)
      : index * CARD_SLOT_DESKTOP;
    const max = isMobile
      ? Math.max(0, mobileTotalH() - win.clientHeight)
      : Math.max(0, CARDS.length * CARD_SLOT_DESKTOP - win.clientHeight);
    targetY.current = Math.max(0, Math.min(top, max));
    setView("work");
    setMainOpen(true);
    if (index === active) return;
    setFading(true);
    setTimeout(() => { setActive(index); setFading(false); }, 200);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const card = CARDS[active];

  return (
    <div className={`layout${theme === "light" ? " light" : ""}`}>
      <aside className="sidebar">

        {/* Desktop-only top section */}
        <div className="sidebar-top">
          <div className="sidebar-topbar">
            <button className="sidebar-show-btn">Show all projects</button>
            <button className={`sidebar-theme-toggle${theme === "light" ? " is-light" : ""}`} onClick={toggleTheme} />
          </div>
          <img src="/img/lvetica-logo.png" alt="Lvetica" className="sidebar-logo-img" />
          <div className="sidebar-tagline">DOING WHAT <span style={{ color: "#f4dc17" }}>MATTERS</span></div>
        </div>

        {/* Desktop-only about section */}
        <div
          className="sidebar-about"
          onClick={() => { setView("about"); setMainOpen(true); }}
          style={{ cursor: "pointer" }}
        >
          <div className="sidebar-about-label">About us</div>
          <div className="sidebar-about-text">
            Lvetica connects brands with top creators for influencer marketing, UGC, and social growth.
          </div>
        </div>

        <div className="carousel-window" ref={windowRef}>
          <div className="carousel-track" ref={trackRef}>

            {/* Mobile-only: hero (slot 0) — same look as desktop sidebar-top */}
            <div
              ref={(el) => { mobileSlotEls.current[0] = el; }}
              className="card-slot mobile-only-slot"
            >
              <div className="sidebar-top mobile-hero-inner">
                <div ref={(el) => { mobileGlowEls.current[0] = el; }} className="proj-card-glow" />
                <div className="sidebar-topbar">
                  <button className="sidebar-show-btn">Show all projects</button>
                  <button
                    className={`sidebar-theme-toggle${theme === "light" ? " is-light" : ""}`}
                    onClick={toggleTheme}
                  />
                </div>
                <img src="/img/lvetica-logo.png" alt="Lvetica" className="sidebar-logo-img" />
                <div className="sidebar-tagline">DOING WHAT <span style={{ color: "#f4dc17" }}>MATTERS</span></div>
              </div>
            </div>

            {/* Mobile-only: about card (slot 1) */}
            <div
              ref={(el) => { mobileSlotEls.current[1] = el; }}
              className="card-slot mobile-only-slot"
            >
              <div
                className="proj-card visible"
                onClick={() => { setView("about"); setMainOpen(true); }}
              >
                <div ref={(el) => { mobileGlowEls.current[1] = el; }} className="proj-card-glow" />
                <div className="proj-card-info">
                  <div className="proj-card-name">About us</div>
                  <div className="proj-card-desc">Lvetica connects brands with top creators for influencer marketing, UGC, and social growth.</div>
                </div>
              </div>
            </div>

            {/* Project cards */}
            {CARDS.map((c, i) => (
              <div
                key={c.id}
                ref={(el) => { slotEls.current[i] = el; }}
                className="card-slot"
              >
                <div
                  ref={(el) => { cardEls.current[i] = el; }}
                  data-idx={i}
                  className={`proj-card${seenCards.current.has(i) ? " visible" : ""}${i === active ? " active" : ""}`}
                  onClick={() => handleCardClick(i)}
                >
                  <div ref={(el) => { glowEls.current[i] = el; }} className="proj-card-glow" />
                  <img src={c.img} alt={c.name} className="proj-card-icon" />
                  <div className="proj-card-info">
                    <div className="proj-card-name">{c.name}</div>
                    <div className="proj-card-desc">{c.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className={`main${mainOpen ? " main-open" : ""}${view === "home" ? " main-home" : ""}`}>
        <button className="main-back-btn" onClick={() => { setMainOpen(false); setView("home"); }}>← Back</button>
        <div className="main-content" ref={mainContentRef}>
          {view === "home" ? (
            <video
              className="main-video"
              src="/energy-ball.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : view === "about" ? <AboutPage /> : (
            <>
              <img src={card.img} alt={card.name} className={`main-hero${fading ? " fade" : ""}`} />
              <div className="main-body">
                <div className="main-label">Our Work</div>
                <h1 className="main-title"><strong>{card.name}</strong></h1>
                <p className="main-desc">{card.desc}. A creative campaign focused on brand storytelling, visual identity, and audience connection.</p>
                <div className="main-tags"><span className="main-tag">2025</span></div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
