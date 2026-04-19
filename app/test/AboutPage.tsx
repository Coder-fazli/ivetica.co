"use client";

import { useState } from "react";

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
  { name: "Alessandro De Vecchi", role: "Senior Brand Designer", location: "Milan" },
  { name: "Andy Li", role: "Design Intern", location: "Baltimore" },
  { name: "Anne Carmichael", role: "Producer", location: "New York" },
  { name: "Ayo Fagbomi", role: "Senior Strategist", location: "London" },
  { name: "Celia Mahieu", role: "Senior Interactive Designer", location: "Paris" },
  { name: "Claren Walker", role: "Senior Strategist", location: "New York" },
  { name: "Clarissa Svalter", role: "Senior Project Manager", location: "Rio de Janeiro" },
  { name: "Connor Bannister", role: "Senior Motion Designer", location: "London" },
  { name: "David Fiz", role: "Associate Interactive Design Director", location: "London" },
  { name: "Elisa Bartolini", role: "Associate Project Management Director", location: "Milan" },
  { name: "Felipe Rocha", role: "Founder & Creative Director", location: "New York" },
  { name: "Leo Porto", role: "Founder & Creative Director", location: "New York" },
];

const OPENINGS = [
  { title: "Senior Motion Designer", location: "New York, USA" },
  { title: "Senior Brand Designer", location: "New York, USA" },
  { title: "Senior Interactive Designer", location: "New York, USA" },
  { title: "Senior Project Manager", location: "New York, USA" },
  { title: "Senior Strategist", location: "New York, USA" },
  { title: "Mid-Senior PR & Engagement Manager", location: "New York, USA" },
];

export default function AboutPage() {
  const [clientTab, setClientTab] = useState("All");
  const [offeringTab, setOfferingTab] = useState("Visual Identity");

  const offering = OFFERINGS.find((o) => o.name === offeringTab)!;

  return (
    <div className="about-page">

      {/* Hero */}
      <img src="/img/works/1.jpg" alt="Our Studio" className="about-hero-img" />

      {/* Two-column layout: left content | right rail */}
      <div className="about-layout">

        {/* LEFT column */}
        <div className="about-left">

          {/* Studio */}
          <div className="about-card about-studio-card">
            <div className="about-section-label">Our Studio</div>
            <p className="about-studio-text">Lvetica connects brands with top creators for influencer marketing, UGC, and social growth.</p>
            <p className="about-studio-text">We help brands navigate complex challenges through work that is strategically rigorous, emotionally resonant, and beautifully designed.</p>
            <p className="about-studio-text">From large-scale rebrands to independent initiatives, our hard-working systems prove that craft and scale can coexist.</p>
          </div>

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

          {/* Offices */}
          <div className="about-two-col">
            {[
              { city: "New York", addr: "75 Stewart Ave Unit 315", sub: "Brooklyn, NY", img: "/img/works/2.jpg" },
              { city: "London", addr: "436 Essex Rd Unit 221", sub: "London, UK", img: "/img/works/3.jpg" },
            ].map((o) => (
              <div key={o.city} className="about-card about-office-card">
                <img src={o.img} alt={o.city} className="about-office-img" />
                <div className="about-office-info">
                  <div className="about-office-city">{o.city}</div>
                  <div className="about-office-addr">{o.addr}</div>
                  <div className="about-office-addr">{o.sub}</div>
                </div>
              </div>
            ))}
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

          {/* Founders */}
          <div className="about-two-col">
            {[
              { name: "Felipe Rocha", title: "Founder & Creative Director", img: "/img/works/4.jpg", bio: "Felipe Rocha is a designer and creative director with over 18 years of experience shaping brands at the intersection of business, identity, and culture. His work spans global commercial and cultural contexts, partnering with companies and institutions to build brands that resonate at scale." },
              { name: "Leo Porto", title: "Founder & Creative Director", img: "/img/works/5.jpg", bio: "Leo Porto is a NY-based Brazilian creative director and co-founder of Lvetica. His practice centers on brand identity systems, building robust frameworks that are both rigorous and expressive — designed to scale and pulse with culture." },
            ].map((f) => (
              <div key={f.name} className="about-card about-founder-card">
                <img src={f.img} alt={f.name} className="about-founder-img" />
                <div className="about-founder-name">{f.name}</div>
                <div className="about-founder-title">{f.title}</div>
                <p className="about-founder-bio">{f.bio}</p>
              </div>
            ))}
          </div>

          {/* Team */}
          <div className="about-card about-team-card">
            <div className="about-section-label">Team</div>
            {TEAM.map((m) => (
              <div key={m.name} className="about-team-row">
                <span className="about-team-name">{m.name}</span>
                <span className="about-team-role">{m.role}</span>
                <span className="about-team-location">{m.location}</span>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT rail */}
        <div className="about-right">

          <div className="about-card about-contact-card">
            <div className="about-section-label">Contact</div>
            <div className="about-contact-group">
              <div className="about-contact-label">New Business</div>
              <a className="about-contact-link" href="mailto:business@lvetica.co">business@lvetica.co</a>
            </div>
            <div className="about-contact-group">
              <div className="about-contact-label">Media Inquiries</div>
              <a className="about-contact-link" href="mailto:press@lvetica.co">press@lvetica.co</a>
            </div>
            <div className="about-contact-group">
              <div className="about-contact-label">General Inquiries</div>
              <a className="about-contact-link" href="mailto:info@lvetica.co">info@lvetica.co</a>
            </div>
            <div className="about-contact-group">
              <div className="about-contact-label">Social</div>
              <a className="about-contact-link" href="#">Instagram</a>
              <span className="about-contact-sep"> / </span>
              <a className="about-contact-link" href="#">LinkedIn</a>
            </div>
          </div>

          <div className="about-card about-openings-card">
            <div className="about-section-label">Current Openings</div>
            {OPENINGS.map((o) => (
              <div key={o.title} className="about-opening-row">
                <span className="about-opening-title">{o.title}</span>
                <span className="about-opening-location">{o.location}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
