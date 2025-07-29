"use server";

import OpenAI from "openai";
import { toFile } from "openai/uploads";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY_2,
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

    
    const audioStream = await elevenlabs.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", { 
        text: aiResponse,
        modelId: "eleven_multilingual_v2",
    });

    
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
        chunks.push(chunk);
    }
    const content = Buffer.concat(chunks);
    const audioBuffer = content.buffer as ArrayBuffer;

    
    return { userMessage, aiResponse, audioBuffer };

  } catch (error) {
    console.error("[SERVER_ACTION_ERROR]", error);
    return { error: "An unexpected error occurred during processing." };
  }
}


export async function getTextToSpeechAudio(text: string): Promise<TTSResult> {
    if (!text) {
        return { error: "No text provided for speech synthesis." };
    }

    try {
        
        const audioStream = await elevenlabs.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", { 
            text: text,
            modelId: "eleven_multilingual_v2",
        });

        
        const chunks: Buffer[] = [];
        for await (const chunk of audioStream) {
            chunks.push(chunk);
        }
        const content = Buffer.concat(chunks);
        const audioBuffer = content.buffer as ArrayBuffer;

        return { audioBuffer };

    } catch (error) {
        console.error("[TTS_ACTION_ERROR]", error);
        return { error: "Failed to generate audio from ElevenLabs." };
    }
}