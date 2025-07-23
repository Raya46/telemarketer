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

// --- Tipe Data & Data Rekaan ---
const languages = [ { value: "id", label: "Indonesia" }, { value: "en", label: "English" } ];
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
const tones = [ { value: "conversational", label: "Conversational" }, { value: "professional", label: "Professional" }, { value: "humorous", label: "Humorous" } ];


// --- Komponen Utama ---
export default function ConfigurePage() {
  // State untuk menampung semua data konfigurasi (diisi dengan data rekaan)
  const [config, setConfig] = useState({
    agentName: "Sales Bot",
    language: "en",
    voice: "professional_male",
    twilioNumber: "+15551234567",
    useWelcomeMessage: true,
    welcomeMessage: "Hello! Thanks for calling Acme Inc. How can I help you today?",
    voicemailMessage: "Sorry we missed your call. Please leave a message after the beep.",
    callRecordings: true,
    agentType: "sales",
    tone: "professional",
    goals: "To book appointments for our sales team.",
    background: "An AI assistant from Acme Inc. specializing in product demos.",
    instructions: "1. Greet the user warmly.\n2. Ask about their needs.\n3. Offer to schedule a demo.",
    useScript: false,
    script: "",
    includeEmail: true,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const embedCode = `<script src="https://your-domain.com/embed/agent_12345.js"></script>`;
  const webhookUrl = `https://your-api.com/webhook/agent_12345`;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configure Agent</h1>
        <p className="text-gray-500">
          Ubah dan simpan pengaturan untuk agen AI Anda di sini.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Konfigurasi Utama */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Pengaturan dasar untuk identitas agen Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="agent-name">Name</Label>
                <Input id="agent-name" value={config.agentName} onChange={(e) => handleInputChange('agentName', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Language</Label>
                  <Select value={config.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{languages.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Voice</Label>
                  <Select value={config.voice} onValueChange={(value) => handleInputChange('voice', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{voices.map(v => <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Behavior & Personality</CardTitle>
              <CardDescription>Tentukan bagaimana agen Anda berinteraksi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Agent Type</Label>
                  <Select value={config.agentType} onValueChange={(value) => handleInputChange('agentType', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{agentTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Tone</Label>
                  <Select value={config.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{tones.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
               <div className="grid gap-2">
                <Label htmlFor="agent-instructions">Instructions</Label>
                <Textarea id="agent-instructions" placeholder="Enter detailed instructions..." value={config.instructions} onChange={(e) => handleInputChange('instructions', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Pengaturan Tambahan */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Call Handling</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                        <Label>Welcome Message</Label>
                        <Switch checked={config.useWelcomeMessage} onCheckedChange={(checked) => handleInputChange('useWelcomeMessage', checked)} />
                        </div>
                        {config.useWelcomeMessage && <Textarea placeholder="Hello! How can I help?" value={config.welcomeMessage} onChange={(e) => handleInputChange('welcomeMessage', e.target.value)} />}
                    </div>
                     <div className="flex items-center justify-between">
                        <Label>Call Recordings</Label>
                        <Switch checked={config.callRecordings} onCheckedChange={(checked) => handleInputChange('callRecordings', checked)} />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Embed Code</Label>
                        <div className="flex gap-2">
                        <Input readOnly value={embedCode} className="font-mono text-xs" />
                        <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(embedCode)}><Copy className="h-4 w-4" /></Button>
                        </div>
                    </div>
                     <div className="grid gap-2">
                        <Label>Webhook Endpoint</Label>
                        <div className="flex gap-2">
                        <Input readOnly value={webhookUrl} className="font-mono text-xs" />
                        <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(webhookUrl)}><Copy className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button onClick={() => alert('Pengaturan disimpan!')}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
        </Button>
      </div>
    </div>
  );
}
