import { getRecentCallsForUser } from "@/app/(actions)/dashboard/actions";
import { AgentDashboardClient } from "@/components/layouts/agent-dashboard";

export default async function AgentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const recentCalls = await getRecentCallsForUser();

  return <AgentDashboardClient recentCalls={recentCalls} agentId={params.id} />;
}
