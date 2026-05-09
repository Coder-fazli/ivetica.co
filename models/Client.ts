import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export const Client = mongoose.models.Client || mongoose.model("Client", ClientSchema);
