import mongoose from "mongoose";

const PageSeoSchema = new mongoose.Schema({
  page:            { type: String, unique: true, required: true },
  metaTitle:       { type: String, default: "" },
  metaDescription: { type: String, default: "" },
});

export const PageSeo = mongoose.models.PageSeo || mongoose.model("PageSeo", PageSeoSchema);
