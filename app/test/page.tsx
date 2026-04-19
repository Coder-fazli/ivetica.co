"use client";

import { useEffect, useRef, useState } from "react";
import AboutPage from "./AboutPage";

const CARD_SLOT = 110;
const CARD_HEIGHT = 100; // approx rendered height for math
const TRACK_OFFSET = 2; // px gap at top of carousel window

const CARDS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  name: ["Nike Run", "Kunsthalle Basel", "Gemini", "MARP", "Robinhood", "Melissa", "Church", "W Hotels", "Five Years", "Twitch"][i % 10] + (i >= 10 ? ` ${Math.floor(i / 10) + 1}` : ""),
  desc: ["Making Nike the running brand once again", "Building an institutional brand with an anti-institutional spirit", "Ushering in a new era for Google", "Brand identity & strategy, building a modernist icon", "Leveling up a fintech pioneer to lead the next stage of growth", "Crafting a signature for the brand turning plastic into fashion", "Getting unorthodox with the post house", "Rebranding a global portfolio for a new era of hospitality", "An inside look at five years of Porto Rocha", "Building back audience trust"][i % 10],
  img: `/img/works/${(i % 6) + 1}.jpg`,
}));

function Clock() {
  const [t, setT] = useState({ date: "", time: "" });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setT({
        date: now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
        time: now.toLocaleTimeString("en-US", { hour12: false }),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <div className="sidebar-clock">{t.date}<br />New York, {t.time}</div>;
}

export default function TestPage() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [view, setView] = useState<"work" | "about">("about");

  const windowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slotEls = useRef<(HTMLDivElement | null)[]>([]); // outer — gets scale transform
  const cardEls = useRef<(HTMLDivElement | null)[]>([]); // inner — gets entrance animation
  const glowEls = useRef<(HTMLDivElement | null)[]>([]); // gradient overlay for peek cards
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
    const win = windowRef.current;
    if (!win) return;
    const visible = Math.ceil(win.clientHeight / CARD_SLOT) + 1;
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

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const max = Math.max(0, CARDS.length * CARD_SLOT - win.clientHeight);
      targetY.current = Math.max(0, Math.min(targetY.current + e.deltaY * 0.6, max));
    };
    win.addEventListener("wheel", onWheel, { passive: false });

    const loop = () => {
      currentY.current += (targetY.current - currentY.current) * 0.05;
      if (Math.abs(targetY.current - currentY.current) < 0.05) currentY.current = targetY.current;

      const containerH = win.clientHeight;

      CARDS.forEach((_, i) => {
        const slot = slotEls.current[i];
        if (!slot) return;

        const visualTop = i * CARD_SLOT - currentY.current + TRACK_OFFSET;
        const visualBottom = visualTop + CARD_HEIGHT;
        const excess = visualBottom - containerH;
        const foldProgress = Math.max(0, excess / CARD_HEIGHT);

        // Position each slot absolutely — track never moves
        slot.style.top = `${visualTop}px`;

        const scale = foldProgress <= 0 ? 1 : Math.max(0.52, 1 - foldProgress * 0.25);
        const t = foldProgress <= 0 ? 0 : -(foldProgress * CARD_HEIGHT);
        // Stagger each peek card slightly lower so N+2 peeks below N+1
        const peekExtra = foldProgress <= 0 ? 0 : Math.min(foldProgress * 10, 26);
        const tFinal = foldProgress <= 0 ? 0 : t + peekExtra;
        slot.style.transform = tFinal === 0 && scale === 1 ? "none" : `translateY(${tFinal}px) scale(${scale})`;
        slot.style.opacity = "1";

        // Glow overlay: fade in for peek cards, fade out when card becomes main
        const glow = glowEls.current[i];
        if (glow) glow.style.opacity = foldProgress > 0 ? "1" : "0";
        slot.style.zIndex = String(Math.max(1, CARDS.length - i));

        if (!seenCards.current.has(i) && (visualTop < containerH + 20 || foldProgress > 0)) {
          revealCard(i, 0);
        }
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      win.removeEventListener("wheel", onWheel);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = (index: number) => {
    const win = windowRef.current;
    if (!win) return;
    const max = Math.max(0, CARDS.length * CARD_SLOT - win.clientHeight);
    targetY.current = Math.max(0, Math.min(index * CARD_SLOT, max));
    setView("work");
    if (index === active) return;
    setFading(true);
    setTimeout(() => { setActive(index); setFading(false); }, 200);
  };

  const card = CARDS[active];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-topbar">
            <button className="sidebar-show-btn">Show all projects</button>
            <button className="sidebar-theme-toggle" />
          </div>
          <div className="sidebar-logo">Lvetica</div>
          <Clock />
        </div>
        <div className="sidebar-about" onClick={() => setView(view === "about" ? "work" : "about")} style={{ cursor: "pointer" }}>
          <div className="sidebar-about-label">About us</div>
          <div className="sidebar-about-text">
            Lvetica connects brands with top creators for influencer marketing, UGC, and social growth.
          </div>
        </div>

        <div className="carousel-window" ref={windowRef}>
          <div className="carousel-track" ref={trackRef}>
            {CARDS.map((c, i) => (
              <div
                key={c.id}
                ref={(el) => { slotEls.current[i] = el; }}
                className="card-slot"
              >
                <div
                  ref={(el) => { cardEls.current[i] = el; }}
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

      <main className="main">
        {view === "about" ? <AboutPage /> : (
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
      </main>
    </div>
  );
}
