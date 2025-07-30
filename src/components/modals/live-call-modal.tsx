"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Lead, Agent } from "@/types/supabase";
import { PhoneOff } from "lucide-react";
import { BroadcastButton } from "@/components/broadcast-button";
import { TextInput } from "@/components/text-input";
import useWebRTCAudioSession from "@/hooks/use-webrtc";
import { tools } from "@/lib/tools"; // Pastikan path ini benar
import { MessageControls } from "../message-controls";

const colors = {
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  border: "#423966",
};

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
  // State untuk voice, bisa dibuat dinamis jika perlu
  const [voice, setVoice] = useState("ash");

  // PERBAIKAN: Panggil hook WebRTC dengan parameter yang diperlukan untuk konteks
  const {
    status,
    isSessionActive,
    handleStartStopClick,
    stopSession,
    conversation,
    sendTextMessage,
    msgs,
  } = useWebRTCAudioSession(voice, tools, agent, lead);

  // PERBAIKAN: systemPrompt tidak perlu dibuat di sini lagi, karena sudah ditangani di dalam hook.

  // Efek untuk memulai dan menghentikan sesi secara otomatis saat modal dibuka/ditutup
  useEffect(() => {
    // Jika modal terbuka dan sesi belum aktif, mulai panggilan.
    if (isOpen && !isSessionActive) {
      handleStartStopClick();
    }
  }, [isOpen]); // Hanya bergantung pada `isOpen` untuk trigger awal

  const handleEndCall = () => {
    // Hentikan sesi secara manual jika sedang aktif
    if (isSessionActive) {
      stopSession();
    }
    onClose(); // Tutup modal
  };

  return (
    // onOpenChange dipicu saat pengguna menutup dialog (misalnya dengan menekan tombol Esc atau mengklik di luar)
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleEndCall()}>
      <DialogContent
        className="max-w-2xl h-[90vh] flex flex-col p-4"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: colors.primaryText }}>
            {lead ? `Calling ${lead.full_name}` : "AI Assistant Call"}
          </DialogTitle>
          <p style={{ color: colors.secondaryText, fontSize: "0.9rem" }}>
            Agent: {agent?.agent_name} | Status: {status}
          </p>
        </DialogHeader>

        <div className="flex-grow flex flex-col items-center justify-between h-full space-y-4 overflow-hidden">
          {/* Tombol Broadcast di Atas */}
          <BroadcastButton
            isSessionActive={isSessionActive}
            onClick={handleStartStopClick}
          />

          {/* Kontrol Pesan dan Transkrip di Tengah */}
          <div className="w-full flex-grow flex flex-col gap-2 overflow-y-auto">
            <MessageControls conversation={conversation} msgs={msgs} />
          </div>

          {/* Input Teks di Bawah */}
          <div className="w-full mt-auto">
            <TextInput onSubmit={sendTextMessage} disabled={!isSessionActive} />
          </div>
        </div>

        <DialogFooter
          className="pt-4 border-t "
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
      </DialogContent>
    </Dialog>
  );
}
