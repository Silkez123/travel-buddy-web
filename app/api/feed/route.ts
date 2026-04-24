import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export interface FeedPost {
  id: string;
  location: string;
  message: string;
  photo: string;
  templateId: string;
  author: string;
  createdAt: string;
  likes: number;
}

const FEED_KEY = "feed:posts";
const MAX_POSTS = 200;

export async function GET() {
  try {
    const posts = await kv.lrange<FeedPost>(FEED_KEY, 0, 49);
    return NextResponse.json(posts ?? []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { location, message, photo, templateId, author } = body;

  if (!location || !message || !photo) {
    return NextResponse.json({ error: "location, message, and photo required" }, { status: 400 });
  }

  const post: FeedPost = {
    id: `fp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    location: String(location).slice(0, 80),
    message: String(message).slice(0, 280),
    photo: String(photo),
    templateId: String(templateId ?? "classic"),
    author: String(author ?? "Traveler").slice(0, 40),
    createdAt: new Date().toISOString(),
    likes: 0,
  };

  await kv.lpush(FEED_KEY, post);
  await kv.ltrim(FEED_KEY, 0, MAX_POSTS - 1);

  return NextResponse.json(post, { status: 201 });
}
