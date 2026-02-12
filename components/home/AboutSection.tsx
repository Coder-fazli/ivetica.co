export default function AboutSection() {
  return (
    <section id="about">
      <div className="container mil-p-120-30">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-6 col-xl-5">
            <div className="mil-mb-90">
              <h2 className="mil-up mil-mb-60">
                Discover <br />Our <span className="mil-thin">Studio</span>
              </h2>
              <p className="mil-up mil-mb-30">
                At our design studio, we are a collective of talented individuals ignited by our unwavering passion for transforming ideas into reality. With a harmonious blend of diverse backgrounds and a vast array of skill sets, we join forces to create compelling solutions for our esteemed clients.
              </p>
              <p className="mil-up mil-mb-60">
                Collaboration is at the heart of what we do. Our team thrives on the synergy that arises when unique perspectives converge, fostering an environment of boundless creativity. By harnessing our collective expertise, we produce extraordinary results that consistently surpass expectations.
              </p>
              <div className="mil-about-quote">
                <div className="mil-avatar mil-up">
                  <img src="/img/faces/customers/2.jpg" alt="Founder" />
                </div>
                <h6 className="mil-quote mil-up">
                  Passionately Creating <span className="mil-thin">Design Wonders:</span> Unleashing <span className="mil-thin">Boundless Creativity</span>
                </h6>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="mil-about-photo mil-mb-90">
              <div className="mil-lines-place"></div>
              <div className="mil-up mil-img-frame" style={{ paddingBottom: "160%" }}>
                <img src="/img/photo/1.jpg" alt="img" className="mil-scale" data-value-1="1" data-value-2="1.2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
