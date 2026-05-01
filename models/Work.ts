import mongoose from "mongoose";

const WorkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  client: { type: String, required: true },
  tags: [{ type: String }],
  thumbnail: { type: String },
  challenge: { type: String },
  approach: { type: String },
  results: { type: String },
  gallery: [{ type: String }],
  metrics: [{ label: { type: String }, value: { type: String } }],
  blocks:[
     {
      type: { type: String },
      // full-media / portrait-media
      media: {
        url: { type: String },
        kind: { type: String },
    },                                          
      // two-column
      left: { url: { type: String }, kind: { type:
       String } },    
       right: { url: { type: String }, kind: {
       type: String } },
       // text
      label: { type: String },
      body: { type: String },                     
    },
  ],
});

export const Work = mongoose.models.Work || mongoose.model("Work", WorkSchema);
