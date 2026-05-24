"use server";

import dbConnect from "@/lib/mongodb";
import { About } from "@/models/About";
import { unstable_cache, revalidateTag } from "next/cache";

export type ValueItem = { number: string; title: string; text: string };
export type TeamMember = { name: string; role: string; photo: string; bio?: string };
export type Offering = { name: string; desc: string; services: string };
export type AboutData = {
  story: {
    title: string;
    description1: string;
    description2: string;
    image: string;
    founderQuote: string;
    founderAvatar: string;
  };
  values: ValueItem[];
  team: TeamMember[];
  offerings: Offering[];
  sidebarLabel: string;
  sidebarDesc: string;
  studioTitle: string;
  studioTitleColor: string;
  studioText1: string;
  studioText2: string;
  studioText3: string;
};

const DEFAULTS: AboutData = {
  story: {
    title: "Our Story",
    description1: "lvetica.co was born from a shared passion for content that connects. We started as a small team of creators, strategists, and storytellers — united by the belief that great work deserves a great audience.",
    description2: "Today we help brands across industries craft influential campaigns through UGC, influencer partnerships, and premium production — always rooted in authenticity and impact.",
    image: "/img/photo/1.jpg",
    founderQuote: "We don't just make content — we make moments that matter.",
    founderAvatar: "/img/faces/3.jpg",
  },
  values: [
    { number: "01", title: "Creative Excellence", text: "We push every project beyond the expected — combining bold visual thinking with strategic precision to produce work that truly stands out." },
    { number: "02", title: "Client Focus", text: "Your goals are our goals. We listen deeply, communicate clearly, and stay committed to results that move the needle for your brand." },
    { number: "03", title: "Transparency", text: "No surprises, no jargon. We keep you in the loop at every stage and build relationships based on honesty and mutual respect." },
  ],
  team: [
    { name: "Anna Oldman",   role: "Art Director",   photo: "/img/faces/1.jpg", bio: "" },
    { name: "Oscar Freeman", role: "Frontend Dev",   photo: "/img/faces/3.jpg", bio: "" },
    { name: "Emma Newman",   role: "Founder",        photo: "/img/faces/2.jpg", bio: "" },
    { name: "Lisa Trueman",  role: "UI/UX Designer", photo: "/img/faces/4.jpg", bio: "" },
  ],
  offerings: [
    { name: "Strategy", desc: "We develop brand strategies that define how companies think, speak, and act. Our systems-driven approach ensures every decision is rooted in purpose and built for longevity.", services: "Brand Strategy, Market Positioning, Audience Research, Competitive Analysis, Brand Architecture" },
    { name: "Verbal Identity", desc: "We craft the language of a brand — naming, voice, tone, and messaging frameworks that give companies a distinct and consistent way to communicate across every touchpoint.", services: "Naming, Taglines, Brand Voice, Messaging Framework, Copywriting" },
    { name: "Visual Identity", desc: "We design how brands look and feel. As systems thinkers, we piece together the elements, tools, and behaviors necessary to create unique and memorable identities that flex across different touchpoints, contexts and audiences.", services: "Logo Design, Type Design, Photography Direction, Iconography Direction, Illustration Direction, Guidelines & Tooling" },
    { name: "Digital", desc: "We build digital experiences that bring brand systems to life — from websites and apps to interactive campaigns and digital products designed for scale.", services: "Web Design, UX/UI, Digital Campaigns, Motion Design, Prototyping" },
    { name: "Motion & 3D", desc: "We bring brands into motion through animation, 3D, and film — creating dynamic expressions that capture attention and communicate with depth and energy.", services: "Brand Animation, 3D Modeling & Rendering, Video Direction, Social Content, Title Sequences" },
  ],
  sidebarLabel:     "About us",
  sidebarDesc:      "Lvetica connects brands with top creators for influencer marketing, UGC, and social growth.",
  studioTitle:      "Our Studio",
  studioTitleColor: "",
  studioText1:      "Lvetica connects brands with top creators for influencer marketing, UGC, and social growth.",
  studioText2:  "We help brands navigate complex challenges through work that is strategically rigorous, emotionally resonant, and beautifully designed.",
  studioText3:  "From large-scale rebrands to independent initiatives, our hard-working systems prove that craft and scale can coexist.",
};

const getCachedAbout = unstable_cache(
  async () => {
    await dbConnect();
    const data = await About.findOne().lean();
    if (!data) return DEFAULTS;
    const raw = JSON.parse(JSON.stringify(data));
    return {
      ...DEFAULTS,
      ...raw,
      story: { ...DEFAULTS.story, ...(raw.story || {}) },
    } as AboutData;
  },
  ["about-data"],
  { revalidate: 300, tags: ["about"] }
);

export async function getAbout(): Promise<AboutData> {
  return getCachedAbout();
}

export async function updateAbout(data: AboutData): Promise<{ success: boolean }> {
  await dbConnect();
  const existing = await About.findOne();
  if (existing) {
    await About.updateOne({}, data);
  } else {
    await About.create(data);
  }
  revalidateTag("about");
  return { success: true };
}
