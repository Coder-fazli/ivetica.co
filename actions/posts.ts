"use server";

import dbConnect from "@/lib/mongodb";
import { Post } from "@/models/Post";

export type PostSeo = { metaTitle: string; metaDescription: string };

export type PostType = {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  coverImage: string;
  content: string;
  published: boolean;
  seo: PostSeo;
  createdAt?: string;
  updatedAt?: string;
};

export async function getPosts(): Promise<PostType[]> {
  await dbConnect();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(posts));
}

export async function getPostBySlug(slug: string): Promise<PostType | null> {
  await dbConnect();
  // try slug first, fall back to _id for old posts
  let post = await Post.findOne({ slug }).lean();
  if (!post) {
    try { post = await Post.findById(slug).lean(); } catch { /* not an id */ }
  }
  return post ? JSON.parse(JSON.stringify(post)) : null;
}

export async function createPost(data: Omit<PostType, "_id">): Promise<PostType> {
  await dbConnect();
  const post = await Post.create(data);
  return JSON.parse(JSON.stringify(post));
}

export async function updatePost(id: string, data: Partial<PostType>): Promise<{ success: boolean }> {
  await dbConnect();
  await Post.findByIdAndUpdate(id, data);
  return { success: true };
}

export async function deletePost(id: string): Promise<{ success: boolean }> {
  await dbConnect();
  await Post.findByIdAndDelete(id);
  return { success: true };
}
