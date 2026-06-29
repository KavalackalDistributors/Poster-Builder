import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import type { ChatMessage, PosterDesign } from '@/lib/types';

const fallbackDesign: PosterDesign = {
  headline: 'Fresh New Campaign',
  tagline: 'Made to stop the scroll',
  description: 'A clean, high-impact poster concept tailored to your brand and audience.',
  cta: 'Shop Now',
  backgroundColor: '#111827',
  accentColor: '#f59e0b',
  textColor: '#ffffff',
  style: 'modern',
  layout: 'centered',
};

const systemPrompt = `You are PosterAI, a friendly expert poster design assistant. Help users create marketing posters from their product details, colors, taglines, and layout preferences.
Respond with a short friendly design explanation first. Then ALWAYS end every response with one fenced json block containing only this exact shape:
{
  "headline": "...",
  "tagline": "...",
  "description": "...",
  "cta": "...",
  "backgroundColor": "#hex",
  "accentColor": "#hex",
  "textColor": "#hex",
  "style": "modern|bold|minimal|luxury|playful",
  "layout": "centered|left-aligned|split"
}
Use valid hex colors. Keep poster copy concise and persuasive.`;

function extractPoster(raw: string): { reply: string; poster: PosterDesign } {
  const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
  if (!match) return { reply: raw.trim(), poster: fallbackDesign };

  try {
    const poster = JSON.parse(match[1]) as PosterDesign;
    const reply = raw.replace(match[0], '').trim() || 'I updated your poster with a fresh design direction.';
    return { reply, poster: { ...fallbackDesign, ...poster } };
  } catch {
    return { reply: raw.replace(match[0], '').trim(), poster: fallbackDesign };
  }
}

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages?: ChatMessage[] };
    if (!messages?.length) {
      return NextResponse.json({ error: 'Please send at least one message.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: systemPrompt });
    const conversation = messages.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join('\n');
    const result = await model.generateContent(conversation);
    const raw = result.response.text();
    const { reply, poster } = extractPoster(raw);

    return NextResponse.json({ reply, poster });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'PosterAI had trouble designing that. Please try again.' }, { status: 500 });
  }
}
