"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Check,
  X,
  Clock,
  PhoneMissed,
  PlusIcon,
  TestTubeDiagonal,
} from "lucide-react";
import { CallWithDetails } from "@/app/(actions)/dashboard/actions";
import { Agent, Lead } from "@/types/supabase";
import { AddLeadModal } from "../modals/add-lead-modal";
// Impor LiveCallModal yang akan kita gunakan
import { LiveCallModal } from "../modals/live-call-modal";

const colors = {
  background: "#1C162C",
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  border: "#423966",
};

type CallOutcome = "completed" | "failed" | "no-answer" | "busy" | "pending";

const StatusBadge = ({ status }: { status: string | null }) => {
  const statusConfig = {
    completed: { icon: <Check className="h-3 w-3" />, text: "Completed" },
    failed: { icon: <X className="h-3 w-3" />, text: "Failed" },
    "no-answer": {
      icon: <PhoneMissed className="h-3 w-3" />,
      text: "No Answer",
    },
    busy: { icon: <Clock className="h-3 w-3" />, text: "Busy" },
    pending: { icon: <Clock className="h-3 w-3" />, text: "Pending" },
  };
  const config = statusConfig[status as CallOutcome] || {
    icon: <Clock className="h-3 w-3" />,
    text: "Unknown",
  };
  return (
    <Badge
      variant="outline"
      className="gap-1.5"
      style={{ borderColor: colors.border, color: colors.primaryText }}
    >
      {config.icon} {config.text}
    </Badge>
  );
};

export function CallHistoryClient({
  initialCalls,
  initialLeads,
  agent,
}: {
  initialCalls: CallWithDetails[];
  initialLeads: Lead[];
  agent: Agent | null;
}) {
  const [isAddLeadModalOpen, setAddLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // State untuk mengontrol visibilitas modal panggilan
  const [isLiveCallModalOpen, setLiveCallModalOpen] = useState(false);

  // Hook useWebRTCAudioSession telah dipindahkan ke LiveCallModal

  const displayList = initialLeads.map((lead) => {
    const callForLead = initialCalls.find((call) => call.lead_id === lead.id);
    return {
      type: "lead" as const,
      id: lead.id,
      contactName: lead.full_name,
      contactNumber: lead.phone_number,
      status: callForLead ? callForLead.outcome : "not_contacted",
      duration: callForLead?.call_duration_seconds,
      date: callForLead ? callForLead.start_time : null,
    };
  });

  // Fungsi ini sekarang memilih lead dan membuka modal
  const handleInitiateCall = (lead: Lead) => {
    if (!agent) return;
    setSelectedLead(lead);
    setLiveCallModalOpen(true);
  };

  // Fungsi ini membuat lead demo dan membuka modal
  const handleTestAssistant = () => {
    if (!agent) return;
    const demoLead: Lead = {
      id: "demo-lead-01",
      full_name: "Test Caller",
      phone_number: "N/A",
      email: "test@example.com",
      created_at: new Date().toISOString(),
      status: "new",
      address: "N/A",
      last_contacted_at: null,
    };
    setSelectedLead(demoLead);
    setLiveCallModalOpen(true);
  };

  return (
    <>
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setAddLeadModalOpen(false)}
      />

      {/* Render LiveCallModal dan kontrol visibilitasnya dengan state */}
      <LiveCallModal
        isOpen={isLiveCallModalOpen}
        onClose={() => setLiveCallModalOpen(false)}
        lead={selectedLead}
        agent={agent}
      />

      <div
        className="min-h-screen p-4 sm:p-6 space-y-6"
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: colors.primaryText }}
            >
              Call History & Leads
            </h1>
            <p style={{ color: colors.secondaryText }}>
              Manage your leads and view call history.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setAddLeadModalOpen(true)}
              className="font-semibold text-white transition-colors"
              style={{ backgroundColor: colors.accent }}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
            <Button
              onClick={handleTestAssistant}
              variant="outline"
              disabled={!agent}
              style={{
                borderColor: colors.border,
                color: colors.primaryText,
              }}
            >
              <TestTubeDiagonal className="w-4 h-4 mr-2" />
              Test Assistant
            </Button>
          </div>
        </div>

        <Card
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: colors.primaryText }}>
              Leads & Call Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow style={{ borderBottomColor: colors.border }}>
                  <TableHead style={{ color: colors.secondaryText }}>
                    Contact
                  </TableHead>
                  <TableHead style={{ color: colors.secondaryText }}>
                    Status
                  </TableHead>
                  <TableHead style={{ color: colors.secondaryText }}>
                    Duration
                  </TableHead>
                  <TableHead style={{ color: colors.secondaryText }}>
                    Last Contacted
                  </TableHead>
                  <TableHead
                    className="text-right"
                    style={{ color: colors.secondaryText }}
                  >
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayList.map((item) => (
                  <TableRow
                    key={item.id}
                    style={{
                      borderBottomColor: colors.border,
                      color: colors.primaryText,
                    }}
                  >
                    <TableCell>
                      <div className="font-medium">{item.contactName}</div>
                      <div
                        className="text-sm"
                        style={{ color: colors.secondaryText }}
                      >
                        {item.contactNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.status === "not_contacted" ? (
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: colors.border,
                            color: colors.secondaryText,
                          }}
                        >
                          Not Contacted
                        </Badge>
                      ) : (
                        <StatusBadge status={item.status} />
                      )}
                    </TableCell>
                    <TableCell>
                      {item.duration
                        ? `${Math.floor(item.duration / 60)}m ${
                            item.duration % 60
                          }s`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!agent}
                        onClick={() =>
                          handleInitiateCall(
                            initialLeads.find((l) => l.id === item.id)!
                          )
                        }
                        style={{
                          backgroundColor: colors.accent,
                          color: "white",
                          borderColor: colors.accent,
                        }}
                      >
                        <Phone className="h-4 w-4 mr-2" /> Call
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
