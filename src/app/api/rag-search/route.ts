// app/api/rag-search/route.ts
import { createClient } from "@/utils/supabase/server";

import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // 2. Panggil fungsi PostgreSQL 'match_agent_documents'
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
    const context = documents.map(doc => doc.content).join('\n\n---\n\n');

    return NextResponse.json({ context });

  } catch (error) {
    console.error('RAG Search API Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}