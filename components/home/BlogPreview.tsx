import Link from "next/link";

export default function BlogPreview() {
  return (
    <section>
      <div className="container mil-p-120-60">
        <div className="row align-items-center mil-mb-30">
          <div className="col-lg-6 mil-mb-30">
            <h3 className="mil-up">Popular Publications:</h3>
          </div>
          <div className="col-lg-6 mil-mb-30">
            <div className="mil-adaptive-right mil-up">
              <Link href="/blog" className="mil-link mil-dark mil-arrow-place">
                <span>View all</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <Link href="/blog" className="mil-blog-card mil-mb-60">
              <div className="mil-cover-frame mil-up">
                <img src="/img/blog/1.jpg" alt="cover" />
              </div>
              <div className="mil-post-descr">
                <div className="mil-labels mil-up mil-mb-30">
                  <div className="mil-label mil-upper mil-accent">TECHNOLOGY</div>
                  <div className="mil-label mil-upper">may 24 2023</div>
                </div>
                <h4 className="mil-up mil-mb-30">How to Become a Graphic Designer in 10 Simple Steps</h4>
                <p className="mil-post-text mil-up mil-mb-30">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius sequi commodi dignissimos optio, beatae, eos necessitatibus nisi.
                </p>
                <div className="mil-link mil-dark mil-arrow-place mil-up">
                  <span>Read more</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-lg-6">
            <Link href="/blog" className="mil-blog-card mil-mb-60">
              <div className="mil-cover-frame mil-up">
                <img src="/img/blog/2.jpg" alt="cover" />
              </div>
              <div className="mil-post-descr">
                <div className="mil-labels mil-up mil-mb-30">
                  <div className="mil-label mil-upper mil-accent">TECHNOLOGY</div>
                  <div className="mil-label mil-upper">may 24 2023</div>
                </div>
                <h4 className="mil-up mil-mb-30">16 Best Graphic Design Online and Offline Courses</h4>
                <p className="mil-post-text mil-up mil-mb-30">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius sequi commodi dignissimos optio, beatae, eos necessitatibus nisi.
                </p>
                <div className="mil-link mil-dark mil-arrow-place mil-up">
                  <span>Read more</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
