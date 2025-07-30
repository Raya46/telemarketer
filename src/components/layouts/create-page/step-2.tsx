import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { FileText, Upload, X } from "lucide-react";
import { colors, agentTypes, tones } from "@/utils/create-static/data";
import type { StepProps } from "@/utils/create-static/data";

export function Step2CustomizeBehavior({ state, setState }: StepProps) {
  const handleKnowledgeFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      // Tambahkan file baru ke array yang sudah ada
      setState((prev) => ({
        ...prev,
        knowledgeBaseFiles: [
          ...prev.knowledgeBaseFiles,
          ...Array.from(e.target.files!),
        ],
      }));
    }
  };

  const removeKnowledgeFile = (indexToRemove: number) => {
    setState((prev) => ({
      ...prev,
      knowledgeBaseFiles: prev.knowledgeBaseFiles.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label style={{ color: colors.primaryText }}>Agent Type</Label>
          <Select
            value={state.agentType}
            onValueChange={(value) =>
              setState((prev) => ({ ...prev, agentType: value }))
            }
          >
            <SelectTrigger
              className="bg-transparent border-2"
              style={{ color: colors.primaryText, borderColor: colors.border }}
            >
              <SelectValue placeholder="Select agent type" />
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
            value={state.tone}
            onValueChange={(value) =>
              setState((prev) => ({ ...prev, tone: value }))
            }
          >
            <SelectTrigger
              className="bg-transparent border-2"
              style={{ color: colors.primaryText, borderColor: colors.border }}
            >
              <SelectValue placeholder="Select tone" />
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
        <Label htmlFor="agent-goal" style={{ color: colors.primaryText }}>
          Goals
        </Label>
        <Input
          id="agent-goal"
          placeholder="e.g., To book appointments for our sales team"
          value={state.goals}
          onChange={(e) =>
            setState((prev) => ({ ...prev, goals: e.target.value }))
          }
          className="bg-transparent border-2"
          style={{ color: colors.primaryText, borderColor: colors.border }}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="agent-background" style={{ color: colors.primaryText }}>
          Background
        </Label>
        <Input
          id="agent-background"
          placeholder="Explain your agent's background"
          value={state.background}
          onChange={(e) =>
            setState((prev) => ({ ...prev, background: e.target.value }))
          }
          className="bg-transparent border-2"
          style={{ color: colors.primaryText, borderColor: colors.border }}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="knowledge-base" style={{ color: colors.primaryText }}>
          Knowledge Base
        </Label>
        <p className="text-sm" style={{ color: colors.secondaryText }}>
          Upload documents (PDF, TXT, DOCX) to provide your agent with specific
          knowledge.
        </p>

        {/* Tampilkan daftar file yang diunggah */}
        <div className="space-y-2">
          {state.knowledgeBaseFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: colors.border }}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText
                  className="h-5 w-5 flex-shrink-0"
                  style={{ color: colors.primaryText }}
                />
                <span
                  className="text-sm font-medium truncate"
                  style={{ color: colors.primaryText }}
                  title={file.name}
                >
                  {file.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeKnowledgeFile(index)}
              >
                <X
                  className="h-4 w-4"
                  style={{ color: colors.secondaryText }}
                />
              </Button>
            </div>
          ))}
        </div>

        {/* Tombol upload */}
        <Label
          htmlFor="knowledge-upload"
          className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg mt-2"
          style={{
            borderColor: colors.dashedBorder,
            color: colors.secondaryText,
          }}
        >
          <Upload className="h-8 w-8 mb-2" />
          <span className="font-semibold" style={{ color: colors.primaryText }}>
            Click to upload files
          </span>
          <span>or drag and drop</span>
        </Label>
        <input
          id="knowledge-upload"
          type="file"
          className="hidden"
          multiple
          onChange={handleKnowledgeFileChange}
          accept=".pdf,.txt,.docx"
        />
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
          placeholder="Enter detailed instructions for the agent..."
          value={state.instructions}
          onChange={(e) =>
            setState((prev) => ({ ...prev, instructions: e.target.value }))
          }
          className="bg-transparent border-2"
          style={{ color: colors.primaryText, borderColor: colors.border }}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="agent-script" style={{ color: colors.primaryText }}>
            Script
          </Label>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.primaryText,
                    borderColor: colors.border,
                  }}
                >
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
              >
                <DialogHeader>
                  <DialogTitle style={{ color: colors.primaryText }}>
                    Sales Script Templates
                  </DialogTitle>
                  <DialogDescription style={{ color: colors.secondaryText }}>
                    Choose a template to get started.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-4" style={{ color: colors.primaryText }}>
                  Template content goes here...
                </div>
              </DialogContent>
            </Dialog>
            <Switch
              checked={state.useScript}
              onCheckedChange={(checked) =>
                setState((prev) => ({ ...prev, useScript: checked }))
              }
            />
          </div>
        </div>
        {state.useScript && (
          <Textarea
            id="agent-script"
            placeholder="Enter your sales script here..."
            value={state.script}
            onChange={(e) =>
              setState((prev) => ({ ...prev, script: e.target.value }))
            }
            className="bg-transparent border-2"
            style={{ color: colors.primaryText, borderColor: colors.border }}
          />
        )}
      </div>
    </div>
  );
}
