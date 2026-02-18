"use client";
import { getHomepage } from "@/actions/homepage";
import { updateHomepage } from "@/actions/homepage";
import { useState, useEffect } from "react";
import { uploadImage } from "@/actions/upload";

export default function AdminHomepage() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Hero fields
  const [headline, setHeadline] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [cta1Text, setCta1Text] = useState("");
  const [cta1Link, setCta1Link] = useState("");
  const [cta2Text, setCta2Text] = useState("");
  const [cta2Link, setCta2Link] = useState("");

  // About fields
  const [aboutTitle, setAboutTitle] = useState("");
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [founderQuote, setFounderQuote] = useState("");
  const [aboutImage, setAboutImage] = useState("");
  const [founderAvatar, setFounderAvatar] = useState("");

  // Services (array)
  const [services, setServices] = useState<{ title: string; description: string; link: string }[]>([]);

  // Team (array)
  const [team, setTeam] = useState<{ name: string; role: string; photo: string; socials: { behance?: string; dribbble?: string; twitter?: string; github?: string } }[]>([]);

  // Testimonials (array)
  const [testimonials, setTestimonials] = useState<{ name: string; company: string; quote: string }[]>([]);

  // Partners (array)
  const [partners, setPartners] = useState<{ name: string; logo: string; link?: string }[]>([]);

  useEffect(() => {
    getHomepage().then((data) => {
      if (data) {
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
      }
    });
  }, []);

  // Save handler
  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      await updateHomepage({
        hero: { headline, subtitle, cta1Text, cta1Link, cta2Text, cta2Link },
        about: { title: aboutTitle, description1, description2, founderQuote, image: aboutImage, founderAvatar },
        services,
        team,
        testimonials,
        partners,
      });
      setMessage("Homepage saved successfully!");
    } catch {
      setMessage("Failed to save. Try again.");
    }
    setSaving(false);
  }

  // Array helpers
  function updateService(index: number, field: string, value: string) {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  }

  function updateTeamMember(index: number, field: string, value: string) {
    const updated = [...team];
    if (field.startsWith("socials.")) {
      const socialKey = field.split(".")[1];
      updated[index] = { ...updated[index], socials: { ...updated[index].socials, [socialKey]: value } };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setTeam(updated);
  }

  function updateTestimonial(index: number, field: string, value: string) {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setTestimonials(updated);
  }

  function updatePartner(index: number, field: string, value: string) {
    const updated = [...partners];
    updated[index] = { ...updated[index], [field]: value };
    setPartners(updated);
  }

   async function handleUpload( e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void){
       const file = e.target.files?.[0];
        if (!file) return;
         const formData = new FormData();
          formData.append("file", file);

          const result = await uploadImage(formData);
            if (result.url) {
              setter(result.url);
            } else if (result.error) {
              setMessage(result.error);
            }
   }

  return (
    <>
      <div className="admin-page-header">
        <h1>Edit Homepage</h1>
        <p>Manage your homepage content</p>
      </div>

      {message && (
        <div className="admin-alert admin-alert-success">{message}</div>
      )}

      {/* Hero Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Hero Section</h3>
        </div>
        <div className="admin-form-group">
          <label>Headline (HTML allowed)</label>
          <input type="text" className="admin-input" value={headline} onChange={(e) => setHeadline(e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Subtitle</label>
          <textarea className="admin-input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </div>
        <div className="admin-row">
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Button 1 Text</label>
              <input type="text" className="admin-input" value={cta1Text} onChange={(e) => setCta1Text(e.target.value)} />
            </div>
          </div>
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Button 1 Link</label>
              <input type="text" className="admin-input" value={cta1Link} onChange={(e) => setCta1Link(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Button 2 Text</label>
              <input type="text" className="admin-input" value={cta2Text} onChange={(e) => setCta2Text(e.target.value)} />
            </div>
          </div>
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Button 2 Link</label>
              <input type="text" className="admin-input" value={cta2Link} onChange={(e) => setCta2Link(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>About Section</h3>
        </div>
        <div className="admin-form-group">
          <label>Title (HTML allowed)</label>
          <input type="text" className="admin-input" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} />
        </div>
        <div className="admin-row">
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Paragraph 1</label>
              <textarea className="admin-input" value={description1} onChange={(e) => setDescription1(e.target.value)} />
            </div>
          </div>
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Paragraph 2</label>
              <textarea className="admin-input" value={description2} onChange={(e) => setDescription2(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="admin-form-group">
          <label>Founder Quote (HTML allowed)</label>
          <textarea className="admin-input" value={founderQuote} onChange={(e) => setFounderQuote(e.target.value)} />
        </div>
        <div className="admin-row">
          <div className="admin-col">
            <div className="admin-form-group">
              <label>About Image Path</label>
              
             <div style={{ display: "flex", alignItems: "center",
               gap: "15px" }}>
               {aboutImage && <img src={aboutImage} alt="preview" 
                className="admin-image-preview" />}
               <input type="file" accept="image/*" onChange={(e) =>
               handleUpload(e, setAboutImage)} />
            </div>

            </div>
          </div>
          <div className="admin-col">
            <div className="admin-form-group">
              <label>Founder Avatar Path</label>
              <div style={{ display: "flex", alignItems: "center",
                 gap: "15px" }}>
                 {founderAvatar && <img src={founderAvatar} 
                 alt="preview" className="admin-image-preview" />}
                <input type="file" accept="image/*" onChange={(e) =>
              handleUpload(e, setFounderAvatar)} />
             </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Services ({services.length})</h3>
          <button className="admin-btn admin-btn-secondary" onClick={() => setServices([...services, { title: "", description: "", link: "/services" }])}>
            <i className="fas fa-plus"></i> Add
          </button>
        </div>
        {services.map((service, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--admin-input-border)", paddingBottom: "15px", marginBottom: "15px" }}>
            <div className="admin-row">
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Title (HTML allowed)</label>
                  <input type="text" className="admin-input" value={service.title} onChange={(e) => updateService(i, "title", e.target.value)} />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Link</label>
                  <input type="text" className="admin-input" value={service.link} onChange={(e) => updateService(i, "link", e.target.value)} />
                </div>
              </div>
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <input type="text" className="admin-input" value={service.description} onChange={(e) => updateService(i, "description", e.target.value)} />
            </div>
            <button className="admin-btn admin-btn-danger" onClick={() => setServices(services.filter((_, idx) => idx !== i))}>
              <i className="fas fa-trash"></i> Remove
            </button>
          </div>
        ))}
      </div>

      {/* Team Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Team ({team.length})</h3>
          <button className="admin-btn admin-btn-secondary" onClick={() => setTeam([...team, { name: "", role: "", photo: "", socials: {} }])}>
            <i className="fas fa-plus"></i> Add
          </button>
        </div>
        {team.map((member, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--admin-input-border)", paddingBottom: "15px", marginBottom: "15px" }}>
            <div className="admin-row">
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Name</label>
                  <input type="text" className="admin-input" value={member.name} onChange={(e) => updateTeamMember(i, "name", e.target.value)} />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Role</label>
                  <input type="text" className="admin-input" value={member.role} onChange={(e) => updateTeamMember(i, "role", e.target.value)} />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Photo Path</label>
                  <input type="text" className="admin-input" value={member.photo} onChange={(e) => updateTeamMember(i, "photo", e.target.value)} placeholder="/img/faces/1.jpg" />
                </div>
              </div>
            </div>
            <div className="admin-row">
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Behance</label>
                  <input type="text" className="admin-input" value={member.socials?.behance || ""} onChange={(e) => updateTeamMember(i, "socials.behance", e.target.value)} />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Dribbble</label>
                  <input type="text" className="admin-input" value={member.socials?.dribbble || ""} onChange={(e) => updateTeamMember(i, "socials.dribbble", e.target.value)} />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Twitter</label>
                  <input type="text" className="admin-input" value={member.socials?.twitter || ""} onChange={(e) => updateTeamMember(i, "socials.twitter", e.target.value)} />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Github</label>
                  <input type="text" className="admin-input" value={member.socials?.github || ""} onChange={(e) => updateTeamMember(i, "socials.github", e.target.value)} />
                </div>
              </div>
            </div>
            <button className="admin-btn admin-btn-danger" onClick={() => setTeam(team.filter((_, idx) => idx !== i))}>
              <i className="fas fa-trash"></i> Remove
            </button>
          </div>
        ))}
      </div>

      {/* Testimonials Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Testimonials ({testimonials.length})</h3>
          <button className="admin-btn admin-btn-secondary" onClick={() => setTestimonials([...testimonials, { name: "", company: "", quote: "" }])}>
            <i className="fas fa-plus"></i> Add
          </button>
        </div>
        {testimonials.map((item, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--admin-input-border)", paddingBottom: "15px", marginBottom: "15px" }}>
            <div className="admin-row">
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Name</label>
                  <input type="text" className="admin-input" value={item.name} onChange={(e) => updateTestimonial(i, "name", e.target.value)} />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Company</label>
                  <input type="text" className="admin-input" value={item.company} onChange={(e) => updateTestimonial(i, "company", e.target.value)} />
                </div>
              </div>
            </div>
            <div className="admin-form-group">
              <label>Quote</label>
              <textarea className="admin-input" value={item.quote} onChange={(e) => updateTestimonial(i, "quote", e.target.value)} />
            </div>
            <button className="admin-btn admin-btn-danger" onClick={() => setTestimonials(testimonials.filter((_, idx) => idx !== i))}>
              <i className="fas fa-trash"></i> Remove
            </button>
          </div>
        ))}
      </div>

      {/* Partners Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Partners ({partners.length})</h3>
          <button className="admin-btn admin-btn-secondary" onClick={() => setPartners([...partners, { name: "", logo: "", link: "" }])}>
            <i className="fas fa-plus"></i> Add
          </button>
        </div>
        {partners.map((partner, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--admin-input-border)", paddingBottom: "15px", marginBottom: "15px" }}>
            <div className="admin-row">
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Name</label>
                  <input type="text" className="admin-input" value={partner.name} onChange={(e) => updatePartner(i, "name", e.target.value)} />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Logo Path</label>
                  <input type="text" className="admin-input" value={partner.logo} onChange={(e) => updatePartner(i, "logo", e.target.value)} placeholder="/img/partners/1.svg" />
                </div>
              </div>
              <div className="admin-col">
                <div className="admin-form-group">
                  <label>Link</label>
                  <input type="text" className="admin-input" value={partner.link || ""} onChange={(e) => updatePartner(i, "link", e.target.value)} />
                </div>
              </div>
            </div>
            <button className="admin-btn admin-btn-danger" onClick={() => setPartners(partners.filter((_, idx) => idx !== i))}>
              <i className="fas fa-trash"></i> Remove
            </button>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        className="admin-btn admin-btn-primary"
        disabled={saving}
        onClick={handleSave}
        style={{ marginBottom: "40px" }}
      >
        <i className="fas fa-save"></i>
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </>
  );
}
