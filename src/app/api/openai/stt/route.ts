// Lokasi: src/app/api/openai/stt/route.ts

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { toFile } from "openai/uploads";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return new NextResponse("No audio file provided", { status: 400 });
    }

    // PERBAIKAN: Pastikan nama file diberikan ke helper 'toFile'
    // Ini membantu API mengidentifikasi formatnya dengan benar.
    const fileForApi = await toFile(audioFile, "audio.webm");

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fileForApi,
    });

    // Mengembalikan hasil transkripsi dalam format JSON
    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("[OPENAI_STT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}