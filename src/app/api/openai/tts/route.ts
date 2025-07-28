// Lokasi: src/app/api/openai/tts/route.ts

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voice = "alloy" } = body; // Anda bisa memilih suara lain: 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'

    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }

    // Memanggil API TTS OpenAI
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
    });

    // Mengubah response menjadi buffer dan mengirimkannya sebagai file audio
    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("[OPENAI_TTS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}