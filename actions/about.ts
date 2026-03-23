"use server";

import dbConnect from "@/lib/mongodb";
import { About } from "@/models/About";

export type ValueItem = { number: string; title: string; text: string };
export type TeamMember = { name: string; role: string; photo: string };
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
    { name: "Anna Oldman",   role: "Art Director",   photo: "/img/faces/1.jpg" },
    { name: "Oscar Freeman", role: "Frontend Dev",   photo: "/img/faces/3.jpg" },
    { name: "Emma Newman",   role: "Founder",        photo: "/img/faces/2.jpg" },
    { name: "Lisa Trueman",  role: "UI/UX Designer", photo: "/img/faces/4.jpg" },
    { name: "Tom Oldman",    role: "Art Director",   photo: "/img/faces/5.jpg" },
    { name: "Corey Trueman", role: "Art Director",   photo: "/img/faces/6.jpg" },
    { name: "Justin Newman", role: "Videographer",   photo: "/img/faces/7.jpg" },
    { name: "Spunkie",       role: "Paw giver",      photo: "/img/faces/8.jpg" },
  ],
};

export async function getAbout(): Promise<AboutData> {
  await dbConnect();
  const data = await About.findOne().lean();
  return data ? JSON.parse(JSON.stringify(data)) : DEFAULTS;
}

export async function updateAbout(data: AboutData): Promise<{ success: boolean }> {
  await dbConnect();
  const existing = await About.findOne();
  if (existing) {
    await About.updateOne({}, data);
  } else {
    await About.create(data);
  }
  return { success: true };
}
