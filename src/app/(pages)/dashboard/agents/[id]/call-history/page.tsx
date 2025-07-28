import {
  getRecentCallsForUser,
  getLeadsForUser,
  getAgentById,
} from "@/app/(actions)/dashboard/actions";
import { CallHistoryClient } from "@/components/layouts/call-history-client";

export default async function CallHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: agentId } = await params;
  const agent = await getAgentById(agentId);

  const [calls, leads] = await Promise.all([
    getRecentCallsForUser(),
    getLeadsForUser(),
  ]);
  console.log("leads", leads);

  return (
    <CallHistoryClient
      initialCalls={calls}
      initialLeads={leads}
      agent={agent}
    />
  );
}
