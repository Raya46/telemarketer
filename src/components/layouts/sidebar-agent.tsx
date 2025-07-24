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

// Palet warna yang sama dari halaman sebelumnya
const colors = {
  background: "#1C162C",
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  accentHover: "#6941C6",
  activeBackground: "rgba(127, 86, 217, 0.1)", // Background lembut untuk item aktif
};


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
    <SidebarContent style={{ backgroundColor: colors.background, borderRight: `1px solid ${colors.border}` }}>
      <SidebarMenu>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref className="w-full">
                <SidebarMenuButton
                  isActive={isActive}
                  className="w-full transition-colors duration-200"
                  style={{
                    backgroundColor: isActive ? colors.activeBackground : "transparent",
                    color: isActive ? colors.accent : colors.secondaryText,
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarContent>
  );
}
