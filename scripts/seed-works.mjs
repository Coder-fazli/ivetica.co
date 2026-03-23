import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://ivetica:NOkOprz1tloXEotL@ivetica.qfdlhbk.mongodb.net/Ivetica?retryWrites=true&w=majority";

const WorkSchema = new mongoose.Schema({
  title: String,
  slug: String,
  client: String,
  tags: [String],
  thumbnail: String,
  challenge: String,
  approach: String,
  results: String,
  gallery: [String],
  metrics: [{ label: String, value: String }],
});

const Work = mongoose.models.Work || mongoose.model("Work", WorkSchema);

const works = [
  {
    title: "Interior Design Studio",
    slug: "interior-design-studio",
    client: "Envato Market",
    tags: ["Production"],
    thumbnail: "/img/works/1.jpg",
    challenge: "The client needed a complete brand identity for their new interior design studio — from concept through to final deliverables, all in a tight timeline.",
    approach: "We started with a deep discovery session to understand their aesthetic vision, then developed a clean, minimal identity system that reflects sophistication and calm.",
    results: "The studio launched with a cohesive brand presence that resonated immediately with their target audience, leading to a fully booked calendar within the first month.",
    gallery: ["/img/works/1/2.jpg", "/img/works/1/3.jpg", "/img/works/1/4.jpg", "/img/works/1/5.jpg", "/img/works/1/6.jpg", "/img/works/1/7.jpg"],
    metrics: [{ value: "3x", label: "Brand Recall" }, { value: "100%", label: "Booked in Month 1" }, { value: "4.9", label: "Client Rating" }, { value: "6wk", label: "Delivery Time" }],
  },
  {
    title: "Home Security Camera",
    slug: "home-security-camera",
    client: "SecureHome",
    tags: ["Production", "UGC"],
    thumbnail: "/img/works/2.jpg",
    challenge: "Launch a new smart home security product in a saturated market while communicating both security and design elegance to a premium audience.",
    approach: "We produced lifestyle UGC-style videos and high-end product visuals showing the camera in real home environments, focused on the dual open/closed states of the device.",
    results: "The campaign drove a 240% increase in pre-orders compared to projections, and the hero video reached 1.2M views organically within two weeks.",
    gallery: ["/img/works/2/2.jpg", "/img/works/2/3.jpg", "/img/works/2/4.jpg"],
    metrics: [{ value: "1.2M", label: "Organic Views" }, { value: "240%", label: "Pre-order Increase" }, { value: "2wk", label: "To 1M Views" }, { value: "62%", label: "Engagement Rate" }],
  },
  {
    title: "Kemia Honest Skincare",
    slug: "kemia-honest-skincare",
    client: "Kemia",
    tags: ["Influencer", "Social Media"],
    thumbnail: "/img/works/3.jpg",
    challenge: "Break through the noise in the wellness and skincare space with an authentic campaign that builds trust rather than just awareness.",
    approach: "We identified micro and mid-tier influencers whose audiences aligned with Kemia's values of transparency and clean beauty. Each creator received full creative freedom within a loose brand brief.",
    results: "The campaign generated earned media value 4x the paid spend, with influencer content outperforming paid ads by 180% on conversion rate.",
    gallery: ["/img/works/3/1.jpg", "/img/works/3/2.jpg", "/img/works/3/3.jpg", "/img/works/3/4.jpg"],
    metrics: [{ value: "4x", label: "Earned Media Value" }, { value: "180%", label: "Better Than Paid Ads" }, { value: "38", label: "Influencers Activated" }, { value: "2.1M", label: "Total Reach" }],
  },
  {
    title: "Cascade of Lava",
    slug: "cascade-of-lava",
    client: "Lava Creative",
    tags: ["Production", "Influencer"],
    thumbnail: "/img/works/4.jpg",
    challenge: "Create a visually striking campaign that positions an emerging creative agency as a bold, forward-thinking force in the industry.",
    approach: "Full production from concept to delivery — art direction, cinematography, and post-production. The visual language drew from volcanic textures and motion.",
    results: "The campaign won two regional creative awards and was featured in three industry publications, establishing the client as a name to watch.",
    gallery: ["/img/works/4/1.jpg", "/img/works/4/2.jpg", "/img/works/4/3.jpg", "/img/works/4/4.jpg", "/img/works/4/6.jpg", "/img/works/4/7.jpg"],
    metrics: [{ value: "2", label: "Awards Won" }, { value: "3", label: "Press Features" }, { value: "500K", label: "Campaign Impressions" }, { value: "91%", label: "Positive Sentiment" }],
  },
  {
    title: "Air Pro by Molekule",
    slug: "air-pro-molekule",
    client: "Molekule",
    tags: ["Social Media", "UGC"],
    thumbnail: "/img/works/5.jpg",
    challenge: "Translate a complex, science-backed air purification product into content that feels accessible, aspirational, and shareable on social media.",
    approach: "We built a social content system — reels, stories, carousels — that mixed product education with lifestyle aesthetics. UGC creators tested the product at home and shared authentic reactions.",
    results: "Grew the brand's Instagram following by 43% in 60 days. Social content drove 28% of total e-commerce revenue during the campaign period.",
    gallery: ["/img/works/5/1.jpg", "/img/works/5/2.jpg", "/img/works/5/4.jpg", "/img/works/5/5.jpg"],
    metrics: [{ value: "43%", label: "Follower Growth" }, { value: "28%", label: "Revenue From Social" }, { value: "60d", label: "Campaign Duration" }, { value: "4.2M", label: "Total Impressions" }],
  },
  {
    title: "Tony's Chocolonely",
    slug: "tonys-chocolonely",
    client: "Tony's Chocolonely",
    tags: ["Influencer", "Social Media", "UGC"],
    thumbnail: "/img/works/6.jpg",
    challenge: "Drive awareness among a younger audience while keeping the campaign playful and true to the brand's rebellious, mission-driven personality.",
    approach: "We recruited food, lifestyle, and cause-driven creators to produce authentic content around the brand's ethos, combined with a branded hashtag challenge.",
    results: "The hashtag challenge generated 8,000+ pieces of user content. Campaign reach exceeded 5M across platforms with CPM 60% below industry benchmark.",
    gallery: ["/img/works/6/1.jpg", "/img/works/6/3.jpg", "/img/works/6/5.jpg", "/img/works/6/6.jpg"],
    metrics: [{ value: "8K+", label: "UGC Pieces Created" }, { value: "5M+", label: "Total Reach" }, { value: "60%", label: "Below Avg CPM" }, { value: "12%", label: "Engagement Rate" }],
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
  await Work.deleteMany({});
  console.log("Cleared existing works");
  await Work.insertMany(works);
  console.log(`Seeded ${works.length} works`);
  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch(console.error);
