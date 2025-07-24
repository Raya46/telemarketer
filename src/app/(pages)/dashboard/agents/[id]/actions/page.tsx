"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Mail, Calendar, Zap } from "lucide-react";
import { useState } from "react";

const colors = {
  background: "#1C162C",
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  accentHover: "#6941C6",
  border: "#423966",
};

// Tipe data untuk setiap aksi/tool
interface AgentAction {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

// Data rekaan untuk daftar tool yang tersedia
const initialActions: AgentAction[] = [
  {
    id: "send_email",
    name: "Send Email Summary",
    description: "Allows the agent to send an email summary of the conversation.",
    icon: Mail,
    enabled: true,
  },
  {
    id: "schedule_meeting",
    name: "Schedule Meeting",
    description: "Allows the agent to book appointments in a connected calendar.",
    icon: Calendar,
    enabled: false,
  },
  {
    id: "trigger_webhook",
    name: "Trigger Zapier/Webhook",
    description: "Send data to external services through a webhook.",
    icon: Zap,
    enabled: true,
  },
];

export default function ActionsPage() {
  // State untuk mengelola status aktif/nonaktif dari setiap aksi
  const [actions, setActions] = useState<AgentAction[]>(initialActions);

  const handleToggleAction = (id: string, enabled: boolean) => {
    setActions(
      actions.map((action) =>
        action.id === id ? { ...action, enabled } : action
      )
    );
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6 space-y-6"
      style={{ backgroundColor: colors.background }}
    >
      <div>
        <h1 className="text-2xl font-bold" style={{ color: colors.primaryText }}>
          Actions
        </h1>
        <p className="text-gray-500" style={{ color: colors.secondaryText }}>
          Konfigurasi tool dan aksi yang dapat dilakukan oleh agen AI Anda.
        </p>
      </div>

      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <CardHeader>
          <CardTitle style={{ color: colors.primaryText }}>Tool Calling Actions</CardTitle>
          <CardDescription style={{ color: colors.secondaryText }}>
            Aktifkan atau nonaktifkan kemampuan agen untuk menggunakan tool eksternal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{ backgroundColor: colors.card, borderColor: colors.border }}
                >
                  <div className="flex items-center gap-4">
                    <Icon className="h-6 w-6" style={{ color: colors.secondaryText }} />
                    <div>
                      <Label htmlFor={action.id} className="font-semibold" style={{ color: colors.primaryText }}>
                        {action.name}
                      </Label>
                      <p className="text-sm text-gray-500" style={{ color: colors.secondaryText }}>
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={action.id}
                    checked={action.enabled}
                    onCheckedChange={(checked) =>
                      handleToggleAction(action.id, checked)
                    }
                    style={{ backgroundColor: action.enabled ? colors.accent : colors.border }}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button
          onClick={() => alert("Perubahan disimpan!")}
          style={{ backgroundColor: colors.accent, color: colors.primaryText }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = colors.accentHover)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = colors.accent)
          }
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
