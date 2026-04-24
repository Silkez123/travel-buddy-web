import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const { destination, startDate, endDate, weather } = await req.json();

  if (!destination) {
    return NextResponse.json({ error: "destination required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  const weatherSummary = weather
    ? `Weather forecast: ${weather.description}, temperatures ${weather.tempMin}°C–${weather.tempMax}°C, precipitation ${weather.precipitation}mm.`
    : "";

  const tripDays =
    startDate && endDate
      ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
      : null;

  const prompt = `You are a travel packing expert. Create a concise, practical packing list for a trip to ${destination}${tripDays ? ` for ${tripDays} days` : ""}${startDate ? ` starting ${startDate}` : ""}.

${weatherSummary}

Respond ONLY with a JSON object in this exact format — no markdown, no explanation:
{
  "categories": [
    {
      "name": "Category Name",
      "emoji": "emoji",
      "items": ["item 1", "item 2", "item 3"]
    }
  ],
  "tips": ["tip 1", "tip 2", "tip 3"]
}

Include 5–7 categories (e.g. Clothing, Toiletries, Documents, Electronics, Health, Activities, Snacks). Keep items short and specific to the destination and weather. Give 3 destination-specific travel tips.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }
}
