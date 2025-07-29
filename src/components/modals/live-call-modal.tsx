"use client";

import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Lead, Agent } from "@/types/supabase";
import { Mic, MicOff } from "lucide-react";
import {
  getTextToSpeechAudio,
  processAudioAndGetResponse,
} from "@/app/(actions)/call-agents/actions";

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
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const conversationHistoryRef = useRef<OpenAIMessage[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

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
    1.  Always maintain the specified tone: ${agent.tone}.
    2.  Keep responses conversational and concise (max 2-3 sentences).
    3.  Address the lead by their name, ${lead.full_name}, when appropriate.
    4.  If the call needs to end or you need to leave a voicemail, use this exact message: "${
      agent.voicemail_message
    }"
    5.  You are a speaking AI. Your language must be natural for speech, not formal writing.
    `;
  };

  useEffect(() => {
    if (isOpen && agent && lead) {
      setTranscript([]);
      setStatusText("Ready to record");
      const systemPrompt = buildSystemPrompt(agent, lead);
      conversationHistoryRef.current = [
        { role: "system", content: systemPrompt },
      ];
      if (agent.welcome_message) {
        speakWelcomeMessage(agent.welcome_message);
      }
    }
  }, [isOpen, agent, lead]);

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

      const audioBlob = new Blob([result.audioBuffer], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioUrl;
        audioPlayerRef.current.play();
        audioPlayerRef.current.onended = () => {
          setIsSpeaking(false);
          setStatusText("Ready to record");
          URL.revokeObjectURL(audioUrl);
        };
      }
    } catch (error) {
      console.error("Error in speakWelcomeMessage:", error);
      setIsSpeaking(false);
      setStatusText("Error playing audio");
    }
  };

  const startRecording = async () => {
    if (isRecording) return;
    setStatusText("Listening...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setStatusText("Processing speech...");

        if (audioChunksRef.current.length === 0) {
          console.error("No audio data was recorded.");
          setStatusText("No audio detected. Please try again.");
          setIsRecording(false);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioFile = new File([audioBlob], "recording.webm", {
          type: "audio/webm",
        });

        const formData = new FormData();
        formData.append("audio", audioFile);

        try {
          const result = await processAudioAndGetResponse(
            formData,
            conversationHistoryRef.current
          );

          if (result.error) throw new Error(result.error);

          if (result.userMessage) {
            const userTranscript: TranscriptMessage = {
              role: "user",
              text: result.userMessage,
              timestamp: new Date(),
            };
            setTranscript((prev) => [...prev, userTranscript]);
            conversationHistoryRef.current.push({
              role: "user",
              content: result.userMessage,
            });
          }

          if (result.aiResponse && result.audioBuffer) {
            setStatusText("AI is speaking...");
            setIsSpeaking(true);

            const assistantTranscript: TranscriptMessage = {
              role: "assistant",
              text: result.aiResponse,
              timestamp: new Date(),
            };
            setTranscript((prev) => [...prev, assistantTranscript]);
            conversationHistoryRef.current.push({
              role: "assistant",
              content: result.aiResponse,
            });

            const audioBlob = new Blob([result.audioBuffer], {
              type: "audio/mpeg",
            });
            const audioUrl = URL.createObjectURL(audioBlob);

            if (audioPlayerRef.current) {
              audioPlayerRef.current.src = audioUrl;
              audioPlayerRef.current.play();
              audioPlayerRef.current.onended = () => {
                setIsSpeaking(false);
                setStatusText("Ready to record");
                URL.revokeObjectURL(audioUrl);
              };
            }
          }
        } catch (error) {
          console.error("Error processing audio via Server Action:", error);
          setStatusText("Failed to process speech.");
          setIsSpeaking(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Could not start recording:", error);
      setStatusText("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isSpeaking}
              className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50"
              style={{
                backgroundColor: isRecording ? "#DC2626" : colors.accent,
              }}
            >
              {isRecording ? (
                <MicOff size={40} color="white" />
              ) : (
                <Mic size={40} color="white" />
              )}
            </button>
            <p
              style={{ color: colors.secondaryText }}
              className="text-center h-5"
            >
              {statusText}
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
                      <p className="font-bold text-sm capitalize">
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
                    <p className="text-sm">{msg.text}</p>
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
              onClick={onClose}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              End Call
            </button>
          </div>
        </DialogFooter>
        <audio ref={audioPlayerRef} hidden />
      </DialogContent>
    </Dialog>
  );
}
