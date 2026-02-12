import Link from "next/link";

export default function TeamSection() {
  return (
    <section>
      <div className="container mil-p-120-30">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-5 col-xl-4">
            <div className="mil-mb-90">
              <h2 className="mil-up mil-mb-60">Meet <br />Our Team</h2>
              <p className="mil-up mil-mb-30">
                We are talented individuals who are passionate about bringing ideas to life. With a diverse range of backgrounds and skill sets, we collaborate to produce effective solutions for our clients.
              </p>
              <p className="mil-up mil-mb-60">
                Together, our creative team is committed to delivering impactful work that exceeds expectations.
              </p>
              <div className="mil-up">
                <Link href="/team" className="mil-button mil-arrow-place mil-mb-60"><span>Read more</span></Link>
              </div>
              <h4 className="mil-up"><span className="mil-thin">We</span> delivering <br /><span className="mil-thin">exceptional</span> results.</h4>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mil-team-list">
              <div className="mil-lines-place"></div>
              <div className="row mil-mb-60">
                <div className="col-sm-6">
                  <div className="mil-team-card mil-up mil-mb-30">
                    <img src="/img/faces/1.jpg" alt="Team member" />
                    <div className="mil-description">
                      <div className="mil-secrc-text">
                        <h5 className="mil-muted mil-mb-5"><a href="#">Anna Oldman</a></h5>
                        <p className="mil-link mil-light-soft mil-mb-10">Art Director</p>
                        <ul className="mil-social-icons mil-center">
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-behance"></i></a></li>
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-dribbble"></i></a></li>
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-twitter"></i></a></li>
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-github"></i></a></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mil-team-card mil-up mil-mb-30">
                    <img src="/img/faces/3.jpg" alt="Team member" />
                    <div className="mil-description">
                      <div className="mil-secrc-text">
                        <h5 className="mil-muted mil-mb-5"><a href="#">Oscar Freeman</a></h5>
                        <p className="mil-link mil-light-soft mil-mb-10">Frontend Dev</p>
                        <ul className="mil-social-icons mil-center">
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-behance"></i></a></li>
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-dribbble"></i></a></li>
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-twitter"></i></a></li>
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-github"></i></a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <p className="mil-mobile-hidden mil-text-sm mil-mb-30" style={{ height: "30px" }}>
                    <span className="mil-accent">*</span> The founders of our agency
                  </p>

                  <div className="mil-team-card mil-up mil-mb-30">
                    <img src="/img/faces/2.jpg" alt="Team member" />
                    <div className="mil-description">
                      <div className="mil-secrc-text">
                        <h5 className="mil-muted mil-mb-5"><a href="#">Emma Newman</a></h5>
                        <p className="mil-link mil-light-soft mil-mb-10">Founder</p>
                        <ul className="mil-social-icons mil-center">
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-behance"></i></a></li>
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-dribbble"></i></a></li>
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-twitter"></i></a></li>
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-github"></i></a></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mil-team-card mil-up mil-mb-30">
                    <img src="/img/faces/4.jpg" alt="Team member" />
                    <div className="mil-description">
                      <div className="mil-secrc-text">
                        <h5 className="mil-muted mil-mb-5"><a href="#">Lisa Trueman</a></h5>
                        <p className="mil-link mil-light-soft mil-mb-10">UI/UX Designer</p>
                        <ul className="mil-social-icons mil-center">
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-behance"></i></a></li>
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-dribbble"></i></a></li>
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-twitter"></i></a></li>
                          <li><a href="#." target="_blank" className="social-icon"><i className="fab fa-github"></i></a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
