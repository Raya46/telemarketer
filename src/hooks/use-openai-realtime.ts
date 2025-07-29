// hooks/useOpenAIRealtime.ts
import { useState, useRef, useCallback } from 'react';

// Tipe data untuk status koneksi
type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'closed' | 'error';

export const useOpenAIRealtime = () => {
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioQueueRef = useRef<Buffer[]>([]);
  const isPlayingRef = useRef(false);

  // --- Fungsi Utilitas dari contoh Anda, diadaptasi untuk browser ---
  const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  };

  const base64EncodeAudio = (float32Array: Float32Array): string => {
    const pcmData = floatTo16BitPCM(float32Array);
    const u8 = new Uint8Array(pcmData);
    const b64 = btoa(String.fromCharCode.apply(null, Array.from(u8)));
    return b64;
  };

  // --- Logika Pemutaran Audio ---
  const playNextInQueue = useCallback(() => {
    if (audioQueueRef.current.length === 0 || !audioContextRef.current) {
      isPlayingRef.current = false;
      return;
    }
    isPlayingRef.current = true;
    const audioChunk = audioQueueRef.current.shift();
    if (!audioChunk) return;

    const source = audioContextRef.current.createBufferSource();
    audioContextRef.current.decodeAudioData(audioChunk.buffer, (buffer) => {
      source.buffer = buffer;
      source.connect(audioContextRef.current!.destination);
      source.start();
      source.onended = playNextInQueue;
    }, (error) => {
        console.error("Error decoding audio data:", error);
        isPlayingRef.current = false;
    });
  }, []);

  // --- Fungsi Utama ---
  const connect = useCallback((systemPrompt: string) => {
    if (wsRef.current) return;

    setStatus('connecting');
    const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01&instructions=" + encodeURIComponent(systemPrompt);
    
    const ws = new WebSocket(url, {
      headers: {
        "Authorization": "Bearer " + process.env.NEXT_PUBLIC_OPENAI_API_KEY, // PERINGATAN KEAMANAN!
        "OpenAI-Beta": "realtime=v1",
      },
    });

    ws.onopen = () => {
      setStatus('connected');
      // Inisialisasi AudioContext setelah interaksi pengguna
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      switch (response.type) {
        case 'response.content_part.done':
          if (response.part.role === 'assistant') {
            setAiResponse(prev => prev + response.part.transcript);
          } else {
            setTranscript(response.part.transcript);
          }
          break;
        case 'response.audio.delta':
          const audioChunk = Buffer.from(response.delta, 'base64');
          audioQueueRef.current.push(audioChunk);
          if (!isPlayingRef.current) {
            playNextInQueue();
          }
          break;
        case 'response.done':
          // Siap untuk input berikutnya
          break;
        case 'error':
          console.error("OpenAI Error:", response.error);
          setStatus('error');
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setStatus('error');
    };

    ws.onclose = () => {
      setStatus('closed');
      wsRef.current = null;
    };

    wsRef.current = ws;
  }, []);

  const startRecording = useCallback(async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !audioContextRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
    processorRef.current = audioContextRef.current.createScriptProcessor(1024, 1, 1);

    processorRef.current.onaudioprocess = (event) => {
      const inputData = event.inputBuffer.getChannelData(0);
      const base64AudioData = base64EncodeAudio(inputData);
      
      wsRef.current?.send(JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: 'message',
          role: 'user',
          content: [{ type: 'input_audio', audio: base64AudioData }]
        }
      }));
    };

    microphoneRef.current.connect(processorRef.current);
    processorRef.current.connect(audioContextRef.current.destination);
  }, []);

  const stopRecordingAndGetResponse = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    
    // Minta AI untuk merespons
    if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'response.create' }));
    }
  }, []);
  
  const disconnect = useCallback(() => {
      if (wsRef.current) {
          wsRef.current.close();
      }
  }, []);

  return { status, transcript, aiResponse, connect, startRecording, stopRecordingAndGetResponse, disconnect };
};