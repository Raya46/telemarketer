export interface StepProps {
    state: FormState;
    setState: React.Dispatch<React.SetStateAction<FormState>>;
}

// Tipe untuk state form utama
export interface FormState {
  createdAgentId: string | null;
  avatarFile: File | null;
  knowledgeBaseFiles: File[];
  agentName: string;
  language: string;
  voice: string;
  twilioNumber: string;
  useWelcomeMessage: boolean;
  welcomeMessage: string;
  voicemailMessage: string;
  callRecordings: boolean;
  agentType: string;
  tone: string;
  goals: string;
  background: string;
  instructions: string;
  useScript: boolean;
  script: string;
  includeEmail: boolean;
}

export const colors = {
  background: "#1C162C",
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  accentHover: "#6941C6",
  border: "#423966",
  dashedBorder: "#5A5178",
};

// Menggabungkan langkah 3 & 4
export const steps = [
  { id: 1, name: "Agent Config", description: "Setup your agent" },
  {
    id: 2,
    name: "Customize Behavior",
    description: "Define agent's personality",
  },
  { id: 3, name: "Create & Embed", description: "Finish and integrate" },
];

export const languages = [
  { value: "id", label: "Indonesia" },
  { value: "en", label: "English" },
];

export const voices = [
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "fable", label: "Fable" },
  { value: "onyx", label: "Onyx" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" },
];

export const agentTypes = [
  { value: "sales", label: "Sales Representative" },
  { value: "support", label: "Support Agent" },
  { value: "engagement", label: "Lead Engagement" },
];

export const tones = [
  { value: "conversational", label: "Conversational" },
  { value: "professional", label: "Professional" },
  { value: "humorous", label: "Humorous" },
];