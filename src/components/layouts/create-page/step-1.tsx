import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import {
  colors,
  languages,
  StepProps,
  voices,
} from "@/utils/create-static/data";

export function Step1AgentConfig({ state, setState }: StepProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setState((prev) => ({ ...prev, avatarFile: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={avatarPreview || "https://github.com/shadcn.png"}
            alt={state.agentName || "Agent Avatar"}
          />
          <AvatarFallback
            style={{
              backgroundColor: colors.border,
              color: colors.primaryText,
            }}
          >
            AI
          </AvatarFallback>
        </Avatar>
        <div>
          <Label
            htmlFor="avatar-upload"
            className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium border px-4 py-2"
            style={{
              backgroundColor: colors.accent,
              color: colors.primaryText,
              borderColor: colors.border,
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose File
          </Label>
          <input
            id="avatar-upload"
            type="file"
            className="hidden"
            onChange={handleAvatarChange}
            accept="image/*"
          />
          <p className="text-xs mt-1" style={{ color: colors.secondaryText }}>
            PNG, JPG, GIF up to 5MB.
          </p>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="agent-name" style={{ color: colors.primaryText }}>
          Name
        </Label>
        <Input
          id="agent-name"
          placeholder="e.g., Sales Bot"
          value={state.agentName}
          onChange={(e) =>
            setState((prev) => ({ ...prev, agentName: e.target.value }))
          }
          className="bg-transparent border-2"
          style={{ color: colors.primaryText, borderColor: colors.border }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label style={{ color: colors.primaryText }}>Language</Label>
          <Select
            value={state.language}
            onValueChange={(value) =>
              setState((prev) => ({ ...prev, language: value }))
            }
          >
            <SelectTrigger
              className="bg-transparent border-2"
              style={{ color: colors.primaryText, borderColor: colors.border }}
            >
              <SelectValue placeholder="Select language" />
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
            value={state.voice}
            onValueChange={(value) =>
              setState((prev) => ({ ...prev, voice: value }))
            }
          >
            <SelectTrigger
              className="bg-transparent border-2"
              style={{ color: colors.primaryText, borderColor: colors.border }}
            >
              <SelectValue placeholder="Select voice" />
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
      <div className="grid gap-2">
        <Label htmlFor="twilio-number" style={{ color: colors.primaryText }}>
          Twilio Phone Number
        </Label>
        <Input
          id="twilio-number"
          placeholder="+1 (555) 123-4567"
          value={state.twilioNumber}
          onChange={(e) =>
            setState((prev) => ({ ...prev, twilioNumber: e.target.value }))
          }
          className="bg-transparent border-2"
          style={{ color: colors.primaryText, borderColor: colors.border }}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="welcome-message"
            style={{ color: colors.primaryText }}
          >
            Welcome Message
          </Label>
          <Switch
            checked={state.useWelcomeMessage}
            onCheckedChange={(checked) =>
              setState((prev) => ({ ...prev, useWelcomeMessage: checked }))
            }
          />
        </div>
        {state.useWelcomeMessage && (
          <Textarea
            id="welcome-message"
            placeholder="e.g., Hello! Thanks for calling. How can I help you today?"
            value={state.welcomeMessage}
            onChange={(e) =>
              setState((prev) => ({ ...prev, welcomeMessage: e.target.value }))
            }
            className="bg-transparent border-2"
            style={{ color: colors.primaryText, borderColor: colors.border }}
          />
        )}
      </div>
      <div className="grid gap-2">
        <Label
          htmlFor="voicemail-message"
          style={{ color: colors.primaryText }}
        >
          Voicemail
        </Label>
        <Textarea
          id="voicemail-message"
          placeholder="This is the message we will play when we receive a machine call."
          value={state.voicemailMessage}
          onChange={(e) =>
            setState((prev) => ({ ...prev, voicemailMessage: e.target.value }))
          }
          className="bg-transparent border-2"
          style={{ color: colors.primaryText, borderColor: colors.border }}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label style={{ color: colors.primaryText }}>Call Recordings</Label>
        <Switch
          checked={state.callRecordings}
          onCheckedChange={(checked) =>
            setState((prev) => ({ ...prev, callRecordings: checked }))
          }
        />
      </div>
    </div>
  );
}
