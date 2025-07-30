"use client";

import { BroadcastButton } from "@/components/broadcast-button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useWebRTCAudioSession from "@/hooks/use-webrtc";
import { Tool, tools } from "@/lib/tools";
import { Agent, Lead } from "@/types/supabase";
import { PhoneOff } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
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
  const combinedTools = useMemo(() => {
    const agentSpecificTools: Tool[] = [
      {
        type: "function",
        name: "search_knowledge_base",
        description:
          "Searches the knowledge base for specific information about products, services, terms, or other details. Use this when you don't know the answer to a user's question.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                "A detailed question or search term to look up in the knowledge base.",
            },
          },
          required: ["query"],
        },
      },
    ];
    return [...tools, ...agentSpecificTools];
  }, []);

  const searchKnowledgeBase = useCallback(
    async (args: Record<string, unknown>) => {
      // Lakukan type guarding untuk memastikan 'query' ada dan bertipe string
      if (typeof args.query !== "string") {
        const errorMsg =
          "Invalid or missing 'query' parameter for search_knowledge_base.";
        console.error(errorMsg);
        return { error: errorMsg };
      }

      const query = args.query; // Sekarang 'query' aman untuk digunakan

      if (!agent?.id) {
        const errorMsg = "Agent ID is not available to search knowledge base.";
        console.error(errorMsg);
        return { error: errorMsg };
      }

      try {
        const response = await fetch("/api/rag-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, agentId: agent.id }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Failed to search knowledge base");
        }

        const data = await response.json();
        return { result: data.context || "No relevant information was found." };
      } catch (error) {
        console.error("RAG search failed:", error);
        if (error instanceof Error) {
          return { error: error.message };
        }
        return { error: "An unknown error occurred during RAG search." };
      }
    },
    [agent?.id] // Dependensi tetap pada agent.id
  );

  const {
    status,
    isSessionActive,
    handleStartStopClick,
    stopSession,
    conversation,
    msgs,
    registerFunction,
  } = useWebRTCAudioSession("ash", combinedTools, agent, lead);

  useEffect(() => {
    if (registerFunction) {
      registerFunction("search_knowledge_base", searchKnowledgeBase);
    }
  }, [registerFunction, searchKnowledgeBase]); // Tambahkan searchKnowledgeBase ke dependensi

  useEffect(() => {
    if (isOpen && !isSessionActive) {
      handleStartStopClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isSessionActive]); // Hapus handleStartStopClick dari dependensi

  const handleEndCall = () => {
    if (isSessionActive) {
      stopSession();
    }
    onClose();
  };

  return (
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
          <BroadcastButton
            isSessionActive={isSessionActive}
            onClick={handleStartStopClick}
          />

          <div className="w-full flex-grow flex flex-col gap-2 overflow-y-auto">
            <MessageControls conversation={conversation} msgs={msgs} />
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
