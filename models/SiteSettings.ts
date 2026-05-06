import mongoose, { Schema } from "mongoose";

const SiteSettingsSchema = new Schema({
  _id: { type: String, default: "global" },
  logoUrl: { type: String, default: "" },
  logoUrlLight: { type: String, default: "" },
  faviconUrl: { type: String, default: "" },
  fontSizes: {
    heroTagline: { type: Number, default: 15 },
    cardTitle: { type: Number, default: 16 },
    cardDesc: { type: Number, default: 14 },
    workTitle: { type: Number, default: 30 },
    workBody: { type: Number, default: 13 },
    contactLabel: { type: Number, default: 11 },
    contactLink: { type: Number, default: 14 },
  },
  socialTiktok: { type: String, default: "" },
  socialFacebook: { type: String, default: "" },
  socialInstagram: { type: String, default: "" },
}, { _id: false });

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
