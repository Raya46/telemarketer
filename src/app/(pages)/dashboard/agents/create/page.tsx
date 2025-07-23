"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper"; // Asumsi Anda memiliki komponen Stepper
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Copy,
  Upload,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAgent } from "@/app/(actions)/agents/actions"; 


// --- Data & Tipe ---
const steps = [
  { id: 1, name: "Agent Config", description: "Setup your agent" },
  { id: 2, name: "Customize Behavior", description: "Define agent's personality" },
  { id: 3, name: "Embed Agent", description: "Integrate with your tools" },
];

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

// --- Komponen untuk Setiap Langkah ---

function Step1AgentConfig({ state, setState }: any) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setState({ ...state, avatarFile: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarPreview || "https://github.com/shadcn.png"} alt={state.agentName} />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <Upload className="mr-2 h-4 w-4" />
            Choose File
          </Label>
          <input id="avatar-upload" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB.</p>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="agent-name">Name</Label>
        <Input id="agent-name" placeholder="e.g., Sales Bot" value={state.agentName} onChange={(e) => setState({ ...state, agentName: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Language</Label>
          <Select value={state.language} onValueChange={(value) => setState({ ...state, language: value })}>
            <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
            <SelectContent>{languages.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Voice</Label>
          <Select value={state.voice} onValueChange={(value) => setState({ ...state, voice: value })}>
            <SelectTrigger><SelectValue placeholder="Select voice" /></SelectTrigger>
            <SelectContent>{voices.map(v => <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="twilio-number">Twilio Phone Number</Label>
        <Input id="twilio-number" placeholder="+1 (555) 123-4567" value={state.twilioNumber} onChange={(e) => setState({ ...state, twilioNumber: e.target.value })} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="welcome-message">Welcome Message</Label>
          <Switch checked={state.useWelcomeMessage} onCheckedChange={(checked) => setState({ ...state, useWelcomeMessage: checked })} />
        </div>
        {state.useWelcomeMessage && <Textarea id="welcome-message" placeholder="e.g., Hello! Thanks for calling. How can I help you today?" value={state.welcomeMessage} onChange={(e) => setState({ ...state, welcomeMessage: e.target.value })} />}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="voicemail-message">Voicemail</Label>
        <Textarea id="voicemail-message" placeholder="This is the message we will play when we receive a machine call." value={state.voicemailMessage} onChange={(e) => setState({ ...state, voicemailMessage: e.target.value })} />
      </div>
      <div className="flex items-center justify-between">
        <Label>Call Recordings</Label>
        <Switch checked={state.callRecordings} onCheckedChange={(checked) => setState({ ...state, callRecordings: checked })} />
      </div>
    </div>
  );
}

function Step2CustomizeBehavior({ state, setState }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Agent Type</Label>
          <Select value={state.agentType} onValueChange={(value) => setState({ ...state, agentType: value })}>
            <SelectTrigger><SelectValue placeholder="Select agent type" /></SelectTrigger>
            <SelectContent>{agentTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Tone</Label>
          <Select value={state.tone} onValueChange={(value) => setState({ ...state, tone: value })}>
            <SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger>
            <SelectContent>{tones.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="agent-goal">Goals</Label>
        <Input id="agent-goal" placeholder="e.g., To book appointments for our sales team" value={state.goals} onChange={(e) => setState({ ...state, goals: e.target.value })} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="agent-background">Background</Label>
        <Input id="agent-background" placeholder="Explain your agent's background" value={state.background} onChange={(e) => setState({ ...state, background: e.target.value })} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="agent-instructions">Instructions</Label>
        <Textarea id="agent-instructions" placeholder="Enter detailed instructions for the agent..." value={state.instructions} onChange={(e) => setState({ ...state, instructions: e.target.value })} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="agent-script">Script</Label>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild><Button variant="outline">Templates</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Sales Script Templates</DialogTitle><DialogDescription>Choose a template to get started.</DialogDescription></DialogHeader>
                <div className="p-4">Template content goes here...</div>
              </DialogContent>
            </Dialog>
            <Switch checked={state.useScript} onCheckedChange={(checked) => setState({ ...state, useScript: checked })} />
          </div>
        </div>
        {state.useScript && <Textarea id="agent-script" placeholder="Enter your sales script here..." value={state.script} onChange={(e) => setState({ ...state, script: e.target.value })} />}
      </div>
    </div>
  );
}

function Step3EmbedAgent({ state, setState }: any) {
  const embedCode = `<script src="https://your-domain.com/embed/${state.agentId || 'your-agent-id'}.js"></script>`;
  const webhookUrl = `https://your-api.com/webhook/${state.agentId || 'your-agent-id'}`;

  return (
    <div className="space-y-8">
      <div className="grid gap-2">
        <Label>Embed Agent on Website</Label>
        <div className="flex gap-2">
          <Textarea readOnly value={embedCode} className="font-mono text-xs" />
          <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(embedCode)}><Copy className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label>Include Email Field in Webform</Label>
        <Switch checked={state.includeEmail} onCheckedChange={(checked) => setState({ ...state, includeEmail: checked })} />
      </div>
      <div className="grid gap-2">
        <Label>Webhook Endpoint</Label>
        <div className="flex gap-2">
          <Textarea readOnly value={webhookUrl} className="font-mono text-xs" />
          <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(webhookUrl)}><Copy className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Required Fields</Label>
        <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
                <Checkbox id="req-name" checked={state.requireName} onCheckedChange={(checked) => setState({ ...state, requireName: !!checked })} />
                <Label htmlFor="req-name">Name</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="req-phone" checked={state.requirePhone} onCheckedChange={(checked) => setState({ ...state, requirePhone: !!checked })} />
                <Label htmlFor="req-phone">Phone Number</Label>
            </div>
        </div>
      </div>
      {(state.requireName || state.requirePhone) && (
        <Card className="bg-slate-50 p-6">
            <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={state.avatarFile ? URL.createObjectURL(state.avatarFile) : "https://github.com/shadcn.png"} />
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>{state.agentName || "Your Agent"}</CardTitle>
                    <CardDescription>Live Preview</CardDescription>
                </div>
            </div>
            <div className="space-y-4">
                {state.requireName && <Input placeholder="Name" />}
                {state.requirePhone && <Input placeholder="Phone Number" />}
                <Button className="w-full">Call Me Now</Button>
            </div>
        </Card>
      )}
    </div>
  );
}


// --- Komponen Utama ---
export default function CreateAgentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  
  // State terpusat untuk semua data form
  const [formState, setFormState] = useState({
    // agentId: 'agent_' + crypto.randomUUID(),
    avatarFile: null as File | null,
    agentName: '',
    language: 'id',
    voice: 'professional_male',
    twilioNumber: '',
    useWelcomeMessage: true,
    welcomeMessage: '',
    voicemailMessage: '',
    callRecordings: true,
    agentType: 'sales',
    tone: 'professional',
    goals: '',
    background: '',
    instructions: '',
    useScript: true,
    script: '',
    includeEmail: true,
    requireName: true,
    requirePhone: true,
  });

  const handleNext = async () => {
    if (currentStep < steps.length) {
      if (currentStep === 1 && !formState.agentName.trim()) {
        console.error("Please provide an agent name before continuing.");

        return;
      }
      setCurrentStep(currentStep + 1);
      return;
    }
  
    setIsSubmitting(true);
  
    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'boolean') {
        formData.append(key, String(value));
      } else if (value != null) {
        formData.append(key, value as string);
      }
    });
  
    try {
      const result = await createAgent(formData);
      if (result && !result.success) {
        console.error("An unknown error occurred.");

      }
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleBack = () => {
    if (isSubmitting) return;
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const progressValue = (currentStep / steps.length) * 100;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Stepper value={currentStep} className="w-full mb-4">
            {steps.map(({ id, name, description }) => (
              <StepperItem key={id} step={id} className="not-last:flex-1">
                <StepperTrigger onClick={() => setCurrentStep(id)}>
                  <div className="flex items-center gap-2">
                    <StepperIndicator />
                    <div>
                      <p>{name}</p>
                      <StepperDescription>{description}</StepperDescription>
                    </div>
                  </div>
                </StepperTrigger>
                {id < steps.length && <StepperSeparator />}
              </StepperItem>
            ))}
          </Stepper>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </div>
              <CardTitle>{steps[currentStep - 1].name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && <Step1AgentConfig state={formState} setState={setFormState} />}
            {currentStep === 2 && <Step2CustomizeBehavior state={formState} setState={setFormState} />}
            {currentStep === 3 && <Step3EmbedAgent state={formState} setState={setFormState} />}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button onClick={handleNext} className="btn-primary" disabled={isSubmitting}>
            {isSubmitting && currentStep === steps.length ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Agent...
              </>
            ) : (
              <>
                {currentStep === steps.length ? 'Finish & Create Agent' : 'Next'}
                {currentStep < steps.length && <ChevronRight className="h-4 w-4 ml-2" />}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
