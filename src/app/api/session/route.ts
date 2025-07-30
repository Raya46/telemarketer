import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            // Error ini akan ditangkap oleh blok catch di bawah
            throw new Error(`OPENAI_API_KEY environment variable is not set`);
        }

        // 1. Baca body dari request untuk mendapatkan system prompt yang dikirim dari frontend
        const body = await req.json();
        const { systemPrompt } = body;

        // Validasi bahwa systemPrompt ada di dalam body request
        if (!systemPrompt || typeof systemPrompt !== 'string') {
            return NextResponse.json(
                { error: "Bad Request: 'systemPrompt' is required in the request body and must be a string." },
                { status: 400 }
            );
        }

        // 2. Gunakan system prompt yang diterima untuk membuat sesi di OpenAI
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                modalities: ["audio", "text"],
                instructions: systemPrompt, // Gunakan system prompt dinamis
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`OpenAI API Error: ${errorBody}`);
            throw new Error(`API request to OpenAI failed with status ${response.status}`);
        }

        const data = await response.json();

        // Kembalikan data sesi (termasuk client_secret) ke frontend
        return NextResponse.json(data);

    } catch (error) {
        console.error("Error in /api/session:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        // Kembalikan response error yang jelas
        return NextResponse.json(
            { error: `Failed to create session: ${errorMessage}` },
            { status: 500 }
        );
    }
}
