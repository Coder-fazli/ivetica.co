"use client";

import { useRef, useState } from "react";

const CLIENT_TABS = ["All", "Art & Culture", "Tech", "Fashion", "Entertainment", "Hospitality", "Retail", "Finance", "Non-profit"];

const CLIENTS = [
  { name: "Nike", cat: "Fashion" }, { name: "Google", cat: "Tech" }, { name: "Spotify", cat: "Tech" },
  { name: "Apple", cat: "Tech" }, { name: "H&M", cat: "Fashion" }, { name: "Zara", cat: "Fashion" },
  { name: "MoMA", cat: "Art & Culture" }, { name: "Tate Modern", cat: "Art & Culture" }, { name: "Guggenheim", cat: "Art & Culture" },
  { name: "Marriott", cat: "Hospitality" }, { name: "W Hotels", cat: "Hospitality" }, { name: "Hilton", cat: "Hospitality" },
  { name: "Netflix", cat: "Entertainment" }, { name: "Twitch", cat: "Entertainment" }, { name: "Sundance", cat: "Entertainment" },
  { name: "Amazon", cat: "Tech" }, { name: "Meta", cat: "Tech" }, { name: "Discord", cat: "Tech" },
  { name: "Robinhood", cat: "Finance" }, { name: "Stripe", cat: "Finance" }, { name: "Coinbase", cat: "Finance" },
  { name: "Louis Vuitton", cat: "Fashion" }, { name: "Prada", cat: "Fashion" }, { name: "Gucci", cat: "Fashion" },
  { name: "Republic Records", cat: "Entertainment" }, { name: "Universal Music", cat: "Entertainment" },
  { name: "Whole Foods", cat: "Retail" }, { name: "Target", cat: "Retail" }, { name: "IKEA", cat: "Retail" },
  { name: "WWF", cat: "Non-profit" }, { name: "UNICEF", cat: "Non-profit" },
];

const OFFERINGS = [
  {
    name: "Strategy",
    desc: "We develop brand strategies that define how companies think, speak, and act. Our systems-driven approach ensures every decision is rooted in purpose and built for longevity.",
    services: "Brand Strategy, Market Positioning, Audience Research, Competitive Analysis, Brand Architecture",
  },
  {
    name: "Verbal Identity",
    desc: "We craft the language of a brand — naming, voice, tone, and messaging frameworks that give companies a distinct and consistent way to communicate across every touchpoint.",
    services: "Naming, Taglines, Brand Voice, Messaging Framework, Copywriting",
  },
  {
    name: "Visual Identity",
    desc: "We design how brands look and feel. As systems thinkers, we piece together the elements, tools, and behaviors necessary to create unique and memorable identities that flex across different touchpoints, contexts and audiences.",
    services: "Logo Design, Type Design, Photography Direction, Iconography Direction, Illustration Direction, Guidelines & Tooling",
  },
  {
    name: "Digital",
    desc: "We build digital experiences that bring brand systems to life — from websites and apps to interactive campaigns and digital products designed for scale.",
    services: "Web Design, UX/UI, Digital Campaigns, Motion Design, Prototyping",
  },
  {
    name: "Motion & 3D",
    desc: "We bring brands into motion through animation, 3D, and film — creating dynamic expressions that capture attention and communicate with depth and energy.",
    services: "Brand Animation, 3D Modeling & Rendering, Video Direction, Social Content, Title Sequences",
  },
];

const TEAM = [
  { name: "Felipe Rocha", role: "Founder & Creative Director", img: "/img/works/4.jpg", bio: "Felipe is a designer and creative director with over 18 years of experience shaping brands at the intersection of business, identity, and culture." },
  { name: "Leo Porto", role: "Founder & Creative Director", img: "/img/works/5.jpg", bio: "Leo is a NY-based Brazilian creative director. His practice centers on brand identity systems built to scale and pulse with culture." },
  { name: "Alessandro De Vecchi", role: "Senior Brand Designer", img: "/img/works/1.jpg", bio: "Brand designer with a decade of experience crafting visual identities for global clients across fashion, culture, and tech." },
  { name: "Anne Carmichael", role: "Producer", img: "/img/works/2.jpg", bio: "Seasoned producer keeping complex multi-market projects on track and creative teams aligned." },
  { name: "Ayo Fagbomi", role: "Senior Strategist", img: "/img/works/3.jpg", bio: "Strategic thinker with deep expertise in brand positioning, audience research, and cultural insight." },
  { name: "Celia Mahieu", role: "Senior Interactive Designer", img: "/img/works/6.jpg", bio: "Interactive designer creating digital experiences that feel intuitive, human, and brand-true." },
  { name: "Claren Walker", role: "Senior Strategist", img: "/img/works/1.jpg", bio: "Brand strategist focused on building lasting connections between brands and the cultures they operate in." },
  { name: "Clarissa Svalter", role: "Senior Project Manager", img: "/img/works/2.jpg", bio: "Project manager with a talent for navigating complexity across global, cross-functional teams." },
  { name: "Connor Bannister", role: "Senior Motion Designer", img: "/img/works/3.jpg", bio: "Motion designer bringing brands to life through dynamic animation, film, and immersive sequences." },
  { name: "David Fiz", role: "Associate Interactive Design Director", img: "/img/works/4.jpg", bio: "Interactive design director bridging strategy and execution across web, app, and campaign platforms." },
  { name: "Elisa Bartolini", role: "Associate Project Management Director", img: "/img/works/5.jpg", bio: "Director of project management ensuring studio excellence and client satisfaction across every engagement." },
  { name: "Andy Li", role: "Design Intern", img: "/img/works/6.jpg", bio: "Emerging designer bringing fresh perspectives and energy to the studio's identity and digital projects." },
];

export default function AboutPage() {
  const [clientTab, setClientTab] = useState("All");
  const [offeringTab, setOfferingTab] = useState("Visual Identity");
  const teamScrollRef = useRef<HTMLDivElement>(null);

  const offering = OFFERINGS.find((o) => o.name === offeringTab)!;

  const scrollTeam = (dir: "left" | "right") => {
    const el = teamScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? el.clientWidth : -el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="about-page">

      {/* Hero */}
      <img src="/img/works/1.jpg" alt="Our Studio" className="about-hero-img" />

      {/* Studio + Contact: same-height row */}
      <div className="about-top-row">
        <div className="about-card about-studio-card">
          <div className="about-section-label">Our Studio</div>
          <p className="about-studio-text">Lvetica connects brands with top creators for influencer marketing, UGC, and social growth.</p>
          <p className="about-studio-text">We help brands navigate complex challenges through work that is strategically rigorous, emotionally resonant, and beautifully designed.</p>
          <p className="about-studio-text">From large-scale rebrands to independent initiatives, our hard-working systems prove that craft and scale can coexist.</p>
        </div>

        <div className="about-card about-contact-card">
          <div className="about-section-label">Contact</div>
          <div className="about-contact-group">
            <div className="about-contact-label">New Business</div>
            <a className="about-contact-link" href="mailto:salam@lvetica.co">salam@lvetica.co</a>
          </div>
          <div className="about-contact-group">
            <div className="about-contact-label">Influencer Inquiries</div>
            <a className="about-contact-link" href="mailto:influencer@lvetica.co">influencer@lvetica.co</a>
          </div>
          <div className="about-contact-group">
            <div className="about-contact-label">Call Us</div>
            <a className="about-contact-link" href="tel:+994105050666">+994 10 505 06 66</a>
          </div>
        </div>
      </div>

      {/* Two-column layout: left content | right rail */}
      <div className="about-layout">

        {/* LEFT column */}
        <div className="about-left">

          {/* Clients */}
          <div className="about-card about-clients-card">
            <div className="about-section-label">Clients</div>
            <div className="about-tabs">
              {CLIENT_TABS.map((tab) => (
                <button key={tab} className={`about-tab${clientTab === tab ? " active" : ""}`} onClick={() => setClientTab(tab)}>{tab}</button>
              ))}
            </div>
            <div className="about-clients-grid">
              {CLIENTS.map((c) => {
                const active = clientTab === "All" || c.cat === clientTab;
                return (
                  <span key={c.name} className={`about-client-name${active ? " active" : ""}`}>{c.name}</span>
                );
              })}
            </div>
          </div>

          {/* Offerings */}
          <div className="about-card about-offerings-card">
            <div className="about-section-label">Offerings</div>
            <div className="about-tabs">
              {OFFERINGS.map((o) => (
                <button key={o.name} className={`about-tab${offeringTab === o.name ? " active" : ""}`} onClick={() => setOfferingTab(o.name)}>{o.name}</button>
              ))}
            </div>
            <p className="about-offering-desc">{offering.desc}</p>
            <div className="about-offering-services-label">Services</div>
            <div className="about-offering-services">{offering.services}</div>
          </div>

          {/* Team — horizontal scroll */}
          <div className="about-card about-team-card">
            <div className="about-team-header">
              <div className="about-section-label">Team</div>
              <div className="about-team-arrows">
                <button className="about-team-arrow" onClick={() => scrollTeam("left")}>←</button>
                <button className="about-team-arrow" onClick={() => scrollTeam("right")}>→</button>
              </div>
            </div>
            <div className="about-team-scroll" ref={teamScrollRef}>
              {TEAM.map((m) => (
                <div key={m.name} className="about-team-member">
                  <img src={m.img} alt={m.name} className="about-founder-img" />
                  <div className="about-founder-name">{m.name}</div>
                  <div className="about-founder-title">{m.role}</div>
                  <p className="about-founder-bio">{m.bio}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT rail */}
        <div className="about-right">

          <div className="about-card about-openings-card">
            <div className="about-section-label">Join Our Team</div>
            <a className="about-cv-btn" href="mailto:salam@lvetica.co?subject=CV Submission">Submit Your CV</a>
          </div>

          {/* Map */}
          <div className="about-card about-map-card">
            <div className="about-section-label">Our Location</div>
            <a
              className="about-map-wrap"
              href="https://www.google.com/maps/search/?api=1&query=Matbuat+Avenue+3141+Baku+Azerbaijan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open location in Google Maps"
            >
              <iframe
                className="about-map-iframe"
                src="https://www.openstreetmap.org/export/embed.html?bbox=49.855%2C40.402%2C49.876%2C40.413&layer=mapnik&marker=40.4073%2C49.8651"
                allowFullScreen
                loading="lazy"
              />
              <div className="about-map-overlay">
                <span className="about-map-open">Open in Maps ↗</span>
              </div>
            </a>
            <div className="about-map-address">pr 3141 Matbuat Avenue, Baku 1000</div>
          </div>

        </div>
      </div>
    </div>
  );
}
