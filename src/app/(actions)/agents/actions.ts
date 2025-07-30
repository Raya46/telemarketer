"use server";

import { createClient } from "@/utils/supabase/server"; 
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";


type ActionResult = {
  success: boolean;
  error?:string;
  agentId?:string;
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
  

export async function createAgent(formData: FormData): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const rawData = Object.fromEntries(formData.entries());

    
    const agentData = {
        agent_name: rawData.agentName as string,
        language: rawData.language as string,
        voice: rawData.voice as string,
        twilio_phone_number: rawData.twilioNumber as string,
        use_welcome_message: rawData.useWelcomeMessage === 'true',
        welcome_message: rawData.welcomeMessage as string,
        voicemail_message: rawData.voicemailMessage as string,
        agent_type: rawData.agentType as string,
        tone: rawData.tone as string,
        goals: rawData.goals as string,
        background: rawData.background as string,
        instructions: rawData.instructions as string,
        use_script: rawData.useScript === 'true',
        script: rawData.script as string,
        include_email_in_form: rawData.includeEmail === 'true',
        user_id: user?.id
    };

    const avatarFile = formData.get('avatarFile') as File | null;
    const knowledgeBaseFile = formData.get('knowledgeBaseFile') as File | null;

    if (!agentData.agent_name) {
        return { success: false, error: "Agent name is required." };
    }

    
    const { data: newAgent, error: agentInsertError } = await supabase
        .from('ai_agents') 
        .insert(agentData)
        .select('id')
        .single();

    if (agentInsertError || !newAgent) {
        console.error('Agent Insert Error:', agentInsertError);
        return { success: false, error: "Failed to create agent record." };
    }

    const agentId = newAgent.id; 
    let avatarUrl = '';

    
    if (avatarFile && avatarFile.size > 0) {
        const avatarPath = `public/avatars/${agentId}/${avatarFile.name}`;
        const { error: uploadError } = await supabase.storage
            .from('agent-assets')
            .upload(avatarPath, avatarFile);

        if (uploadError) {
            console.error('Avatar Upload Error:', uploadError);
            
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('agent-assets')
                .getPublicUrl(avatarPath);
            avatarUrl = publicUrl;

            
            const { error: updateError } = await supabase
                .from('ai_agents')
                .update({ avatar_url: avatarUrl })
                .eq('id', agentId);

            if (updateError) {
                console.error('Agent Avatar Update Error:', updateError);
                
            }
        }
    }

    
    if (knowledgeBaseFile && knowledgeBaseFile.size > 0) {
        const knowledgeFilePath = `knowledge-files/${agentId}/${knowledgeBaseFile.name}`;
        
        const { error: knowledgeUploadError } = await supabase.storage
            .from('agent-assets')
            .upload(knowledgeFilePath, knowledgeBaseFile);

        if (knowledgeUploadError) {
            console.error('Knowledge File Upload Error:', knowledgeUploadError);
            return { success: false, error: "Failed to upload knowledge base file." };
        }

        const { error: knowledgeInsertError } = await supabase
            .from('agent_knowledge_files')
            .insert({
                agent_id: agentId,
                file_path: knowledgeFilePath,
                file_name: knowledgeBaseFile.name,
                processing_status: 'pending', 
            });

        if (knowledgeInsertError) {
            console.error('Knowledge Insert Error:', knowledgeInsertError);
            return { success: false, error: "Failed to record knowledge base file." };
        }
    }

    revalidatePath("/agents"); 
    redirect(`/dashboard/agents/${agentId}`)

    return { success: true, agentId: agentId };
}