import mongoose from "mongoose";

export const HomePageSchema = new mongoose.Schema({
    hero: {
      headline: { type: String, required: true },
      subtitle: { type: String, required: true },
      cta1Text: { type: String, default: "What we do"
  },
      cta1Link: { type: String, default: "/services" },
      cta2Text: { type: String, default: "View works"
  },
      cta2Link: { type: String, default: "/portfolio"
  },
    },
    about: {
      title: { type: String, required: true },
      description1: { type: String, required: true },
      description2: { type: String, required: true },
      image: { type: String, required: true },
      founderQuote: { type: String, required: true },
      founderAvatar: { type: String, required: true },
    },
    services: [{
      title: { type: String, required: true },
      description: { type: String, required: true },
      link: { type: String, default: "/services" },
    }],
    team: [{
      name: { type: String, required: true },
      role: { type: String, required: true },
      photo: { type: String, required: true },
      socials: {
        behance: String,
        dribbble: String,
        twitter: String,
        github: String,
      },
    }],
    testimonials: [{
      name: { type: String, required: true },
      company: { type: String, required: true },
      quote: { type: String, required: true },
    }],
    partners: [{
      name: { type: String, required: true },
      logo: { type: String, required: true },
      link: String,
    }],
});

export const Homepage = mongoose.models.Homepage || mongoose.model("Homepage", HomePageSchema);
