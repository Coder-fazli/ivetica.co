"use client";

import { useRef, useState, useEffect } from "react";
import { getAbout, TeamMember, Offering } from "@/actions/about";

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

export default function AboutPage() {
  const [clientTab, setClientTab] = useState("All");
  const [offeringTab, setOfferingTab] = useState("");
  const [socialTiktok, setSocialTiktok] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const teamScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => {
        setSocialTiktok(d.socialTiktok || "");
        setSocialFacebook(d.socialFacebook || "");
        setSocialInstagram(d.socialInstagram || "");
      });
    getAbout().then(d => {
      setTeam(d.team || []);
      setOfferings(d.offerings || []);
      if (d.offerings && d.offerings.length > 0) {
        setOfferingTab(d.offerings[0].name);
      }
    });
  }, []);

  const offering = offerings.find((o) => o.name === offeringTab);

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
          {(socialTiktok || socialFacebook || socialInstagram) && (
            <div className="about-contact-group">
              <div className="about-contact-label">Follow</div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                {socialTiktok && (
                  <a href={socialTiktok} target="_blank" rel="noopener noreferrer" title="TikTok" style={{ color: "#efefef", opacity: 0.7, transition: "opacity 0.2s", display: "flex", alignItems: "center" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 12a4 4 0 1 0 4 4v-7a6.04 6.04 0 0 0 3.27-.93" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
                {socialFacebook && (
                  <a href={socialFacebook} target="_blank" rel="noopener noreferrer" title="Facebook" style={{ color: "#efefef", opacity: 0.7, transition: "opacity 0.2s", display: "flex", alignItems: "center" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 0 1 1-1h3z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
                {socialInstagram && (
                  <a href={socialInstagram} target="_blank" rel="noopener noreferrer" title="Instagram" style={{ color: "#efefef", opacity: 0.7, transition: "opacity 0.2s", display: "flex", alignItems: "center" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}
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
          {offerings.length > 0 && (
            <div className="about-card about-offerings-card">
              <div className="about-section-label">Offerings</div>
              <div className="about-tabs">
                {offerings.map((o) => (
                  <button key={o.name} className={`about-tab${offeringTab === o.name ? " active" : ""}`} onClick={() => setOfferingTab(o.name)}>{o.name}</button>
                ))}
              </div>
              {offering && (
                <>
                  <p className="about-offering-desc">{offering.desc}</p>
                  <div className="about-offering-services-label">Services</div>
                  <div className="about-offering-services">{offering.services}</div>
                </>
              )}
            </div>
          )}

          {/* Team — horizontal scroll */}
          {team.length > 0 && (
            <div className="about-card about-team-card">
              <div className="about-team-header">
                <div className="about-section-label">Team</div>
                <div className="about-team-arrows">
                  <button className="about-team-arrow" onClick={() => scrollTeam("left")}>←</button>
                  <button className="about-team-arrow" onClick={() => scrollTeam("right")}>→</button>
                </div>
              </div>
              <div className="about-team-scroll" ref={teamScrollRef}>
                {team.map((m, i) => (
                  <div key={`${m.name}-${i}`} className="about-team-member">
                    <img src={m.photo} alt={m.name} className="about-founder-img" />
                    <div className="about-founder-name">{m.name}</div>
                    <div className="about-founder-title">{m.role}</div>
                    {m.bio && <p className="about-founder-bio">{m.bio}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

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
