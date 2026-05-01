import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Animations from "@/components/layout/Animations";
import { getWorkBySlug, getWorks } from "@/actions/works";
import { MediaItem } from "@/types";
import VideoPlayer from "@/components/works/VideoPlayer";
import "@/components/works/works.css";

export const dynamic = "force-dynamic";

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work) notFound();

  const allWorks = await getWorks();
  const currentIndex = allWorks.findIndex((w) => w.slug === slug);
  const prevWork = currentIndex > 0 ? allWorks[currentIndex - 1] : null;
  const nextWork = currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : null;

  const galleryImages = work.gallery ?? [];
  const hasGallery = galleryImages.length > 0;
  const hasBlocks = (work.blocks ?? []).length > 0;

  function renderMedia(media: MediaItem, className = "") {
    return media.kind === "video"
      ? <VideoPlayer src={media.url} className={className} />
      : <img src={media.url} alt="" className={className} />;
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

          {/* banner — matches project-1.html exactly */}
          <div className="mil-inner-banner">
            <div className="mil-banner-content mil-up">
              <div className="mil-animation-frame">
                <div className="mil-animation mil-position-4 mil-dark mil-scale" data-value-1="6" data-value-2="1.4"></div>
              </div>
              <div className="container">
                <ul className="mil-breadcrumbs mil-mb-60">
                  <li><Link href="/">Homepage</Link></li>
                  <li><Link href="/works">Works</Link></li>
                  <li><span>{work.title}</span></li>
                </ul>
                <h1 className="mil-mb-60">{work.title}</h1>
                <a href="#project" className="mil-link mil-dark mil-arrow-place mil-down-arrow">
                  <span>Read more</span>
                </a>
              </div>
            </div>
          </div>

          {/* project — matches project-1.html section structure exactly */}
          <section className="mil-p-120-0">
            <div className="container mil-p-0-120" id="project">

              {/* hero image — mil-image-frame mil-horizontal */}
              {work.thumbnail && (
                <div className="mil-image-frame mil-horizontal mil-up">
                  <img src={work.thumbnail} alt={work.title} />
                </div>
              )}

              {/* meta info — mil-info matches project-1.html */}
              <div className="mil-info mil-up">
                <div>Client: &nbsp;<span className="mil-dark">{work.client}</span></div>
                {work.tags.length > 0 && (
                  <div>Services: &nbsp;<span className="mil-dark">{work.tags.join(", ")}</span></div>
                )}
              </div>

              {/* content blocks */}
              {hasBlocks && (
                <div className="work-blocks">
                  {work.blocks!.map((block, idx) => {
                    if (block.type === "full-media") return (
                      <div key={idx} className="work-block work-block-full">
                        {renderMedia(block.media, "work-block-media")}
                      </div>
                    );
                    if (block.type === "portrait-media") return (
                      <div key={idx} className="work-block work-block-portrait">
                        {renderMedia(block.media, "work-block-media")}
                      </div>
                    );
                    if (block.type === "two-column") return (
                      <div key={idx} className="work-block work-block-two-col">
                        {renderMedia(block.left, "work-block-media")}
                        {renderMedia(block.right, "work-block-media")}
                      </div>
                    );
                    if (block.type === "text") return (
                      <div key={idx} className="work-block work-block-text">
                        {block.label && <span className="work-block-label">{block.label}</span>}
                        <p className="work-block-body">{block.body}</p>
                      </div>
                    );
                    if (block.type === "media-text") return (
                      <div key={idx} className="work-block work-block-media-text">
                        {renderMedia(block.media, "work-block-media")}
                        <p className="work-block-body">{block.body}</p>
                      </div>
                    );
                    if (block.type === "text-full") return (
                      <div key={idx} className="work-block work-block-text-full">
                        {block.label && <span className="work-block-label">{block.label}</span>}
                        <p className="work-block-body">{block.body}</p>
                      </div>
                    );
                    if (block.type === "text-two-col") return (
                      <div key={idx} className="work-block work-block-text-two-col">
                        <div>
                          {block.leftLabel && <span className="work-block-label">{block.leftLabel}</span>}
                          <p className="work-block-body">{block.leftBody}</p>
                        </div>
                        <div>
                          {block.rightLabel && <span className="work-block-label">{block.rightLabel}</span>}
                          <p className="work-block-body">{block.rightBody}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mil-p-120-0">

                {/* case study — compact 3-column row */}
                {(work.challenge || work.approach || work.results) && (
                  <div className="row mil-mb-60">
                    {work.challenge && (
                      <div className="col-lg-4 mil-mb-30">
                        <div className="mil-case-item mil-up">
                          <span className="mil-case-number">01 — Challenge</span>
                          <p>{work.challenge}</p>
                        </div>
                      </div>
                    )}
                    {work.approach && (
                      <div className="col-lg-4 mil-mb-30">
                        <div className="mil-case-item mil-up">
                          <span className="mil-case-number">02 — Approach</span>
                          <p>{work.approach}</p>
                        </div>
                      </div>
                    )}
                    {work.results && (
                      <div className="col-lg-4 mil-mb-30">
                        <div className="mil-case-item mil-up">
                          <span className="mil-case-number">03 — Results</span>
                          <p>{work.results}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* gallery grid — all square */}
                {hasGallery && (
                  <div className="row">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="col-lg-6">
                        <div className="mil-image-frame mil-square mil-up mil-mb-30">
                          <img src={img} alt={`${work.title} ${i + 1}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* metrics — in Ashley's row justify-content-between style */}
                {work.metrics && work.metrics.length > 0 && (
                  <div className="row justify-content-between mil-p-90-120">
                    <div className="col-lg-5 mil-mb-30">
                      <h3 className="mil-up mil-mb-30">Key <span className="mil-thin">metrics</span></h3>
                    </div>
                    <div className="col-lg-6">
                      <div className="row">
                        {work.metrics.map((metric, i) => (
                          <div key={i} className="col-6 mil-mb-30">
                            <div className="mil-metric-item mil-up">
                              <div className="mil-metric-value">{metric.value}</div>
                              <div className="mil-metric-label">{metric.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!hasGallery && !work.challenge && !work.approach && !work.results && (
                  <div className="row justify-content-between mil-p-90-120">
                    <div className="col-lg-5">
                      <h3 className="mil-up mil-mb-60">{work.title}</h3>
                    </div>
                    <div className="col-lg-6">
                      <p className="mil-up mil-mb-30">More details coming soon.</p>
                    </div>
                  </div>
                )}

              </div>

              {/* navigation — matches mil-works-nav from project-1.html exactly */}
              <div className="mil-works-nav mil-up">
                {prevWork ? (
                  <Link href={`/works/${prevWork.slug}`} className="mil-link mil-dark mil-arrow-place mil-icon-left">
                    <span>Prev project</span>
                  </Link>
                ) : (
                  <a href="#." className="mil-link mil-dark mil-arrow-place mil-icon-left mil-disabled">
                    <span>Prev project</span>
                  </a>
                )}
                <Link href="/works" className="mil-link mil-dark">
                  <span>All projects</span>
                </Link>
                {nextWork ? (
                  <Link href={`/works/${nextWork.slug}`} className="mil-link mil-dark mil-arrow-place">
                    <span>Next project</span>
                  </Link>
                ) : (
                  <a href="#." className="mil-link mil-dark mil-arrow-place mil-disabled">
                    <span>Next project</span>
                  </a>
                )}
              </div>

            </div>
          </section>

          {/* call to action */}
          <section className="mil-soft-bg">
            <div className="container mil-p-120-120">
              <div className="row">
                <div className="col-lg-10">
                  <span className="mil-suptitle mil-suptitle-right mil-suptitle-dark mil-up">Looking to make your mark? We&apos;ll help you turn <br /> your project into a success story.</span>
                </div>
              </div>
              <div className="mil-center">
                <h2 className="mil-up mil-mb-60">Ready to bring your <span className="mil-thin">ideas to</span> life? <br /> We&apos;re <span className="mil-thin">here to help</span></h2>
                <div className="mil-up"><Link href="/contact" className="mil-button mil-arrow-place"><span>Contact us</span></Link></div>
              </div>
            </div>
          </section>

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
