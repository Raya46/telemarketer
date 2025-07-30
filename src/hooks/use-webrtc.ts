"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Conversation } from "@/types/conversation";
import { Agent, Lead } from "@/types/supabase";

// DIPERBAIKI: Tipe yang lebih spesifik untuk menghindari 'any' dan 'Function'
export interface Tool {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

// Tipe untuk fungsi yang didaftarkan, menggunakan tipe yang lebih aman
type RegisteredFunction = (args: Record<string, unknown>) => Promise<unknown> | unknown;

// Tipe dasar untuk pesan dari data channel, menggunakan 'unknown' daripada 'any'
interface DataChannelMessage {
  type: string;
  [key: string]: unknown;
}

interface UseWebRTCAudioSessionReturn {
  status: string;
  isSessionActive: boolean;
  audioIndicatorRef: React.RefObject<HTMLDivElement | null>;
  startSession: () => Promise<void>;
  stopSession: () => void;
  handleStartStopClick: () => void;
  registerFunction: (name: string, fn: RegisteredFunction) => void;
  msgs: DataChannelMessage[];
  currentVolume: number;
  conversation: Conversation[];
  sendTextMessage: (text: string) => void;
}

export default function useWebRTCAudioSession(
  voice: string,
  tools: Tool[],
  agent: Agent | null,
  lead: Lead | null
): UseWebRTCAudioSessionReturn {
  const [status, setStatus] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const audioIndicatorRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const [msgs, setMsgs] = useState<DataChannelMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const functionRegistry = useRef<Record<string, RegisteredFunction>>({});
  const [currentVolume, setCurrentVolume] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumeIntervalRef = useRef<number | null>(null);
  const ephemeralUserMessageIdRef = useRef<string | null>(null);

  const registerFunction = useCallback((name: string, fn: RegisteredFunction) => {
    functionRegistry.current[name] = fn;
  }, []);

  const configureDataChannel = useCallback(
    (dataChannel: RTCDataChannel) => {
      const sessionUpdate = {
        type: "session.update",
        session: {
          modalities: ["text", "audio"],
          tools: tools || [],
          input_audio_transcription: { model: "whisper-1" },
        },
      };
      dataChannel.send(JSON.stringify(sessionUpdate));
      console.log("Session update sent:", sessionUpdate);

      const languageMessage = {
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: "Indonesian" }],
        },
      };
      dataChannel.send(JSON.stringify(languageMessage));

      if (agent?.use_welcome_message && agent?.welcome_message) {
        console.log("Triggering AI to speak the welcome message...");
        const initialResponseTrigger = { type: "response.create" };
        dataChannel.send(JSON.stringify(initialResponseTrigger));
      }
    },
    [tools, agent]
  );

  function getOrCreateEphemeralUserId(): string {
    let ephemeralId = ephemeralUserMessageIdRef.current;
    if (!ephemeralId) {
      ephemeralId = uuidv4();
      ephemeralUserMessageIdRef.current = ephemeralId;
      const newMessage: Conversation = {
        id: ephemeralId,
        role: "user",
        text: "",
        timestamp: new Date().toISOString(),
        isFinal: false,
        status: "speaking",
      };
      setConversation((prev) => [...prev, newMessage]);
    }
    return ephemeralId;
  }

  function updateEphemeralUserMessage(partial: Partial<Conversation>) {
    const ephemeralId = ephemeralUserMessageIdRef.current;
    if (!ephemeralId) return;
    setConversation((prev) =>
      prev.map((msg) => (msg.id === ephemeralId ? { ...msg, ...partial } : msg))
    );
  }

  function clearEphemeralUserMessage() {
    ephemeralUserMessageIdRef.current = null;
  }

  const handleDataChannelMessage = useCallback(async (event: MessageEvent) => {
    try {
      const msg: DataChannelMessage = JSON.parse(event.data);
      switch (msg.type) {
        case "input_audio_buffer.speech_started": {
          getOrCreateEphemeralUserId();
          updateEphemeralUserMessage({ status: "speaking" });
          break;
        }
        case "input_audio_buffer.speech_stopped": {
          updateEphemeralUserMessage({ status: "speaking" });
          break;
        }
        case "input_audio_buffer.committed": {
          updateEphemeralUserMessage({
            text: "Processing speech...",
            status: "processing",
          });
          break;
        }
        case "conversation.item.input_audio_transcription": {
          const partialText =
            msg.transcript ?? msg.text ?? "User is speaking...";
          updateEphemeralUserMessage({
            text: partialText,
            status: "speaking",
            isFinal: false,
          });
          break;
        }
        case "conversation.item.input_audio_transcription.completed": {
          updateEphemeralUserMessage({
            text: msg.transcript || "",
            isFinal: true,
            status: "final",
          });
          clearEphemeralUserMessage();
          break;
        }
        case "response.audio_transcript.delta": {
          const newMessage: Conversation = {
            id: uuidv4(),
            role: "assistant",
            text: msg.delta,
            timestamp: new Date().toISOString(),
            isFinal: false,
          };
          setConversation((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === "assistant" && !lastMsg.isFinal) {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...lastMsg,
                text: lastMsg.text + msg.delta,
              };
              return updated;
            } else {
              return [...prev, newMessage];
            }
          });
          break;
        }
        case "response.audio_transcript.done": {
          setConversation((prev) => {
            if (prev.length === 0) return prev;
            const updated = [...prev];
            updated[updated.length - 1].isFinal = true;
            return updated;
          });
          break;
        }
        case "response.function_call_arguments.done": {
          const fn = functionRegistry.current[msg.name];
          if (fn) {
            const args = JSON.parse(msg.arguments);
            const result = await fn(args);
            const response = {
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: msg.call_id,
                output: JSON.stringify(result),
              },
            };
            dataChannelRef.current?.send(JSON.stringify(response));
            const responseCreate = { type: "response.create" };
            dataChannelRef.current?.send(JSON.stringify(responseCreate));
          }
          break;
        }
        default: {
          break;
        }
      }
      setMsgs((prevMsgs) => [...prevMsgs, msg]);
      return msg;
    } catch (error) {
      console.error("Error handling data channel message:", error);
    }
  }, []);

  const getEphemeralToken = useCallback(async () => {
    try {
      const systemPrompt = `You are an expert AI telemarketer. Your designated personality and instructions are below.
    ### AGENT PROFILE ###
    - Your Agent Type: ${agent?.agent_type}
    - Your Voice Tone: ${agent?.tone}
    - Language: Indonesia
    ### LEAD INFORMATION (The person you are calling) ###
    - Name: ${lead?.full_name}
    - Phone: ${lead?.phone_number}
    - Email: ${lead?.email || "Not provided"}
    ### YOUR PRIMARY GOALS ###
    ${agent?.goals}
    ### BACKGROUND & CONTEXT ###
    ${agent?.background}
    ### STRICT INSTRUCTIONS YOU MUST FOLLOW ###
    ${agent?.instructions}
    ### SCRIPT GUIDELINES (Use as a reference, be natural, not robotic) ###
    ${agent?.script}
    ### CRITICAL RULES ###
    1. **Start the conversation immediately** with a warm greeting. Do not wait for the user to speak first. Your first sentence should be: "${
      agent?.welcome_message || "Halo, ada yang bisa saya bantu?"
    }"
    2. Always maintain the specified tone: ${agent?.tone}.
    3. Keep responses conversational and concise (max 2-3 sentences).
    4. Address the lead by their name, ${
      lead?.full_name
    }, when appropriate.
    5. If the call needs to end or you need to leave a voicemail, use this exact message: "${
      agent?.voicemail_message
    }"
    6. You are a speaking AI. Your language must be natural for speech, not formal writing.
    7. Respond quickly and naturally. Keep responses under 50 words for real-time conversation.
    
    ### KNOWLEDGE BASE ACCESS ###
      If you need to find information that is not in your initial instructions or script (like specific product details, terms and conditions, or complex user questions), you MUST use the "search_knowledge_base" tool. Do not make up answers. To use the tool, formulate a clear question based on the user's query.
    `;

      console.log("Generated System Prompt:", systemPrompt);

      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          `Failed to get ephemeral token: ${response.status} - ${errorBody.error}`
        );
      }
      const data = await response.json();
      return data.client_secret.value;
    } catch (err) {
      console.error("getEphemeralToken error:", err);
      setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }
  }, [agent, lead]);

  function setupAudioVisualization(stream: MediaStream) {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    source.connect(analyzer);
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const updateIndicator = () => {
      if (!audioContext) return;
      analyzer.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      if (audioIndicatorRef.current) {
        audioIndicatorRef.current.classList.toggle("active", average > 30);
      }
      requestAnimationFrame(updateIndicator);
    };
    updateIndicator();
    audioContextRef.current = audioContext;
  }

  function getVolume(): number {
    if (!analyserRef.current) return 0;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const float = (dataArray[i] - 128) / 128;
      sum += float * float;
    }
    return Math.sqrt(sum / dataArray.length);
  }

  const stopSession = useCallback(() => {
    if (dataChannelRef.current) dataChannelRef.current.close();
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
    if (audioStreamRef.current)
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    if (audioIndicatorRef.current)
      audioIndicatorRef.current.classList.remove("active");
    if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);

    dataChannelRef.current = null;
    peerConnectionRef.current = null;
    audioContextRef.current = null;
    audioStreamRef.current = null;
    analyserRef.current = null;
    volumeIntervalRef.current = null;
    ephemeralUserMessageIdRef.current = null;

    setCurrentVolume(0);
    setIsSessionActive(false);
    setStatus("Session stopped");
    setMsgs([]);
    setConversation([]);
  }, []);

  const startSession = useCallback(async () => {
    try {
      if (!agent) {
        setStatus("Error: Agent context is missing. Cannot start session.");
        console.error("Agent context is missing. Cannot start session.");
        return;
      }

      setStatus("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      setupAudioVisualization(stream);

      setStatus("Fetching ephemeral token with agent context...");
      const ephemeralToken = await getEphemeralToken();

      setStatus("Establishing connection...");
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;

      pc.ontrack = (event) => {
        audioEl.srcObject = event.streams[0];
        const audioCtx = new (window.AudioContext || window.AudioContext)();
        const src = audioCtx.createMediaStreamSource(event.streams[0]);
        const inboundAnalyzer = audioCtx.createAnalyser();
        inboundAnalyzer.fftSize = 256;
        src.connect(inboundAnalyzer);
        analyserRef.current = inboundAnalyzer;
        volumeIntervalRef.current = window.setInterval(() => {
          setCurrentVolume(getVolume());
        }, 100);
      };

      const dataChannel = pc.createDataChannel("response");
      dataChannelRef.current = dataChannel;
      dataChannel.onopen = () => configureDataChannel(dataChannel);
      dataChannel.onmessage = handleDataChannelMessage;

      pc.addTrack(stream.getTracks()[0]);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const response = await fetch(`${baseUrl}?model=${model}&voice=${voice}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralToken}`,
          "Content-Type": "application/sdp",
        },
      });

      const answerSdp = await response.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setIsSessionActive(true);
      setStatus("Session established successfully!");
    } catch (err) {
      console.error("startSession error:", err);
      setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
      stopSession();
    }
  }, [agent, voice, getEphemeralToken, configureDataChannel, handleDataChannelMessage, stopSession]);

  const handleStartStopClick = useCallback(() => {
    if (isSessionActive) {
      stopSession();
    } else {
      startSession();
    }
  }, [isSessionActive, startSession, stopSession]);

  const sendTextMessage = useCallback((text: string) => {
    if (!dataChannelRef.current || dataChannelRef.current.readyState !== "open") {
      console.error("Data channel not ready");
      return;
    }
    const messageId = uuidv4();
    const newMessage: Conversation = {
      id: messageId,
      role: "user",
      text,
      timestamp: new Date().toISOString(),
      isFinal: true,
      status: "final",
    };
    setConversation((prev) => [...prev, newMessage]);
    const message = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: text }],
      },
    };
    const response = { type: "response.create" };
    dataChannelRef.current.send(JSON.stringify(message));
    dataChannelRef.current.send(JSON.stringify(response));
  }, []);

  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  return {
    status,
    isSessionActive,
    audioIndicatorRef,
    startSession,
    stopSession,
    handleStartStopClick,
    registerFunction,
    msgs,
    currentVolume,
    conversation,
    sendTextMessage,
  };
}
