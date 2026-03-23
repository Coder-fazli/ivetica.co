import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  story: {
    title:         { type: String, default: "" },
    description1:  { type: String, default: "" },
    description2:  { type: String, default: "" },
    image:         { type: String, default: "" },
    founderQuote:  { type: String, default: "" },
    founderAvatar: { type: String, default: "" },
  },
  values: [{
    number: { type: String, default: "" },
    title:  { type: String, default: "" },
    text:   { type: String, default: "" },
  }],
  team: [{
    name:  { type: String, default: "" },
    role:  { type: String, default: "" },
    photo: { type: String, default: "" },
  }],
});

export const About = mongoose.models.About || mongoose.model("About", AboutSchema);
