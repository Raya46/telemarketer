"use server";

import { Agent, Call, Lead } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";


export type CallWithDetails = Call & {
  leads: Pick<Lead, 'full_name' | 'phone_number'> | null;
  ai_agents: Pick<Agent, 'agent_name'> | null;
};


/**
 * Mengambil semua agen AI yang dimiliki oleh pengguna yang sedang login.
 * @returns {Promise<Agent[]>} Array dari objek agen.
 */
export async function getAgentsForUser(): Promise<Agent[]> {
  noStore();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("No user found, returning empty array for agents.");
    return [];
  }

  const { data: agents, error } = await supabase
    .from('ai_agents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching agents:", error.message);
    return [];
  }

  return agents || [];
}


export async function getRecentCallsForUser(): Promise<CallWithDetails[]> {
  noStore();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: agents, error: agentsError } = await supabase
    .from('ai_agents')
    .select('id')
    .eq('user_id', user.id);

  if (agentsError || !agents || agents.length === 0) {
    return [];
  }

  const agentIds = agents.map(agent => agent.id);

  const { data: calls, error: callsError } = await supabase
    .from('calls')
    .select(`*, leads (full_name, phone_number), ai_agents (agent_name)`)
    .in('agent_id', agentIds)
    .order('start_time', { ascending: false })
    .limit(50);

  if (callsError) {
    console.error("Error fetching recent calls:", callsError.message);
    return [];
  }

  return (calls as CallWithDetails[]) || [];
}


export async function getLeadsForUser(): Promise<Lead[]> {
  noStore();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("No user found, returning empty array for leads.");
    return [];
  }
  
  
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', user.id) 
    .order('created_at', { ascending: false });

  if (leadsError) {
    console.error("Error fetching leads data:", leadsError.message);
    return [];
  }

  return leads || [];
}


export async function createLead(
  previousState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Authentication failed." };
  }

  const rawFormData = {
    full_name: formData.get('fullName') as string,
    phone_number: formData.get('phoneNumber') as string,
    email: formData.get('email') as string,
    user_id: user.id, 
  };

  if (!rawFormData.full_name || !rawFormData.phone_number) {
    return { success: false, message: "Full name and phone number are required." };
  }

  const { error } = await supabase.from('leads').insert(rawFormData);

  if (error) {
    console.error("Error creating lead:", error);
    if (error.message.includes('unique constraint')) {
        return { success: false, message: "This phone number or email is already in use." };
    }
    return { success: false, message: "Failed to create lead." };
  }

  
  
  revalidatePath('/dashboard/agents', 'layout');
  return { success: true, message: "Lead created successfully." };
}

export async function getAgentById(agentId: string): Promise<Agent | null> {
  
  const supabase = await createClient();

  
  const { data, error } = await supabase
    .from('ai_agents') 
    .select('*') 
    .eq('id', agentId) 
    .single(); 

  
  
  if (error) {
    console.error("Supabase error - Gagal mengambil agent by ID:", error.message);
    return null;
  }

  
  return data;
}