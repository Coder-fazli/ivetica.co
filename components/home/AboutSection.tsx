import { AboutType } from "@/types";

export default function AboutSection({ about }: { about?: AboutType }) {
  return (
    <section id="about">
      <div className="container mil-p-120-30">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-6 col-xl-5">
            <div className="mil-mb-90">
              <h2 className="mil-up mil-mb-60"
                dangerouslySetInnerHTML={{ __html: about?.title || ""
                 }} />
              <p className="mil-up mil-mb-30">
                 {about?.description1}
              </p>
              <p className="mil-up mil-mb-60">
                   {about?.description2}
              </p>
              <div className="mil-about-quote">
                <div className="mil-avatar mil-up">
                  <img src={about?.founderAvatar || "/img/faces/customers/2.jpg"} alt="Founder" />
                </div>
                 <h6 className="mil-quote mil-up"
  dangerouslySetInnerHTML={{ __html: about?.founderQuote
  || "" }} />
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="mil-about-photo mil-mb-90">
              <div className="mil-lines-place"></div>
              <div className="mil-up mil-img-frame" style={{ paddingBottom: "160%" }}>
                <img src={about?.image || "/img/photo/1.jpg"  }alt="img" className="mil-scale" data-value-1="1" data-value-2="1.2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
