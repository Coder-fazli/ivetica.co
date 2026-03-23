"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Animations from "@/components/layout/Animations";
import { getContact, ContactData } from "@/actions/contact";

const DEFAULT_MAP = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1396.5769090312324!2d-73.6519672!3d45.5673453!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91f8abc30e0ff%3A0xfc6d9cbb49022e9c!2sManoir%20Saint-Joseph!5e0!3m2!1sen!2sua!4v1685485811069!5m2!1sen!2sua";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [contact, setContact] = useState<ContactData>({ email: "hello@lvetica.co", phone: "+1 514 000 0000", location: "Montreal, Canada", mapEmbed: DEFAULT_MAP });

  useEffect(() => {
    getContact().then(setContact);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire to email service
    setSent(true);
  }

  return (
    <div className="mil-wrapper" id="top">
      <Animations />
      <Header />

      <div className="mil-progress-track">
        <div className="mil-progress"></div>
      </div>

      <div className="mil-content">
        <div id="swupMain" className="mil-main-transition">

          {/* banner — centered, matches contact.html exactly */}
          <div className="mil-inner-banner mil-p-0-120">
            <div className="mil-banner-content mil-center mil-up">
              <div className="container">
                <ul className="mil-breadcrumbs mil-center mil-mb-60">
                  <li><Link href="/">Homepage</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                </ul>
                <h1 className="mil-mb-60">Get in <span className="mil-thin">touch!</span></h1>
                <a href="#contact" className="mil-link mil-dark mil-arrow-place mil-down-arrow">
                  <span>Send message</span>
                </a>
              </div>
            </div>
          </div>

          {/* can we talk — contact info section */}
          <section>
            <div className="container mil-p-120-30">
              <div className="row justify-content-between align-items-center">
                <div className="col-lg-4 mil-mb-60">
                  <h2 className="mil-up mil-mb-30">Can we <span className="mil-thin">talk?</span></h2>
                  <p className="mil-up mil-mb-30">
                    We&apos;re always open to discussing new projects, creative ideas or opportunities to be part of your vision.
                  </p>
                </div>
                <div className="col-lg-7">
                  <div className="row">
                    <div className="col-md-4 mil-mb-30">
                      <div className="mil-up">
                        <p className="mil-text-sm mil-upper mil-accent mil-mb-15" style={{ letterSpacing: "2px", fontSize: "10px", fontWeight: 600 }}>Email</p>
                        <h6>{contact.email}</h6>
                      </div>
                    </div>
                    <div className="col-md-4 mil-mb-30">
                      <div className="mil-up">
                        <p className="mil-text-sm mil-upper mil-accent mil-mb-15" style={{ letterSpacing: "2px", fontSize: "10px", fontWeight: 600 }}>Phone</p>
                        <h6>{contact.phone}</h6>
                      </div>
                    </div>
                    <div className="col-md-4 mil-mb-30">
                      <div className="mil-up">
                        <p className="mil-text-sm mil-upper mil-accent mil-mb-15" style={{ letterSpacing: "2px", fontSize: "10px", fontWeight: 600 }}>Location</p>
                        <h6>{contact.location}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* contact form — matches contact.html section exactly */}
          <section id="contact">
            <div className="container mil-p-60-90">
              <h3 className="mil-center mil-up mil-mb-60">Let&apos;s <span className="mil-thin">Talk</span></h3>

              {sent ? (
                <div className="mil-center mil-up">
                  <h4 className="mil-mb-30">Message sent!</h4>
                  <p>We&apos;ll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form className="row align-items-center" onSubmit={handleSubmit}>
                  <div className="col-lg-6 mil-up">
                    <input
                      type="text"
                      placeholder="What's your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-lg-6 mil-up">
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-lg-12 mil-up">
                    <textarea
                      placeholder="Tell us about your project"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-lg-8">
                    <p className="mil-up mil-mb-30">
                      <span className="mil-accent">*</span> We promise not to disclose your personal information to third parties.
                    </p>
                  </div>
                  <div className="col-lg-4">
                    <div className="mil-adaptive-right mil-up mil-mb-30">
                      <button type="submit" className="mil-button mil-arrow-place">
                        <span>Send message</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* map — below form */}
          <div className="mil-map-frame mil-up">
            <div className="mil-map">
              <iframe
                src={contact.mapEmbed || DEFAULT_MAP}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <Footer />

          {/* hidden elements */}
          <div className="mil-hidden-elements">
            <div className="mil-dodecahedron">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="mil-pentagon">
                  <div></div><div></div><div></div><div></div><div></div>
                </div>
              ))}
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mil-arrow">
              <path d="M 14 5.3417969 C 13.744125 5.3417969 13.487969 5.4412187 13.292969 5.6367188 L 13.207031 5.7226562 C 12.816031 6.1136563 12.816031 6.7467188 13.207031 7.1367188 L 17.070312 11 L 4 11 C 3.448 11 3 11.448 3 12 C 3 12.552 3.448 13 4 13 L 17.070312 13 L 13.207031 16.863281 C 12.816031 17.254281 12.816031 17.887344 13.207031 18.277344 L 13.292969 18.363281 C 13.683969 18.754281 14.317031 18.754281 14.707031 18.363281 L 20.363281 12.707031 C 20.754281 12.316031 20.754281 11.682969 20.363281 11.292969 L 14.707031 5.6367188 C 14.511531 5.4412187 14.255875 5.3417969 14 5.3417969 z" />
            </svg>
            <svg width="250" viewBox="0 0 300 1404" fill="none" xmlns="http://www.w3.org/2000/svg" className="mil-lines">
              <path fillRule="evenodd" clipRule="evenodd" d="M1 892L1 941H299V892C299 809.71 232.29 743 150 743C67.7096 743 1 809.71 1 892ZM0 942H300V892C300 809.157 232.843 742 150 742C67.1573 742 0 809.157 0 892L0 942Z" className="mil-move" />
              <path fillRule="evenodd" clipRule="evenodd" d="M299 146V97L1 97V146C1 228.29 67.7096 295 150 295C232.29 295 299 228.29 299 146ZM300 96L0 96V146C0 228.843 67.1573 296 150 296C232.843 296 300 228.843 300 146V96Z" className="mil-move" />
              <path fillRule="evenodd" clipRule="evenodd" d="M299 1H1V1403H299V1ZM0 0V1404H300V0H0Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M150 -4.37115e-08L150 1404L149 1404L149 0L150 -4.37115e-08Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M150 1324C232.29 1324 299 1257.29 299 1175C299 1092.71 232.29 1026 150 1026C67.7096 1026 1 1092.71 1 1175C1 1257.29 67.7096 1324 150 1324ZM150 1325C232.843 1325 300 1257.84 300 1175C300 1092.16 232.843 1025 150 1025C67.1573 1025 0 1092.16 0 1175C0 1257.84 67.1573 1325 150 1325Z" className="mil-move" />
              <path fillRule="evenodd" clipRule="evenodd" d="M300 1175H0V1174H300V1175Z" className="mil-move" />
              <path fillRule="evenodd" clipRule="evenodd" d="M150 678C232.29 678 299 611.29 299 529C299 446.71 232.29 380 150 380C67.7096 380 1 446.71 1 529C1 611.29 67.7096 678 150 678ZM150 679C232.843 679 300 611.843 300 529C300 446.157 232.843 379 150 379C67.1573 379 0 446.157 0 529C0 611.843 67.1573 679 150 679Z" className="mil-move" />
              <path fillRule="evenodd" clipRule="evenodd" d="M299 380H1V678H299V380ZM0 379V679H300V379H0Z" className="mil-move" />
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}
