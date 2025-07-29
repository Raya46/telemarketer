"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Lead, Agent } from "@/types/supabase";
import { Mic, MicOff, PhoneOff, Loader2 } from "lucide-react";
import {
  processTextAndGetResponse,
  getTextToSpeechAudio,
} from "@/app/(actions)/call-agents/actions";
import { useDeepgramTranscription } from "@/hooks/use-deepgram-transcription";

const colors = {
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  border: "#423966",
};

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function LiveCallModal({
  isOpen,
  onClose,
  lead,
  agent,
}: {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  agent: Agent | null;
}) {
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [statusText, setStatusText] = useState("Idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const conversationHistoryRef = useRef<OpenAIMessage[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isProcessingAudioRef = useRef(false);

  const {
    isListening,
    liveTranscript,
    startListening,
    stopListening,
    setOnTranscriptReady,
  } = useDeepgramTranscription();

  const buildSystemPrompt = (agent: Agent, lead: Lead): string => {
    return `You are an expert AI telemarketer. Your designated personality and instructions are below.
    ### AGENT PROFILE ###
    - Your Agent Type: ${agent.agent_type}
    - Your Voice Tone: ${agent.tone}
    - Language: ${agent.language}
    ### LEAD INFORMATION (The person you are calling) ###
    - Name: ${lead.full_name}
    - Phone: ${lead.phone_number}
    - Email: ${lead.email || "Not provided"}
    ### YOUR PRIMARY GOALS ###
    ${agent.goals}
    ### BACKGROUND & CONTEXT ###
    ${agent.background}
    ### STRICT INSTRUCTIONS YOU MUST FOLLOW ###
    ${agent.instructions}
    ### SCRIPT GUIDELINES (Use as a reference, be natural, not robotic) ###
    ${agent.script}
    ### CRITICAL RULES ###
    1. Always maintain the specified tone: ${agent.tone}.
    2. Keep responses conversational and concise (max 2-3 sentences).
    3. Address the lead by their name, ${lead.full_name}, when appropriate.
    4. If the call needs to end or you need to leave a voicemail, use this exact message: "${
      agent.voicemail_message
    }"
    5. You are a speaking AI. Your language must be natural for speech, not formal writing.
    6. Respond quickly and naturally. Keep responses under 50 words for real-time conversation.
    `;
  };

  const processAudioQueue = useCallback(async () => {
    if (isProcessingAudioRef.current || audioQueueRef.current.length === 0)
      return;

    isProcessingAudioRef.current = true;
    const audioBuffer = audioQueueRef.current.shift()!;
    const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);

    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play();
      audioPlayerRef.current.onended = () => {
        URL.revokeObjectURL(audioUrl);
        isProcessingAudioRef.current = false;

        if (audioQueueRef.current.length > 0) {
          processAudioQueue();
        } else {
          setIsSpeaking(false);
          setStatusText("Ready to listen");
          if (!isListening && !isProcessing) {
            startListening();
          }
        }
      };
    }
  }, [isListening, isProcessing, startListening]);

  const handleUserSpeech = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isSpeaking || isProcessing) return;

      stopListening();
      setIsProcessing(true);
      setStatusText("AI is thinking...");

      const userTranscript: TranscriptMessage = {
        role: "user",
        text: userText,
        timestamp: new Date(),
      };
      setTranscript((prev) => [...prev, userTranscript]);
      conversationHistoryRef.current.push({ role: "user", content: userText });

      const streamingMessageIndex = transcript.length + 1;
      const streamingMessage: TranscriptMessage = {
        role: "assistant",
        text: "",
        timestamp: new Date(),
        isStreaming: true,
      };
      setTranscript((prev) => [...prev, streamingMessage]);

      try {
        const result = await processTextAndGetResponse(
          conversationHistoryRef.current
        );
        if (result.error) throw new Error(result.error);

        if (result.aiResponse && result.audioBuffer) {
          setIsProcessing(false);
          setTranscript((prev) =>
            prev.map((msg, index) =>
              index === streamingMessageIndex
                ? { ...msg, text: result.aiResponse!, isStreaming: false }
                : msg
            )
          );
          conversationHistoryRef.current.push({
            role: "assistant",
            content: result.aiResponse,
          });

          audioQueueRef.current.push(result.audioBuffer);
          if (!isProcessingAudioRef.current) {
            setIsSpeaking(true);
            setStatusText("AI is speaking...");
            processAudioQueue();
          }
        }
      } catch (error) {
        console.error("Error processing text via Server Action:", error);
        setStatusText("Failed to get AI response.");
        setIsSpeaking(false);
        setIsProcessing(false);
        setTranscript((prev) =>
          prev.filter((_, index) => index !== streamingMessageIndex)
        );
        setTimeout(() => startListening(), 1000);
      }
    },
    [
      isSpeaking,
      isProcessing,
      stopListening,
      transcript.length,
      processAudioQueue,
      startListening,
    ]
  );

  useEffect(() => {
    setOnTranscriptReady(handleUserSpeech);
  }, [handleUserSpeech, setOnTranscriptReady]);

  const speakWelcomeMessage = async (text: string) => {
    setStatusText("AI is speaking...");
    setIsSpeaking(true);
    const welcomeTranscript: TranscriptMessage = {
      role: "assistant",
      text: text,
      timestamp: new Date(),
    };
    setTranscript([welcomeTranscript]);
    conversationHistoryRef.current.push({ role: "assistant", content: text });

    try {
      const result = await getTextToSpeechAudio(text);
      if (result.error || !result.audioBuffer)
        throw new Error(result.error || "No audio buffer received.");

      audioQueueRef.current.push(result.audioBuffer);
      processAudioQueue();
    } catch (error) {
      console.error("Error in speakWelcomeMessage:", error);
      setIsSpeaking(false);
      setStatusText("Error playing audio");
      setTimeout(() => startListening(), 1000);
    }
  };

  useEffect(() => {
    if (isOpen && agent && lead) {
      setTranscript([]);
      audioQueueRef.current = [];
      const systemPrompt = buildSystemPrompt(agent, lead);
      conversationHistoryRef.current = [
        { role: "system", content: systemPrompt },
      ];
      if (agent.welcome_message) {
        speakWelcomeMessage(agent.welcome_message);
      } else {
        setTimeout(() => startListening(), 500);
      }
    } else {
      stopListening();
    }
    return () => {
      stopListening();
      audioQueueRef.current = [];
    };
  }, [isOpen, agent, lead]);

  const handleToggleListening = () => {
    if (isSpeaking || isProcessing) return;
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleEndCall = () => {
    stopListening();
    audioQueueRef.current = [];
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = "";
    }
    onClose();
  };

  const getStatusDisplay = () => {
    if (isProcessing) return "AI is thinking...";
    if (isSpeaking) return "AI is speaking...";
    if (isListening) return liveTranscript || "Listening...";
    return statusText;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleEndCall}>
      <DialogContent
        className="max-w-4xl h-[80vh] flex flex-col p-0"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle style={{ color: colors.primaryText }}>
            {lead ? `Calling ${lead.full_name}` : "AI Assistant Call"}
          </DialogTitle>
          <p style={{ color: colors.secondaryText, fontSize: "0.9rem" }}>
            Agent: {agent?.agent_type} | Tone: {agent?.tone}
          </p>
        </DialogHeader>
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-hidden">
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <button
              onClick={handleToggleListening}
              disabled={isSpeaking || isProcessing}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 ${
                isListening ? "animate-pulse" : ""
              }`}
              style={{
                backgroundColor: isListening ? "#DC2626" : colors.accent,
              }}
            >
              {isProcessing ? (
                <Loader2 size={40} color="white" className="animate-spin" />
              ) : isListening ? (
                <MicOff size={40} color="white" />
              ) : (
                <Mic size={40} color="white" />
              )}
            </button>
            <p
              style={{ color: colors.secondaryText }}
              className="text-center h-5 px-4"
            >
              {getStatusDisplay()}
            </p>
          </div>
          <div className="flex flex-col h-full">
            <h3
              style={{ color: colors.primaryText }}
              className="font-bold mb-3"
            >
              Conversation Transcript
            </h3>
            <div className="flex-grow overflow-y-auto space-y-3 pr-2">
              {transcript.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className="max-w-xs md:max-w-sm p-3 rounded-lg"
                    style={{
                      backgroundColor:
                        msg.role === "user" ? colors.accent : colors.border,
                      color: colors.primaryText,
                    }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-sm capitalize flex items-center gap-1">
                        {msg.role === "user"
                          ? lead?.full_name || "User"
                          : "AI Agent"}
                      </p>
                      <p className="text-xs opacity-70">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">
                      {msg.text}
                      {msg.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-white animate-pulse ml-1"></span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter
          className="p-4 border-t"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center w-full justify-end">
            <button
              onClick={handleEndCall}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <PhoneOff size={16} /> End Call
            </button>
          </div>
        </DialogFooter>
        <audio ref={audioPlayerRef} hidden />
      </DialogContent>
    </Dialog>
  );
}
