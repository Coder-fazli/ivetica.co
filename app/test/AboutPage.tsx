"use client";

import { useRef, useState, useEffect } from "react";
import { getAbout, TeamMember, Offering } from "@/actions/about";
import { getClients, ClientType } from "@/actions/clients";
import { getContact, ContactData } from "@/actions/contact";

export default function AboutPage() {
  const [clientTab, setClientTab] = useState("All");
  const [clientTabs, setClientTabs] = useState<string[]>(["All"]);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [offeringTab, setOfferingTab] = useState("");
  const [socialTiktok, setSocialTiktok] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [contact, setContact] = useState<ContactData | null>(null);
  const [studioTitle, setStudioTitle] = useState("");
  const [studioTitleColor, setStudioTitleColor] = useState("");
  const [studioText1, setStudioText1] = useState("");
  const [studioText2, setStudioText2] = useState("");
  const [studioText3, setStudioText3] = useState("");
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
      setStudioTitle(d.studioTitle || "Our Studio");
      setStudioTitleColor(d.studioTitleColor || "");
      setStudioText1(d.studioText1 || "");
      setStudioText2(d.studioText2 || "");
      setStudioText3(d.studioText3 || "");
    });
    getClients().then(data => {
      setClients(data);
      const allTags = new Set<string>();
      data.forEach(c => c.tags?.forEach(t => allTags.add(t)));
      setClientTabs(["All", ...Array.from(allTags).sort()]);
    });
    getContact().then(setContact);
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
        {(studioTitle || studioText1 || studioText2 || studioText3) && (
          <div className="about-card about-studio-card">
            <div
              className="about-section-label"
              style={{
                ...(studioTitleColor ? { color: studioTitleColor } : {}),
                ...(!studioText1 && !studioText2 && !studioText3 ? { marginBottom: 0 } : {}),
              }}
            >
              {studioTitle || "Our Studio"}
            </div>
            {studioText1 && <p className="about-studio-text">{studioText1}</p>}
            {studioText2 && <p className="about-studio-text">{studioText2}</p>}
            {studioText3 && <p className="about-studio-text">{studioText3}</p>}
          </div>
        )}

        <div className="about-card about-contact-card">
          <div className="about-section-label">Contact</div>
          {contact?.emailBusiness && (
            <div className="about-contact-group">
              <div className="about-contact-label">New Business</div>
              <a className="about-contact-link" href={`mailto:${contact.emailBusiness}`}>{contact.emailBusiness}</a>
            </div>
          )}
          {contact?.emailInfluencer && (
            <div className="about-contact-group">
              <div className="about-contact-label">Influencer Inquiries</div>
              <a className="about-contact-link" href={`mailto:${contact.emailInfluencer}`}>{contact.emailInfluencer}</a>
            </div>
          )}
          {contact?.phone && (
            <div className="about-contact-group">
              <div className="about-contact-label">Call Us</div>
              <a className="about-contact-link" href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
            </div>
          )}
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
              {clientTabs.map((tab) => (
                <button key={tab} className={`about-tab${clientTab === tab ? " active" : ""}`} onClick={() => setClientTab(tab)}>{tab}</button>
              ))}
            </div>
            <div className="about-clients-grid">
              {clients.map((c) => {
                const active = clientTab === "All" || (c.tags && c.tags.includes(clientTab));
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
            <a className="about-cv-btn" href={`mailto:${contact?.emailBusiness || "salam@lvetica.co"}?subject=CV Submission`}>Submit Your CV</a>
          </div>

          {/* Map */}
          {(contact?.mapEmbed || contact?.location || contact?.mapCoverImage) && (
            <div className="about-card about-map-card" style={contact.mapCoverImage ? { position: "relative", overflow: "hidden", padding: 0 } : undefined}>
              {contact.mapCoverImage ? (
                <a
                  href={contact.mapEmbed ? contact.mapEmbed.replace("google.com/maps/embed", "google.com/maps") : `https://maps.google.com/?q=${encodeURIComponent(contact.location || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", position: "relative" }}
                >
                  <img
                    src={contact.mapCoverImage}
                    alt="Location"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 180 }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", top: 14, left: 16 }}>
                    <div className="about-section-label" style={{ margin: 0 }}>Our Location</div>
                  </div>
                  {contact.location && (
                    <div className="about-map-address" style={{ position: "absolute", bottom: 14, left: 16, right: 16, margin: 0 }}>{contact.location}</div>
                  )}
                </a>
              ) : (
                <>
                  <div className="about-section-label">Our Location</div>
                  {contact.mapEmbed && (
                    <div className="about-map-wrap" style={{ cursor: "default" }}>
                      <iframe
                        className="about-map-iframe"
                        src={contact.mapEmbed}
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  )}
                  {contact.location && (
                    <div className="about-map-address">{contact.location}</div>
                  )}
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
