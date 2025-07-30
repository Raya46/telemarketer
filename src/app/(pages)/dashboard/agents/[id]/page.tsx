import { getRecentCallsForUser } from "@/app/(actions)/dashboard/actions";
import { AgentDashboardClient } from "@/components/layouts/agent-dashboard";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: agentId } = await params;

  const recentCalls = await getRecentCallsForUser();

  return <AgentDashboardClient recentCalls={recentCalls} agentId={agentId} />;
}
