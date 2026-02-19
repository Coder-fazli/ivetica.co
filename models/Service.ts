import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  features: [{ type: String }],
  icon: { type: String },
  image: { type: String },
});

export const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);
