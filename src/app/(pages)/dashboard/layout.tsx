'use client';
import { SidebarDashboard } from "@/components/layouts/sidebar-dashboard";
import { SidebarAgent } from "@/components/layouts/sidebar-agent";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname, useParams } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const isAgentPage = pathname.includes('/dashboard/agents/');
  const agentId = params.id as string;

  return (
    <SidebarProvider>
      <Sidebar>
        {isAgentPage && agentId ? <SidebarAgent id={agentId} /> : <SidebarDashboard />}
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}