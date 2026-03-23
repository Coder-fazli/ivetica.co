import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title:      { type: String, default: "" },
  slug:       { type: String, default: "" },
  category:   { type: String, default: "" },
  author:     { type: String, default: "" },
  excerpt:    { type: String, default: "" },
  coverImage: { type: String, default: "" },
  content:    { type: String, default: "" },
  published:  { type: Boolean, default: false },
  seo: {
    metaTitle:       { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
}, { timestamps: true });

export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
