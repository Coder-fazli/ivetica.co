import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const Tag = mongoose.models.Tag || mongoose.model("Tag", TagSchema);
