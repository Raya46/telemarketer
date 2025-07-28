"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useConversation } from "@elevenlabs/react";
import { Lead } from "@/types/supabase";

const colors = {
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  border: "#423966",
};

interface TranscriptMessage {
  role: "user" | "ai" | "tool" | "system";
  text: string;
}

export function LiveCallModal({
  isOpen,
  onClose,
  lead,
}: {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}) {
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  const { startSession, endSession, isSpeaking, status } = useConversation({
    onMessage: (msg) => {
      setTranscript((prev) => [
        ...prev,
        { role: msg.source, text: msg.message },
      ]);
    },
    onError: (err) => {
      console.error("Conversational AI Error:", err);
    },
  });

  useEffect(() => {
    const checkMicrophone = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.error("Microphone access denied:", err);
      }
    };
    checkMicrophone();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTranscript([]);

      startSession({
        agentId: "agent_6501k16552psem6rpfq04xj2gczr",
        connectionType: "webrtc",
      });
    }
    return () => {
      endSession();
    };
  }, [isOpen]);

  const getStatusText = () => {
    if (status === "connecting") return "Connecting...";
    if (status === "connected") return "Call in progress";
    if (status === "disconnected") return "Call ended";
    return "Idle";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl h-[80vh] flex flex-col p-0"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle style={{ color: colors.primaryText }}>
            {lead ? `Calling ${lead.full_name}` : "Assistant Demo"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-hidden">
          {/* Sisi Kiri: Visualisasi Audio */}
          <div className="flex flex-col items-center justify-center h-full">
            <div className="audio-visualizer mb-4">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className={`bar ${isSpeaking ? "speaking" : ""}`}
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    backgroundColor: colors.accent,
                  }}
                ></div>
              ))}
            </div>
            <p style={{ color: colors.secondaryText }}>
              {isSpeaking ? "Assistant is speaking..." : "Listening..."}
            </p>
          </div>

          {/* Sisi Kanan: Transkrip */}
          <div className="flex flex-col-reverse h-full overflow-y-auto space-y-4 space-y-reverse pr-2">
            {transcript.map((msg: TranscriptMessage, index: number) => (
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
                  <p className="font-bold text-sm mb-1 capitalize">
                    {msg.role}
                  </p>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter
          className="p-4 border-t"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center w-full justify-between">
            <div
              className="flex items-center gap-2"
              style={{ color: colors.primaryText }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  status === "connected"
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-500"
                }`}
              ></div>
              {getStatusText()}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
