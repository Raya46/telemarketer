

import { NextResponse } from "next/server";
import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { messages } = body;

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: messages, 
    });

    
    return NextResponse.json(response.choices[0].message);

  } catch (error) {
    console.error("[OPENAI_CHAT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}