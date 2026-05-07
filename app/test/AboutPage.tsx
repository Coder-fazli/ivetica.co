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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.7a2.85 2.85 0 1 1-5.92-2.81v3.73a6.61 6.61 0 1 0 9.61 6.05V9.91a8.26 8.26 0 0 0 3.16 1.62z"/>
                    </svg>
                  </a>
                )}
                {socialFacebook && (
                  <a href={socialFacebook} target="_blank" rel="noopener noreferrer" title="Facebook" style={{ color: "#efefef", opacity: 0.7, transition: "opacity 0.2s", display: "flex", alignItems: "center" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4V9.5c0-.896.168-1.5 1.5-1.5h2.5V3.363c-.468-.07-2.07-.2-3.936-.2-3.94 0-6.564 2.409-6.564 6.834V8z"/>
                    </svg>
                  </a>
                )}
                {socialInstagram && (
                  <a href={socialInstagram} target="_blank" rel="noopener noreferrer" title="Instagram" style={{ color: "#efefef", opacity: 0.7, transition: "opacity 0.2s", display: "flex", alignItems: "center" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
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
