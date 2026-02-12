"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* cursor */}
      <div className="mil-ball">
        <span className="mil-icon-1">
          <svg viewBox="0 0 128 128">
            <path d="M106.1,41.9c-1.2-1.2-3.1-1.2-4.2,0c-1.2,1.2-1.2,3.1,0,4.2L116.8,61H11.2l14.9-14.9c1.2-1.2,1.2-3.1,0-4.2c-1.2-1.2-3.1-1.2-4.2,0l-20,20c-1.2,1.2-1.2,3.1,0,4.2l20,20c0.6,0.6,1.4,0.9,2.1,0.9s1.5-0.3,2.1-0.9c1.2-1.2,1.2-3.1,0-4.2L11.2,67h105.5l-14.9,14.9c-1.2,1.2-1.2,3.1,0,4.2c0.6,0.6,1.4,0.9,2.1,0.9s1.5-0.3,2.1-0.9l20-20c1.2-1.2,1.2-3.1,0-4.2L106.1,41.9z" />
          </svg>
        </span>
        <div className="mil-more-text">More</div>
        <div className="mil-choose-text">Choose</div>
      </div>

      {/* menu */}
      <div className={`mil-menu-frame ${menuOpen ? "mil-active" : ""}`}>
        <div className="mil-frame-top">
          <Link href="/" className="mil-logo"><img src="/img/lvetica-logo.png" alt="lvetica" style={{ width: "90px" }} /></Link>
          <div
            className={`mil-menu-btn ${menuOpen ? "mil-active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            <span></span>
          </div>
        </div>
        <div className="container">
          <div className="mil-menu-content">
            <div className="row">
              <div className="col-xl-5">
                <nav className="mil-main-menu" id="swupMenu">
                  <ul>
                    <li className="mil-has-children mil-active">
                      <a href="#.">Homepage</a>
                      <ul className="mil-active">
                        <li><Link href="/" onClick={() => setMenuOpen(false)}>Landing page</Link></li>
                      </ul>
                    </li>
                    <li className="mil-has-children">
                      <a href="#.">Portfolio</a>
                      <ul>
                        <li><Link href="/portfolio" onClick={() => setMenuOpen(false)}>Portfolio</Link></li>
                      </ul>
                    </li>
                    <li className="mil-has-children">
                      <a href="#.">Services</a>
                      <ul>
                        <li><Link href="/services" onClick={() => setMenuOpen(false)}>Services List</Link></li>
                      </ul>
                    </li>
                    <li className="mil-has-children">
                      <a href="#.">Newsletter</a>
                      <ul>
                        <li><Link href="/blog" onClick={() => setMenuOpen(false)}>Blog List</Link></li>
                      </ul>
                    </li>
                    <li className="mil-has-children">
                      <a href="#.">Other pages</a>
                      <ul>
                        <li><Link href="/team" onClick={() => setMenuOpen(false)}>Team</Link></li>
                        <li><Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="col-xl-7">
                <div className="mil-menu-right-frame">
                  <div className="mil-animation-in">
                    <div className="mil-animation-frame">
                      <div className="mil-animation mil-position-1 mil-scale" data-value-1="2" data-value-2="2"></div>
                    </div>
                  </div>
                  <div className="mil-menu-right">
                    <div className="row">
                      <div className="col-lg-8 mil-mb-60">
                        <h6 className="mil-muted mil-mb-30">Projects</h6>
                        <ul className="mil-menu-list">
                          <li><Link href="/portfolio/interior-design-studio" className="mil-light-soft" onClick={() => setMenuOpen(false)}>Interior design studio</Link></li>
                          <li><Link href="/portfolio/home-security-camera" className="mil-light-soft" onClick={() => setMenuOpen(false)}>Home Security Camera</Link></li>
                          <li><Link href="/portfolio/kemia-honest-skincare" className="mil-light-soft" onClick={() => setMenuOpen(false)}>Kemia Honest Skincare</Link></li>
                          <li><Link href="/portfolio/cascade-of-lava" className="mil-light-soft" onClick={() => setMenuOpen(false)}>Cascade of Lava</Link></li>
                          <li><Link href="/portfolio/air-pro-by-molekule" className="mil-light-soft" onClick={() => setMenuOpen(false)}>Air Pro by Molekule</Link></li>
                          <li><Link href="/portfolio/tonys-chocolonely" className="mil-light-soft" onClick={() => setMenuOpen(false)}>Tony&apos;s Chocolonely</Link></li>
                        </ul>
                      </div>
                      <div className="col-lg-4 mil-mb-60">
                        <h6 className="mil-muted mil-mb-30">Useful links</h6>
                        <ul className="mil-menu-list">
                          <li><a href="#." className="mil-light-soft">Privacy Policy</a></li>
                          <li><a href="#." className="mil-light-soft">Terms and conditions</a></li>
                          <li><a href="#." className="mil-light-soft">Cookie Policy</a></li>
                          <li><a href="#." className="mil-light-soft">Careers</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="mil-divider mil-mb-60"></div>
                    <div className="row justify-content-between">
                      <div className="col-lg-4 mil-mb-60">
                        <h6 className="mil-muted mil-mb-30">Canada</h6>
                        <p className="mil-light-soft mil-up">71 South Los Carneros Road, California <span className="mil-no-wrap">+51 174 705 812</span></p>
                      </div>
                      <div className="col-lg-4 mil-mb-60">
                        <h6 className="mil-muted mil-mb-30">Germany</h6>
                        <p className="mil-light-soft">Leehove 40, 2678 MC De Lier, Netherlands <span className="mil-no-wrap">+31 174 705 811</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* curtain */}
      <div className="mil-curtain"></div>

      {/* frame */}
      <div className="mil-frame">
        <div className="mil-frame-top">
          <Link href="/" className="mil-logo"><img src="/img/lvetica-logo.png" alt="lvetica" style={{ width: "90px" }} /></Link>
          <div
            className={`mil-menu-btn ${menuOpen ? "mil-active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
          </div>
        </div>
        <div className="mil-frame-bottom">
          <div className="mil-current-page"></div>
          <div className="mil-back-to-top">
            <a href="#top" className="mil-link mil-dark mil-arrow-place">
              <span>Back to top</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
