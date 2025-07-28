"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save, Copy } from "lucide-react";
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

// --- Tipe Data & Data Rekaan ---
const languages = [
  { value: "id", label: "Indonesia" },
  { value: "en", label: "English" },
];
const voices = [
  { value: "professional_male", label: "Professional Male" },
  { value: "professional_female", label: "Professional Female" },
  { value: "friendly_male", label: "Friendly Male" },
  { value: "friendly_female", label: "Friendly Female" },
];
const agentTypes = [
  { value: "sales", label: "Sales Representative" },
  { value: "support", label: "Support Agent" },
  { value: "engagement", label: "Lead Engagement" },
];
const tones = [
  { value: "conversational", label: "Conversational" },
  { value: "professional", label: "Professional" },
  { value: "humorous", label: "Humorous" },
];

export default function ConfigurePage() {
  const [config, setConfig] = useState({
    agentName: "Sales Bot",
    language: "en",
    voice: "professional_male",
    twilioNumber: "+15551234567",
    useWelcomeMessage: true,
    welcomeMessage:
      "Hello! Thanks for calling Acme Inc. How can I help you today?",
    voicemailMessage:
      "Sorry we missed your call. Please leave a message after the beep.",
    callRecordings: true,
    agentType: "sales",
    tone: "professional",
    goals: "To book appointments for our sales team.",
    background: "An AI assistant from Acme Inc. specializing in product demos.",
    instructions:
      "1. Greet the user warmly.\n2. Ask about their needs.\n3. Offer to schedule a demo.",
    useScript: false,
    script: "",
    includeEmail: true,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const embedCode = `<script src="https://your-domain.com/embed/agent_12345.js"></script>`;
  const webhookUrl = `https://your-api.com/webhook/agent_12345`;

  return (
    <div
      className="min-h-screen p-4 sm:p-6 space-y-6"
      style={{ backgroundColor: colors.background }}
    >
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: colors.primaryText }}
        >
          Configure Agent
        </h1>
        <p className="text-gray-500" style={{ color: colors.secondaryText }}>
          Ubah dan simpan pengaturan untuk agen AI Anda di sini.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Konfigurasi Utama */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <CardHeader>
              <CardTitle style={{ color: colors.primaryText }}>
                General Settings
              </CardTitle>
              <CardDescription style={{ color: colors.secondaryText }}>
                Pengaturan dasar untuk identitas agen Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="agent-name"
                  style={{ color: colors.primaryText }}
                >
                  Name
                </Label>
                <Input
                  id="agent-name"
                  value={config.agentName}
                  onChange={(e) =>
                    handleInputChange("agentName", e.target.value)
                  }
                  className="bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                  style={{
                    color: colors.primaryText,
                    borderColor: colors.border,
                  }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label style={{ color: colors.primaryText }}>Language</Label>
                  <Select
                    value={config.language}
                    onValueChange={(value) =>
                      handleInputChange("language", value)
                    }
                  >
                    <SelectTrigger
                      className="bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                      style={{
                        color: colors.primaryText,
                        borderColor: colors.border,
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      }}
                    >
                      {languages.map((l) => (
                        <SelectItem
                          key={l.value}
                          value={l.value}
                          style={{ color: colors.primaryText }}
                        >
                          {l.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label style={{ color: colors.primaryText }}>Voice</Label>
                  <Select
                    value={config.voice}
                    onValueChange={(value) => handleInputChange("voice", value)}
                  >
                    <SelectTrigger
                      className="bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                      style={{
                        color: colors.primaryText,
                        borderColor: colors.border,
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      }}
                    >
                      {voices.map((v) => (
                        <SelectItem
                          key={v.value}
                          value={v.value}
                          style={{ color: colors.primaryText }}
                        >
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <CardHeader>
              <CardTitle style={{ color: colors.primaryText }}>
                Behavior & Personality
              </CardTitle>
              <CardDescription style={{ color: colors.secondaryText }}>
                Tentukan bagaimana agen Anda berinteraksi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label style={{ color: colors.primaryText }}>
                    Agent Type
                  </Label>
                  <Select
                    value={config.agentType}
                    onValueChange={(value) =>
                      handleInputChange("agentType", value)
                    }
                  >
                    <SelectTrigger
                      className="bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                      style={{
                        color: colors.primaryText,
                        borderColor: colors.border,
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      }}
                    >
                      {agentTypes.map((t) => (
                        <SelectItem
                          key={t.value}
                          value={t.value}
                          style={{ color: colors.primaryText }}
                        >
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label style={{ color: colors.primaryText }}>Tone</Label>
                  <Select
                    value={config.tone}
                    onValueChange={(value) => handleInputChange("tone", value)}
                  >
                    <SelectTrigger
                      className="bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                      style={{
                        color: colors.primaryText,
                        borderColor: colors.border,
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      }}
                    >
                      {tones.map((t) => (
                        <SelectItem
                          key={t.value}
                          value={t.value}
                          style={{ color: colors.primaryText }}
                        >
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="agent-instructions"
                  style={{ color: colors.primaryText }}
                >
                  Instructions
                </Label>
                <Textarea
                  id="agent-instructions"
                  placeholder="Enter detailed instructions..."
                  value={config.instructions}
                  onChange={(e) =>
                    handleInputChange("instructions", e.target.value)
                  }
                  className="min-h-[100px] bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                  style={{
                    color: colors.primaryText,
                    borderColor: colors.border,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Pengaturan Tambahan */}
        <div className="space-y-6">
          <Card
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <CardHeader>
              <CardTitle style={{ color: colors.primaryText }}>
                Call Handling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label style={{ color: colors.primaryText }}>
                    Welcome Message
                  </Label>
                  <Switch
                    checked={config.useWelcomeMessage}
                    onCheckedChange={(checked) =>
                      handleInputChange("useWelcomeMessage", checked)
                    }
                    style={{
                      backgroundColor: config.useWelcomeMessage
                        ? colors.accent
                        : colors.border,
                    }}
                  />
                </div>
                {config.useWelcomeMessage && (
                  <Textarea
                    placeholder="Hello! How can I help?"
                    value={config.welcomeMessage}
                    onChange={(e) =>
                      handleInputChange("welcomeMessage", e.target.value)
                    }
                    className="bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                    style={{
                      color: colors.primaryText,
                      borderColor: colors.border,
                    }}
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <Label style={{ color: colors.primaryText }}>
                  Call Recordings
                </Label>
                <Switch
                  checked={config.callRecordings}
                  onCheckedChange={(checked) =>
                    handleInputChange("callRecordings", checked)
                  }
                  style={{
                    backgroundColor: config.callRecordings
                      ? colors.accent
                      : colors.border,
                  }}
                />
              </div>
            </CardContent>
          </Card>
          <Card
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <CardHeader>
              <CardTitle style={{ color: colors.primaryText }}>
                Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label style={{ color: colors.primaryText }}>Embed Code</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={embedCode}
                    className="font-mono text-xs bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                    style={{
                      color: colors.primaryText,
                      borderColor: colors.border,
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigator.clipboard.writeText(embedCode)}
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.primaryText,
                      borderColor: colors.border,
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        colors.accentHover)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = colors.accent)
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label style={{ color: colors.primaryText }}>
                  Webhook Endpoint
                </Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={webhookUrl}
                    className="font-mono text-xs bg-transparent border-2 focus:ring-1 focus:ring-offset-0 focus:ring-offset-transparent"
                    style={{
                      color: colors.primaryText,
                      borderColor: colors.border,
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigator.clipboard.writeText(webhookUrl)}
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.primaryText,
                      borderColor: colors.border,
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        colors.accentHover)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = colors.accent)
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={() => alert("Pengaturan disimpan!")}
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
