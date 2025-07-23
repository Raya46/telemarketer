"use server";

import { createClient } from "@/utils/supabase/server"; 
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";


type ActionResult = {
  success: boolean;
  message: string;
};

export interface Agent {
    id: string;
    agent_name: string;
    avatar_url: string | null;
    description: string | null; 
  }


export async function getAgentsForUser(): Promise<Agent[]> {
    noStore();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      console.log("No user session found, returning empty agents list.");
      return [];
    }
  
    const { data, error } = await supabase
      .from('ai_agents')
      .select('id, agent_name, avatar_url, goals')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error("Error fetching agents:", error);
      return [];
    }
  
    const agents: Agent[] = data.map(agent => ({
      id: agent.id,
      agent_name: agent.agent_name,
      avatar_url: agent.avatar_url,
      description: agent.goals,
    }));
  
    return agents;
  }
  

export async function createAgent(formData: FormData): Promise<ActionResult | void> {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("User not authenticated", userError);
    return { success: false, message: "Authentication failed. Please log in again." };
  }

  const agentName = formData.get("agentName") as string;
  const language = formData.get("language") as string;
  const voice = formData.get("voice") as string;
  const twilioNumber = formData.get("twilioNumber") as string | null;
  const useWelcomeMessage = formData.get("useWelcomeMessage") === 'true';
  const welcomeMessage = formData.get("welcomeMessage") as string | null;
  const voicemailMessage = formData.get("voicemailMessage") as string | null;
  const callRecordings = formData.get("callRecordings") === 'true';
  const agentType = formData.get("agentType") as string;
  const tone = formData.get("tone") as string;
  const goals = formData.get("goals") as string | null;
  const background = formData.get("background") as string | null;
  const instructions = formData.get("instructions") as string | null;
  const useScript = formData.get("useScript") === 'true';
  const script = formData.get("script") as string | null;
  const includeEmail = formData.get("includeEmail") === 'true';
  const requireName = formData.get("requireName") === 'true';
  const requirePhone = formData.get("requirePhone") === 'true';
  const avatarFile = formData.get("avatarFile") as File | null;

  if (!agentName || agentName.trim() === "") {
    return { success: false, message: "Agent name is required." };
  }
  
  let avatarUrl: string | null = null;

  if (avatarFile && avatarFile.size > 0) {
    const filePath = `avatars/${user.id}/${Date.now()}_${avatarFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('agent-assets') 
      .upload(filePath, avatarFile);

    if (uploadError) {
      console.error("Avatar upload error:", uploadError);
      return { success: false, message: "Failed to upload avatar." };
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('agent-assets') 
      .getPublicUrl(filePath);
    avatarUrl = publicUrl;
  }

  const agentPayload = {
    user_id: user.id,
    agent_name: agentName,
    language: language,
    voice: voice,
    twilio_phone_number: twilioNumber,
    use_welcome_message: useWelcomeMessage,
    welcome_message: welcomeMessage,
    voicemail_message: voicemailMessage,
    call_recordings_enabled: callRecordings,
    agent_type: agentType,
    tone: tone,
    goals: goals,
    background: background,
    instructions: instructions,
    use_script: useScript,
    script: script,
    include_email_in_form: includeEmail,
    require_name_in_form: requireName,
    require_phone_in_form: requirePhone,
    avatar_url: avatarUrl,
  };
  
  const { data: newAgent, error: insertError } = await supabase
    .from('ai_agents')
    .insert(agentPayload)
    .select('id')
    .single();

  if (insertError) {
    console.error("Agent insert error:", insertError);
    if (insertError.message.includes('duplicate key value violates unique constraint')) {
       return { success: false, message: "This Twilio phone number is already in use." };
    }
    return { success: false, message: "Failed to create agent in database." };
  }

  revalidatePath("/dashboard/agents", "layout");
  redirect(`/dashboard/agents/${newAgent.id}`);
}