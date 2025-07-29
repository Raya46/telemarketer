"use server";

import OpenAI from "openai";
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

export async function* processTextAndGetStreamingResponse(
  conversationHistory: OpenAIMessage[]
): AsyncGenerator<{
  type: 'text_chunk' | 'text_complete' | 'audio_chunk' | 'audio_complete' | 'error';
  data?: any;
  error?: string;
}, void, unknown> {
  
  const userMessage = conversationHistory.findLast(m => m.role === 'user')?.content;
  
  if (!userMessage) {
    yield { type: 'error', error: "No user message found in the provided history." };
    return;
  }

  try {
    let fullAiResponse = "";

    
    const chatStream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: conversationHistory,
      stream: true,
      max_tokens: 150,
      temperature: 0.7,
    });

    for await (const chunk of chatStream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullAiResponse += content;
        yield { type: 'text_chunk', data: content };
      }
    }

    yield { type: 'text_complete', data: fullAiResponse };

    
    if (fullAiResponse) {
      try {
        const audioStream = await elevenlabs.textToSpeech.stream("JBFqnCBsd6RMkjVDRZzb", {
          text: fullAiResponse,
          modelId: "eleven_multilingual_v2",
          outputFormat: "mp3_22050_32",
        });

        const audioChunks: Buffer[] = [];
        for await (const audioChunk of audioStream) {
          audioChunks.push(audioChunk);
          
          const chunkCopy = audioChunk.buffer.slice(audioChunk.byteOffset, audioChunk.byteOffset + audioChunk.byteLength);
          yield { type: 'audio_chunk', data: chunkCopy };
        }
        
        const finalAudio = Buffer.concat(audioChunks);
        
        const finalAudioCopy = finalAudio.buffer.slice(finalAudio.byteOffset, finalAudio.byteOffset + finalAudio.byteLength);
        yield { 
          type: 'audio_complete', 
          data: finalAudioCopy
        };

      } catch (audioError) {
        console.error("Audio generation error:", audioError);
        yield { type: 'error', error: "Audio generation failed" };
      }
    }

  } catch (error) {
    console.error("[STREAMING_ERROR]", error);
    yield { type: 'error', error: "An unexpected error occurred during processing." };
  }
}

/**
 * Non-streaming fallback for compatibility
 */
export async function processTextAndGetResponse(
  conversationHistory: OpenAIMessage[]
): Promise<{
  userMessage?: string;
  aiResponse?: string;
  audioBuffer?: ArrayBuffer;
  error?: string;
}> {
  const userMessage = conversationHistory.findLast(m => m.role === 'user')?.content;
  
  if (!userMessage) {
    return { error: "No user message found in the provided history." };
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: conversationHistory,
      max_tokens: 100,
      temperature: 0.7,
    });
    
    const aiResponse = chatResponse.choices[0].message.content;
    
    if (!aiResponse) {
      return { userMessage, error: "AI failed to generate a response." };
    }

    const audioStream = await elevenlabs.textToSpeech.stream("JBFqnCBsd6RMkjVDRZzb", {
      text: aiResponse,
      modelId: "eleven_multilingual_v2",
      outputFormat: "mp3_22050_32",
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const content = Buffer.concat(chunks);
    
    const audioBuffer = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength);

    return { userMessage, aiResponse, audioBuffer };

  } catch (error) {
    console.error("[SERVER_ACTION_ERROR]", error);
    return { error: "An unexpected error occurred during processing." };
  }
}

/**
 * Optimized TTS for welcome messages
 */
export async function getTextToSpeechAudio(text: string): Promise<{
  audioBuffer?: ArrayBuffer;
  error?: string;
}> {
  if (!text) {
    return { error: "No text provided for speech synthesis." };
  }

  try {
    const audioStream = await elevenlabs.textToSpeech.stream("JBFqnCBsd6RMkjVDRZzb", {
      text: text,
      modelId: "eleven_multilingual_v2",
      outputFormat: "mp3_22050_32",
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const content = Buffer.concat(chunks);
    
    const audioBuffer = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength);

    return { audioBuffer };

  } catch (error) {
    console.error("[TTS_ACTION_ERROR]", error);
    return { error: "Failed to generate audio from ElevenLabs." };
  }
}
