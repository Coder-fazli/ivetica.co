"use client";

import { useEffect, useRef, useState } from "react";
import { getWorks } from "@/actions/works";
import AboutPage from "./AboutPage";
import WorkDetail from "./WorkDetail";

const CARD_SLOT_DESKTOP = 110;
const CARD_SLOT_MOBILE = 84;
const CARD_HEIGHT = 100;
const TRACK_OFFSET = 2;
const MOBILE_EXTRA = 2;   // hero (0, hidden) + about (1)
const MOBILE_HERO_SLOT = 0; // hero slot is hidden — sidebar-top is fixed header

// Top position of a mobile slot given its index
const mobileSlotTop = (idx: number) =>
  idx === 0 ? 0 : MOBILE_HERO_SLOT + (idx - 1) * CARD_SLOT_MOBILE;

type Card = { id: number; name: string; desc: string; img: string; slug: string };

const mobileTotalH = (count: number) =>
  MOBILE_HERO_SLOT + (MOBILE_EXTRA - 1 + count) * CARD_SLOT_MOBILE;


export default function PortfolioApp({ initialCards = [], initialSlug }: { initialCards?: Card[]; initialSlug?: string }) {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [view, setView] = useState<"home" | "work" | "about">("home");
  const [mainOpen, setMainOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [detailKey, setDetailKey] = useState(0);
  const [logoUrl, setLogoUrl] = useState("/img/lvetica-logo.png");
  const [logoDark, setLogoDark] = useState<string | null>(null);
  const [logoLight, setLogoLight] = useState<string | null>(null);

  useEffect(() => {
    const dark = document.body.dataset.logo;
    const light = document.body.dataset.logoLight;
    if (dark) setLogoDark(dark);
    if (light) setLogoLight(light);
    setLogoUrl(dark || "/img/lvetica-logo.png");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light-theme", theme === "light");
    if (theme === "light" && logoLight) {
      setLogoUrl(logoLight);
    } else if (theme === "dark" && logoDark) {
      setLogoUrl(logoDark);
    }
  }, [theme, logoDark, logoLight]);
  const cardsRef = useRef<Card[]>(initialCards);

  const fetchCards = () => {
    getWorks().then(works => {
      const mapped: Card[] = works.map((w, i) => ({
        id: i,
        name: w.title,
        desc: w.description || w.client,
        img: w.thumbnail || "",
        slug: w.slug,
      }));
      setCards(mapped);
      cardsRef.current = mapped;
    });
  };

  useEffect(() => {
    cardsRef.current = initialCards;
    fetchCards();
    const onFocus = () => { fetchCards(); setDetailKey(k => k + 1); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-open work if initialSlug provided (e.g. direct URL /slug)
  useEffect(() => {
    if (!initialSlug || cards.length === 0) return;
    const idx = cards.findIndex(c => c.slug === initialSlug);
    if (idx !== -1) {
      setActive(idx);
      setView("work");
      setMainOpen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSlug, cards.length]);

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
    if (cards.length === 0) return;
    const win = windowRef.current;
    if (!win) return;
    const isMobile = window.innerWidth <= 768;
    const slot = isMobile ? CARD_SLOT_MOBILE : CARD_SLOT_DESKTOP;
    const visible = Math.ceil(win.clientHeight / slot) + 1;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      for (let i = 0; i < Math.min(visible, cards.length); i++) {
        revealCard(i, i * 65);
      }
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

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
        ? Math.max(0, mobileTotalH(cardsRef.current.length) - h)
        : Math.max(0, cardsRef.current.length * CARD_SLOT_DESKTOP - h);
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
      const totalSlots = isMobile ? MOBILE_EXTRA + cardsRef.current.length : cardsRef.current.length;

      // Mobile-only slots: hero (0, hidden/skipped) and about (1)
      if (isMobile) {
        for (let mi = 0; mi < MOBILE_EXTRA; mi++) {
          if (mi === 0) continue; // hero hidden — sidebar-top is fixed header
          const slot = mobileSlotEls.current[mi];
          if (!slot) continue;

          const cardH = CARD_HEIGHT;
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
      cardsRef.current.forEach((_, i) => {
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
        slot.style.zIndex = String(Math.max(1, cardsRef.current.length - i));

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
      ? Math.max(0, mobileTotalH(cardsRef.current.length) - win.clientHeight)
      : Math.max(0, cardsRef.current.length * CARD_SLOT_DESKTOP - win.clientHeight);
    targetY.current = Math.max(0, Math.min(top, max));
    setView("work");
    setMainOpen(true);
    const slug = cardsRef.current[index]?.slug;
    if (slug) window.history.pushState(null, "", `/${slug}`);
    if (index === active) return;
    setFading(true);
    setTimeout(() => { setActive(index); setFading(false); }, 200);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const card = cards[active];

  return (
    <div className={`layout${theme === "light" ? " light" : ""}`}>
      <aside className="sidebar">

        {/* Desktop-only top section */}
        <div className="sidebar-top">
          <div className="sidebar-topbar">
            <button className="sidebar-show-btn" onClick={() => window.location.href = "/all"}>Show all projects</button>
            <button className={`sidebar-theme-toggle${theme === "light" ? " is-light" : ""}`} onClick={toggleTheme} />
          </div>
          <button onClick={() => { setView("home"); setMainOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <img src={logoUrl} alt="Lvetica" className="sidebar-logo-img" />
          </button>
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
                  <button className="sidebar-show-btn" onClick={() => window.location.href = "/all"}>Show all projects</button>
                  <button
                    className={`sidebar-theme-toggle${theme === "light" ? " is-light" : ""}`}
                    onClick={toggleTheme}
                  />
                </div>
                <button onClick={() => { setView("home"); setMainOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <img src={logoUrl} alt="Lvetica" className="sidebar-logo-img" />
                </button>
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
            {cards.map((c, i) => (
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
                  <div ref={(el) => { glowEls.current[i] = el; }} className="proj-card-glow" style={c.img ? { backgroundImage: `url(${c.img})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} />
                  {c.img && <img src={c.img} alt={c.name} className="proj-card-icon" />}
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
        <button className="main-back-btn" onClick={() => { setMainOpen(false); setView("home"); window.history.pushState(null, "", "/"); }}>← Back</button>
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
            card ? <WorkDetail key={`${card.slug}-${detailKey}`} slug={card.slug} fading={fading} /> : null
          )}
        </div>
      </main>
    </div>
  );
}
