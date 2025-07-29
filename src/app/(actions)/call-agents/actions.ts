"use server";

import OpenAI from "openai";
import { toFile } from "openai/uploads";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}


interface ProcessResult {
  userMessage?: string;
  aiResponse?: string;
  audioBuffer?: ArrayBuffer; 
  error?: string;
}


interface TTSResult {
    audioBuffer?: ArrayBuffer;
    error?: string;
}

/**
 * Server Action untuk memproses audio dari pengguna, mendapatkan balasan dari GPT,
 * dan mengubah balasan tersebut menjadi audio dalam satu kali jalan.
 * @param formData - Data formulir yang berisi file audio rekaman.
 * @param conversationHistory - Riwayat percakapan saat ini.
 * @returns Objek yang berisi pesan pengguna, balasan AI, dan buffer audio dari balasan AI.
 */
export async function processAudioAndGetResponse(
  formData: FormData,
  conversationHistory: OpenAIMessage[]
): Promise<ProcessResult> {
  const audioFile = formData.get("audio") as File | null;

  if (!audioFile) {
    return { error: "No audio file provided." };
  }

  try {
    
    const fileForApi = await toFile(audioFile, "audio.webm");
    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fileForApi,
    });
    const userMessage = transcription.text;

    if (!userMessage) {
      return { error: "Could not understand audio." };
    }

    const updatedHistory = [...conversationHistory, { role: "user" as const, content: userMessage }];

    
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: updatedHistory,
    });
    const aiResponse = chatResponse.choices[0].message.content;

    if (!aiResponse) {
      return { userMessage, error: "AI failed to generate a response." };
    }

    
    
    
    
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova", 
        input: aiResponse,
    });
    const audioBuffer = await mp3.arrayBuffer();

    
    return { userMessage, aiResponse, audioBuffer };

  } catch (error) {
    console.error("[SERVER_ACTION_ERROR]", error);
    if (error instanceof OpenAI.APIError) {
        return { error: `OpenAI Error: ${error.message}` };
    }
    return { error: "An unexpected error occurred." };
  }
}


/**
 * Server Action terpisah yang hanya menangani Text-to-Speech.
 * Berguna untuk pesan selamat datang atau pesan lain yang tidak memerlukan input pengguna.
 * @param text - Teks yang ingin diubah menjadi suara.
 * @returns Objek yang berisi buffer audio atau pesan error.
 */
export async function getTextToSpeechAudio(text: string): Promise<TTSResult> {
    if (!text) {
        return { error: "No text provided for speech synthesis." };
    }

    try {
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "nova", 
            input: text,
        });
        const audioBuffer = await mp3.arrayBuffer();
        return { audioBuffer };

    } catch (error) {
        console.error("[TTS_ACTION_ERROR]", error);
        if (error instanceof OpenAI.APIError) {
            return { error: `OpenAI TTS Error: ${error.message}` };
        }
        return { error: "Failed to generate audio." };
    }
}
