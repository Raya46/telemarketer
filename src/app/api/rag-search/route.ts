// app/api/rag-search/route.ts
import { createClient } from "@/utils/supabase/server";

import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// BARU: Definisikan tipe untuk hasil dari fungsi RPC
interface MatchedDocument {
  content: string;
  similarity: number;
  id: number;
}

export async function POST(req: NextRequest) {
  try {
    const { query, agentId } = await req.json();

    if (!query || !agentId) {
      return NextResponse.json({ error: 'Query and agentId are required' }, { status: 400 });
    }

    // 1. Buat embedding dari pertanyaan pengguna
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    const supabase = await createClient();
    const { data: documents, error } = await supabase.rpc('match_agent_documents', {
      p_agent_id: agentId,
      query_embedding: queryEmbedding,
      match_threshold: 0.78, // Sesuaikan ambang batas ini sesuai kebutuhan
      match_count: 3,        // Ambil 3 potongan paling relevan
    });

    if (error) {
      console.error('Supabase RPC Error:', error);
      return NextResponse.json({ error: 'Failed to search knowledge base' }, { status: 500 });
    }

    // 3. Gabungkan konten menjadi satu string untuk dikirim kembali
    // DIPERBAIKI: Terapkan tipe MatchedDocument ke parameter 'doc'
    const context = (documents as MatchedDocument[]).map(doc => doc.content).join('\n\n---\n\n');

    return NextResponse.json({ context });

  } catch (error) {
    console.error('RAG Search API Error:', error);
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
