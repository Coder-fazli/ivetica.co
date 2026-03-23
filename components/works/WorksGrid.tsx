"use client";

import { useState } from "react";
import Link from "next/link";
import { WorkType } from "@/types";
import "./works.css";

const TAGS = ["All", "Influencer", "UGC", "Production", "Social Media"];

// Ashley portfolio-2 grid pattern: col sizes repeat every 6 items
const COL_PATTERN = ["col-lg-6", "col-lg-5", "col-lg-12", "col-lg-5", "col-lg-6", "col-lg-12"];
// Which indexes get parallax
const PARALLAX_INDEXES = [1, 3];

export default function WorksGrid({ works }: { works: WorkType[] }) {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? works
    : works.filter((w) => w.tags.includes(active));

  return (
    <>
      {/* filter bar */}
      <div className="mil-works-filter mil-up mil-mb-60">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={`mil-works-filter-btn${active === tag ? " mil-active" : ""}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* grid — exact portfolio-2.html layout */}
      <div className="row justify-content-between align-items-end" style={{ position: "relative", zIndex: 2 }}>
        {filtered.map((work, i) => {
          const colClass = COL_PATTERN[i % 6];
          const hasParallax = PARALLAX_INDEXES.includes(i % 6);
          const hasScale = i % 6 === 0;

          return (
            <div key={work.slug} className={colClass}>
              <Link
                href={`/works/${work.slug}`}
                className={`mil-portfolio-item mil-more mil-mb-60${hasParallax ? " mil-parallax" : ""}`}
                {...(hasParallax ? { "data-value-1": "-30", "data-value-2": "0" } : {})}
              >
                <div className="mil-cover-frame mil-hori mil-up">
                  <div className={`mil-cover${hasScale ? " mil-scale" : ""}`} {...(hasScale ? { "data-value-1": "1.2", "data-value-2": "1" } : {})}>
                    {work.thumbnail ? (
                      <img src={work.thumbnail} alt={work.title} />
                    ) : (
                      <div style={{ width: "100%", paddingBottom: "60%", background: "rgba(0,0,0,0.05)" }} />
                    )}
                  </div>
                </div>
                <div className="mil-descr">
                  <div className="mil-labels mil-up mil-mb-15">
                    <div className="mil-label mil-upper mil-accent">{work.tags[0] || "Work"}</div>
                    <div className="mil-label mil-upper">{work.client}</div>
                  </div>
                  <h4 className="mil-up">{work.title}</h4>
                </div>
              </Link>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-12 mil-up" style={{ padding: "60px 0", opacity: 0.4, textAlign: "center" }}>
            No works found for this category.
          </div>
        )}
      </div>
    </>
  );
}
