import Link from "next/link";
import { HeroType } from "@/types";


export default function HeroBanner({ hero }: { hero?: HeroType }){
  return (
    <section className="mil-banner mil-dark-bg">
      <div className="mi-invert-fix">
        <div className="mil-animation-frame">
          <div className="mil-animation mil-position-1 mil-scale" data-value-1="7" data-value-2="1.6"></div>
          <div className="mil-animation mil-position-2 mil-scale" data-value-1="4" data-value-2="1"></div>
          <div className="mil-animation mil-position-3 mil-scale" data-value-1="1.2" data-value-2=".1"></div>
        </div>

        <div className="mil-gradient"></div>

        <div className="container">
          <div className="mil-banner-content mil-up">
            <h1 className="mil-muted mil-mb-60"
  dangerouslySetInnerHTML={{ __html: hero?.headline || ""
   }} />
            <div className="row">
              <div className="col-md-7 col-lg-5">
                <p className="mil-light-soft mil-mb-60">
                  {hero?.subtitle}
                </p>
              </div>
            </div>

            <Link href={hero?.cta1Link || "/services"} className="mil-button mil-arrow-place mil-btn-space">
              <span>{hero?.cta1Text || "What we do"}</span>
            </Link>

            <Link href={hero?.cta2Link || "/portfolio"} className="mil-link mil-muted mil-arrow-place">
              <span>{hero?.cta2Text || "View works" }</span>
            </Link>

            <div className="mil-circle-text">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 300 300" enableBackground="new 0 0 300 300" xmlSpace="preserve" className="mil-ct-svg mil-rotate" data-value="360">
                <defs>
                  <path id="circlePath" d="M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 " />
                </defs>
                <circle cx="150" cy="100" r="75" fill="none" />
                <g>
                  <use xlinkHref="#circlePath" fill="none" />
                  <text style={{ letterSpacing: "6.5px" }}>
                    <textPath xlinkHref="#circlePath">Scroll down - Scroll down - </textPath>
                  </text>
                </g>
              </svg>
              <a href="#about" className="mil-button mil-arrow-place mil-icon-button mil-arrow-down"></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
