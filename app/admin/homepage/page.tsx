"use client";
import { getHomepage, updateHomepage } from "@/actions/homepage";
import { useState, useEffect } from "react";
import { uploadImage } from "@/actions/upload";
import SeoMetabox from "@/components/admin/SeoMetabox";

type Section = "hero" | "about" | "services" | "team" | "testimonials" | "partners";

export default function AdminHomepage() {
  const [open, setOpen] = useState<Section | null>("hero");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);

  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [cta1Text, setCta1Text] = useState("");
  const [cta1Link, setCta1Link] = useState("");
  const [cta2Text, setCta2Text] = useState("");
  const [cta2Link, setCta2Link] = useState("");

  const [aboutTitle, setAboutTitle] = useState("");
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [founderQuote, setFounderQuote] = useState("");
  const [aboutImage, setAboutImage] = useState("");
  const [founderAvatar, setFounderAvatar] = useState("");

  const [services, setServices] = useState<{ title: string; description: string; link: string }[]>([]);
  const [team, setTeam] = useState<{ name: string; role: string; photo: string; socials: { behance?: string; dribbble?: string; twitter?: string; github?: string } }[]>([]);
  const [testimonials, setTestimonials] = useState<{ name: string; company: string; quote: string }[]>([]);
  const [partners, setPartners] = useState<{ name: string; logo: string; link?: string }[]>([]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  useEffect(() => {
    getHomepage().then((data) => {
      if (!data) return;
      setHeadline(data.hero?.headline || "");
      setSubtitle(data.hero?.subtitle || "");
      setCta1Text(data.hero?.cta1Text || "");
      setCta1Link(data.hero?.cta1Link || "");
      setCta2Text(data.hero?.cta2Text || "");
      setCta2Link(data.hero?.cta2Link || "");
      setAboutTitle(data.about?.title || "");
      setDescription1(data.about?.description1 || "");
      setDescription2(data.about?.description2 || "");
      setFounderQuote(data.about?.founderQuote || "");
      setAboutImage(data.about?.image || "");
      setFounderAvatar(data.about?.founderAvatar || "");
      if (data.services) setServices(data.services);
      if (data.team) setTeam(data.team);
      if (data.testimonials) setTestimonials(data.testimonials);
      if (data.partners) setPartners(data.partners);
    });
  }, []);

  const d = () => setDirty(true);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      await updateHomepage({
        hero: { headline, subtitle, cta1Text, cta1Link, cta2Text, cta2Link },
        about: { title: aboutTitle, description1, description2, founderQuote, image: aboutImage, founderAvatar },
        services, team, testimonials, partners,
      });
      setDirty(false);
      setMessage("Saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Failed to save.");
    }
    setSaving(false);
  }

  function updateService(i: number, field: string, value: string) {
    const u = [...services]; u[i] = { ...u[i], [field]: value }; setServices(u); d();
  }
  function updateTeamMember(i: number, field: string, value: string) {
    const u = [...team];
    if (field.startsWith("socials.")) {
      const k = field.split(".")[1];
      u[i] = { ...u[i], socials: { ...u[i].socials, [k]: value } };
    } else { u[i] = { ...u[i], [field]: value }; }
    setTeam(u); d();
  }
  function updateTestimonial(i: number, field: string, value: string) {
    const u = [...testimonials]; u[i] = { ...u[i], [field]: value }; setTestimonials(u); d();
  }
  function updatePartner(i: number, field: string, value: string) {
    const u = [...partners]; u[i] = { ...u[i], [field]: value }; setPartners(u); d();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadImage(formData);
    if (result.url) { setter(result.url); d(); }
    else if (result.error) setMessage(result.error);
  }

  function toggle(s: Section) { setOpen((prev) => prev === s ? null : s); }

  function Accordion({ id, label, count, children }: { id: Section; label: string; count?: number; children: React.ReactNode }) {
    const isOpen = open === id;
    return (
      <div className="admin-accordion-item">
        <div className="admin-accordion-header" onClick={() => toggle(id)}>
          <span>
            {label}
            {count !== undefined && (
              <span style={{ marginLeft: 8, fontSize: 11, color: "#aaa", fontWeight: 400 }}>({count})</span>
            )}
          </span>
          <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`} style={{ fontSize: 11, color: "#aaa" }}></i>
        </div>
        {isOpen && <div className="admin-accordion-body">{children}</div>}
      </div>
    );
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Homepage</h1>
          <p>Manage homepage content section by section.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {message && <span className="admin-save-msg">{message}</span>}
          {dirty && !message && <span style={{ fontSize: 12, color: "#e67e22" }}>● Unsaved</span>}
          <button className="admin-btn-primary" disabled={saving} onClick={handleSave}>
            <i className="fas fa-save"></i> {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {/* ── Hero ── */}
      <Accordion id="hero" label="Hero Section">
        <div className="admin-row">
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Headline</label>
              <input className="admin-input" value={headline} onChange={(e) => { setHeadline(e.target.value); d(); }} placeholder="Main heading (HTML allowed)" />
            </div>
          </div>
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Subtitle</label>
              <input className="admin-input" value={subtitle} onChange={(e) => { setSubtitle(e.target.value); d(); }} placeholder="Subheading text" />
            </div>
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Button 1 Text</label>
              <input className="admin-input" value={cta1Text} onChange={(e) => { setCta1Text(e.target.value); d(); }} />
            </div>
          </div>
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Button 1 Link</label>
              <input className="admin-input" value={cta1Link} onChange={(e) => { setCta1Link(e.target.value); d(); }} />
            </div>
          </div>
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Button 2 Text</label>
              <input className="admin-input" value={cta2Text} onChange={(e) => { setCta2Text(e.target.value); d(); }} />
            </div>
          </div>
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Button 2 Link</label>
              <input className="admin-input" value={cta2Link} onChange={(e) => { setCta2Link(e.target.value); d(); }} />
            </div>
          </div>
        </div>
      </Accordion>

      {/* ── About ── */}
      <Accordion id="about" label="About Section">
        <div className="admin-row">
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Title</label>
              <input className="admin-input" value={aboutTitle} onChange={(e) => { setAboutTitle(e.target.value); d(); }} placeholder="HTML allowed" />
            </div>
          </div>
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Founder Quote</label>
              <input className="admin-input" value={founderQuote} onChange={(e) => { setFounderQuote(e.target.value); d(); }} placeholder="HTML allowed" />
            </div>
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Paragraph 1</label>
              <textarea className="admin-input" rows={3} value={description1} onChange={(e) => { setDescription1(e.target.value); d(); }} />
            </div>
          </div>
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Paragraph 2</label>
              <textarea className="admin-input" rows={3} value={description2} onChange={(e) => { setDescription2(e.target.value); d(); }} />
            </div>
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-col">
            <div className="admin-form-group">
              <label>About Image</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {aboutImage && <img src={aboutImage} alt="" className="admin-image-preview" style={{ width: 60, height: 60 }} />}
                <input type="file" accept="image/*" onChange={(e) => handleUpload(e, setAboutImage)} />
              </div>
            </div>
          </div>
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Founder Avatar</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {founderAvatar && <img src={founderAvatar} alt="" className="admin-image-preview" style={{ width: 60, height: 60 }} />}
                <input type="file" accept="image/*" onChange={(e) => handleUpload(e, setFounderAvatar)} />
              </div>
            </div>
          </div>
        </div>
      </Accordion>

      {/* ── Services ── */}
      <Accordion id="services" label="Services" count={services.length}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button className="admin-btn-add" onClick={() => { setServices([...services, { title: "", description: "", link: "/services" }]); d(); }}>
            <i className="fas fa-plus"></i> Add Service
          </button>
        </div>
        {services.map((svc, i) => (
          <div key={i} className="admin-list-item">
            <div className="admin-list-item-header">
              <span>{svc.title || `Service ${i + 1}`}</span>
              <button className="admin-btn-remove" onClick={() => { setServices(services.filter((_, idx) => idx !== i)); d(); }}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
            <div className="admin-row">
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Title</label>
                  <input className="admin-input" value={svc.title} onChange={(e) => updateService(i, "title", e.target.value)} />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Description</label>
                  <input className="admin-input" value={svc.description} onChange={(e) => updateService(i, "description", e.target.value)} />
                </div>
              </div>
              <div className="admin-col" style={{ maxWidth: 160 }}>
                <div className="admin-form-group">
                  <label>Link</label>
                  <input className="admin-input" value={svc.link} onChange={(e) => updateService(i, "link", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Accordion>

      {/* ── Team ── */}
      <Accordion id="team" label="Team" count={team.length}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button className="admin-btn-add" onClick={() => { setTeam([...team, { name: "", role: "", photo: "", socials: {} }]); d(); }}>
            <i className="fas fa-plus"></i> Add Member
          </button>
        </div>
        {team.map((member, i) => (
          <div key={i} className="admin-list-item">
            <div className="admin-list-item-header">
              <span>{member.name || `Member ${i + 1}`}</span>
              <button className="admin-btn-remove" onClick={() => { setTeam(team.filter((_, idx) => idx !== i)); d(); }}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
            <div className="admin-row">
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Name</label>
                  <input className="admin-input" value={member.name} onChange={(e) => updateTeamMember(i, "name", e.target.value)} />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Role</label>
                  <input className="admin-input" value={member.role} onChange={(e) => updateTeamMember(i, "role", e.target.value)} />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Photo Path</label>
                  <input className="admin-input" value={member.photo} onChange={(e) => updateTeamMember(i, "photo", e.target.value)} placeholder="/img/faces/1.jpg" />
                </div>
              </div>
            </div>
            <div className="admin-row">
              {["behance", "dribbble", "twitter", "github"].map((s) => (
                <div className="admin-col" key={s}>
                  <div className="admin-form-group">
                    <label>{s.charAt(0).toUpperCase() + s.slice(1)}</label>
                    <input className="admin-input" value={(member.socials as Record<string, string>)?.[s] || ""} onChange={(e) => updateTeamMember(i, `socials.${s}`, e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Accordion>

      {/* ── Testimonials ── */}
      <Accordion id="testimonials" label="Testimonials" count={testimonials.length}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button className="admin-btn-add" onClick={() => { setTestimonials([...testimonials, { name: "", company: "", quote: "" }]); d(); }}>
            <i className="fas fa-plus"></i> Add Testimonial
          </button>
        </div>
        {testimonials.map((item, i) => (
          <div key={i} className="admin-list-item">
            <div className="admin-list-item-header">
              <span>{item.name || `Testimonial ${i + 1}`}</span>
              <button className="admin-btn-remove" onClick={() => { setTestimonials(testimonials.filter((_, idx) => idx !== i)); d(); }}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
            <div className="admin-row">
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Name</label>
                  <input className="admin-input" value={item.name} onChange={(e) => updateTestimonial(i, "name", e.target.value)} />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Company</label>
                  <input className="admin-input" value={item.company} onChange={(e) => updateTestimonial(i, "company", e.target.value)} />
                </div>
              </div>
              <div className="admin-col" style={{ flex: 2 }}>
                <div className="admin-form-group">
                  <label>Quote</label>
                  <input className="admin-input" value={item.quote} onChange={(e) => updateTestimonial(i, "quote", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Accordion>

      {/* ── Partners ── */}
      <Accordion id="partners" label="Partners" count={partners.length}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button className="admin-btn-add" onClick={() => { setPartners([...partners, { name: "", logo: "", link: "" }]); d(); }}>
            <i className="fas fa-plus"></i> Add Partner
          </button>
        </div>
        {partners.map((partner, i) => (
          <div key={i} className="admin-list-item">
            <div className="admin-list-item-header">
              <span>{partner.name || `Partner ${i + 1}`}</span>
              <button className="admin-btn-remove" onClick={() => { setPartners(partners.filter((_, idx) => idx !== i)); d(); }}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
            <div className="admin-row">
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Name</label>
                  <input className="admin-input" value={partner.name} onChange={(e) => updatePartner(i, "name", e.target.value)} />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Logo Path</label>
                  <input className="admin-input" value={partner.logo} onChange={(e) => updatePartner(i, "logo", e.target.value)} placeholder="/img/partners/logo.svg" />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Link</label>
                  <input className="admin-input" value={partner.link || ""} onChange={(e) => updatePartner(i, "link", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Accordion>

      <SeoMetabox page="homepage" />
      <div style={{ height: 40 }} />
    </>
  );
}
