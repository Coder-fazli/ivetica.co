import mongoose, { Schema } from "mongoose";

const SiteSettingsSchema = new Schema({
  _id: { type: String, default: "global" },
  logoUrl: { type: String, default: "" },
  faviconUrl: { type: String, default: "" },
}, { _id: false });

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
