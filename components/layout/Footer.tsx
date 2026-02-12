import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mil-dark-bg">
      <div className="mi-invert-fix">
        <div className="container mil-p-120-60">
          <div className="row justify-content-between">
            <div className="col-md-4 col-lg-4 mil-mb-60">
              <div className="mil-muted mil-logo mil-up mil-mb-30">Lvetica.</div>
              <p className="mil-light-soft mil-up mil-mb-30">Subscribe our newsletter:</p>
              <form className="mil-subscribe-form mil-up">
                <input type="text" placeholder="Enter our email" />
                <button type="submit" className="mil-button mil-icon-button-sm mil-arrow-place"></button>
              </form>
            </div>
            <div className="col-md-7 col-lg-6">
              <div className="row justify-content-end">
                <div className="col-md-6 col-lg-7">
                  <nav className="mil-footer-menu mil-mb-60">
                    <ul>
                      <li className="mil-up mil-active"><Link href="/">Home</Link></li>
                      <li className="mil-up"><Link href="/portfolio">Portfolio</Link></li>
                      <li className="mil-up"><Link href="/services">Services</Link></li>
                      <li className="mil-up"><Link href="/contact">Contact</Link></li>
                      <li className="mil-up"><Link href="/blog">Blog</Link></li>
                    </ul>
                  </nav>
                </div>
                <div className="col-md-6 col-lg-5">
                  <ul className="mil-menu-list mil-up mil-mb-60">
                    <li><a href="#." className="mil-light-soft">Privacy Policy</a></li>
                    <li><a href="#." className="mil-light-soft">Terms and conditions</a></li>
                    <li><a href="#." className="mil-light-soft">Cookie Policy</a></li>
                    <li><a href="#." className="mil-light-soft">Careers</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-between flex-sm-row-reverse">
            <div className="col-md-7 col-lg-6">
              <div className="row justify-content-between">
                <div className="col-md-6 col-lg-5 mil-mb-60">
                  <h6 className="mil-muted mil-up mil-mb-30">Canada</h6>
                  <p className="mil-light-soft mil-up">71 South Los Carneros Road, California <span className="mil-no-wrap">+51 174 705 812</span></p>
                </div>
                <div className="col-md-6 col-lg-5 mil-mb-60">
                  <h6 className="mil-muted mil-up mil-mb-30">Germany</h6>
                  <p className="mil-light-soft mil-up">Leehove 40, 2678 MC De Lier, Netherlands <span className="mil-no-wrap">+31 174 705 811</span></p>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-lg-6 mil-mb-60">
              <div className="mil-vert-between">
                <div className="mil-mb-30">
                  <ul className="mil-social-icons mil-up">
                    <li><a href="#." target="_blank" className="social-icon"><i className="far fa-circle"></i></a></li>
                    <li><a href="#." target="_blank" className="social-icon"><i className="far fa-circle"></i></a></li>
                    <li><a href="#." target="_blank" className="social-icon"><i className="far fa-circle"></i></a></li>
                    <li><a href="#." target="_blank" className="social-icon"><i className="far fa-circle"></i></a></li>
                  </ul>
                </div>
                <p className="mil-light-soft mil-up">&copy; Copyright 2024 - Lvetica. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
