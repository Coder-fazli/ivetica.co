

import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Animations from "@/components/layout/Animations";
import { getServiceBySlug, getServices } from "@/actions/services";

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const allServices = await getServices();
  const otherServices = allServices.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div className="mil-wrapper" id="top">
      <Animations />
      <Header />

      <div className="mil-progress-track">
        <div className="mil-progress"></div>
      </div>

      <div className="mil-content">
        <div id="swupMain" className="mil-main-transition">

          {/* banner */}
          <div className="mil-inner-banner">
            <div className="mil-animation-frame">
              <div className="mil-animation mil-position-4 mil-dark mil-scale" data-value-1="6" data-value-2="1.4"></div>
            </div>
            <div className="mil-banner-content mil-up">
              <div className="container">
                <ul className="mil-breadcrumbs mil-mb-60">
                  <li><Link href="/">Homepage</Link></li>
                  <li><Link href="/services">Services</Link></li>
                  <li><Link href={`/services/${service.slug}`}>Service</Link></li>
                </ul>
                <h1 className="mil-mb-60" dangerouslySetInnerHTML={{ __html: service.title }} />
                <a href="#service" className="mil-link mil-dark mil-arrow-place mil-down-arrow">
                  <span>About service</span>
                </a>
              </div>
            </div>
          </div>

          {/* service detail */}
          <section id="service">
            <div className="container mil-p-120-90">
              <div className="row justify-content-between">
                <div className="col-lg-4 mil-relative mil-mb-90">
                  <h4 className="mil-up mil-mb-30">Your <span className="mil-thin">Approach</span> <br />and <span className="mil-thin">Work Specifics</span></h4>
                  <p className="mil-up mil-mb-30">{service.description}</p>
                  <div className="mil-up">
                    <Link href="/portfolio" className="mil-link mil-dark mil-arrow-place">
                      <span>View works</span>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  {service.features.map((feature, index) => (
                    <ServiceAccordion key={index} title={feature} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* other services */}
          {otherServices.length > 0 && (
            <section>
              <div className="container mil-p-120-90">
                <div className="row align-items-center mil-mb-30">
                  <div className="col-lg-6 mil-mb-30">
                    <h3 className="mil-up">Other services</h3>
                  </div>
                  <div className="col-lg-6 mil-mb-30">
                    <div className="mil-adaptive-right mil-up">
                      <Link href="/services" className="mil-link mil-dark mil-arrow-place">
                        <span>View all</span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {otherServices.map((s) => (
                    <div key={s.slug} className="col-lg-4">
                      <Link href={`/services/${s.slug}`} className="mil-service-card-lg mil-other-card mil-more mil-mb-30">
                        <h4 className="mil-up mil-mb-30" dangerouslySetInnerHTML={{ __html: s.title }} />
                        <p className="mil-descr mil-up mil-mb-30">{s.shortDescription}</p>
                        <ul className="mil-service-list mil-dark mil-mb-30">
                          {s.features.slice(0, 4).map((feature, i) => (
                            <li key={i} className="mil-up">{feature}</li>
                          ))}
                        </ul>
                        <div className="mil-link mil-dark mil-arrow-place mil-up">
                          <span>Read more</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

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

function ServiceAccordion({ title, index }: { title: string; index: number }) {
  const descriptions: Record<string, string> = {
    "UX Audits": "A UX audit evaluates the user experience of a website, analyzing design, functionality, and content to identify areas of improvement that enhance the user's overall experience.",
    "Design thinking": "Design thinking is a problem-solving approach that emphasizes empathy, creativity, and collaboration. It involves understanding user needs, defining problems, and generating innovative solutions.",
    "Wireframing": "Wireframing is a vital step in design where a visual representation of a structure is created, focusing on layout and user experience using basic shapes and lines.",
    "Aesthetics": "Aesthetics focus on the visual appeal, incorporating elements like colors, typography, images, and layout to create an engaging and visually pleasing experience.",
    "Methodologies": "We employ industry-leading methodologies to ensure consistent delivery of high-quality results, combining agile practices with creative workflows.",
    "Brand Strategy": "A comprehensive brand strategy defines how your brand communicates with the world, establishing voice, visual identity, and market positioning.",
    "Visual Identity": "Visual identity encompasses all visual elements that represent your brand, from logos and color palettes to typography and imagery guidelines.",
    "Market Research": "In-depth market research helps identify opportunities, understand competitor landscapes, and define target audiences for maximum impact.",
    "Campaign Planning": "Strategic campaign planning ensures your message reaches the right audience at the right time through the most effective channels.",
    "Content Strategy": "Content strategy defines the creation, delivery, and governance of useful, usable content that drives meaningful engagement.",
    "Performance Analytics": "Data-driven performance analytics provide actionable insights to optimize campaigns and maximize return on investment.",
    "Creative Direction": "Creative direction provides a unified vision for projects, ensuring all creative elements work together cohesively toward your goals.",
    "Concept Development": "Concept development transforms initial ideas into fully realized creative concepts ready for production and implementation.",
    "Workshop Facilitation": "Interactive workshops bring teams together to solve problems, generate ideas, and align on creative direction.",
  };

  const description = descriptions[title] || `Our team brings deep expertise in ${title.toLowerCase()}, delivering tailored solutions that drive real results for your business.`;

  return (
    <div className="mil-accordion-group mil-up">
      <div className="mil-accordion-menu">
        <p className="mil-accordion-head">{title}</p>
        <div className="mil-symbol mil-h3">
          <div className="mil-plus">+</div>
          <div className="mil-minus">-</div>
        </div>
      </div>
      <div className="mil-accordion-content">
        <p className="mil-mb-30">{description}</p>
      </div>
    </div>
  );
}
