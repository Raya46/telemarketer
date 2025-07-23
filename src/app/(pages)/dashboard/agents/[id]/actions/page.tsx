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
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Actions</h1>
        <p className="text-gray-500">
          Konfigurasi tool dan aksi yang dapat dilakukan oleh agen AI Anda.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tool Calling Actions</CardTitle>
          <CardDescription>
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
                  className="flex items-center justify-between p-4 rounded-lg border bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="h-6 w-6 text-gray-600" />
                    <div>
                      <Label htmlFor={action.id} className="font-semibold">
                        {action.name}
                      </Label>
                      <p className="text-sm text-gray-500">
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
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button onClick={() => alert("Perubahan disimpan!")}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
