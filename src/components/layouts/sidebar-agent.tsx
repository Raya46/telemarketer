"use client";

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  History,
  Settings,
  BrainCircuit,
  Bot,
  Bolt,
  FileText,
  ChevronLeft,
  PersonStanding,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const agentMenu = (id: string) => [
  {
    href: `/dashboard/agents/${id}`,
    label: "AI Agent",
    icon: <PersonStanding className="w-4 h-4" />,
  },
  {
    href: `/dashboard/agents/${id}/call-history`,
    label: "Call History",
    icon: <History className="w-4 h-4" />,
  },
  {
    href: `/dashboard/agents/${id}/configure`,
    label: "Configure",
    icon: <Settings className="w-4 h-4" />,
  },
  {
    href: `/dashboard/agents/${id}/knowledge-base`,
    label: "Knowledge Base",
    icon: <BrainCircuit className="w-4 h-4" />,
  },
  {
    href: `/dashboard/agents/${id}/actions`,
    label: "Actions",
    icon: <Bolt className="w-4 h-4" />,
  },
  {
    href: `/dashboard/agents/${id}/api-and-forms`,
    label: "API and Forms",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    href: `/dashboard/agents/`,
    label: "Back",
    icon: <ChevronLeft className="w-4 h-4" />,
  },
];

export function SidebarAgent({ id }: { id: string }) {
  const pathname = usePathname();
  const menuItems = agentMenu(id);

  return (
    <SidebarContent>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarMenuButton
                isActive={pathname === item.href}
                className="w-full"
              >
                {item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
  );
}
