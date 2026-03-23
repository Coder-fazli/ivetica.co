import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  email:    { type: String, default: "" },
  phone:    { type: String, default: "" },
  location: { type: String, default: "" },
  mapEmbed: { type: String, default: "" },
});

export const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
