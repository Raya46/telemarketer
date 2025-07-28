export interface Agent {
  id: string;
  user_id: string;
  created_at: string;
  agent_name: string;
  avatar_url: string | null;
  language: string;
  voice: string;
  twilio_phone_number: string | null;
  use_welcome_message: boolean;
  welcome_message: string | null;
  voicemail_message: string | null;
  call_recordings_enabled: boolean;
  agent_type: string;
  tone: string;
  goals: string | null;
  background: string | null;
  instructions: string | null;
  use_script: boolean;
  script: string | null;
  include_email_in_form: boolean;
  require_name_in_form: boolean;
  require_phone_in_form: boolean;
  action_send_email_enabled: boolean;
  action_schedule_meeting_enabled: boolean;
  action_trigger_webhook_enabled: boolean;
}

export interface Call {
  id: string;
  agent_id: string;
  lead_id: string;
  start_time: string;
  end_time: string | null;
  call_duration_seconds: number | null;
  outcome: string; // Sebaiknya gunakan tipe literal jika Anda tahu nilainya, misal: 'completed' | 'failed'
  notes: string | null;
  created_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  address: string | null;
  status: string; // Sebaiknya gunakan tipe literal, misal: 'new' | 'contacted'
  last_contacted_at: string | null;
  created_at: string;
}