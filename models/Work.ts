import mongoose from "mongoose";

const WorkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  client: { type: String, required: true },
  tags: [{ type: String }],
  thumbnail: { type: String },
  coverImage: { type: String },
  description: { type: String },
  challenge: { type: String },
  approach: { type: String },
  results: { type: String },
  gallery: [{ type: String }],
  metrics: [{ label: { type: String }, value: { type: String } }],
  blocks: [{ type: mongoose.Schema.Types.Mixed }],
});

export const Work = mongoose.models.Work || mongoose.model("Work", WorkSchema);
