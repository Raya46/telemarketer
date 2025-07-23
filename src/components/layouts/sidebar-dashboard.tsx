"use client";

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Bot, Settings, LifeBuoy, Book, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/(actions)/auth/actions";

const dashboardMenu = [
  {
    href: "/dashboard/agents",
    label: "Agents",
    icon: <Bot className="w-4 h-4" />,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
  },
  {
    href: "/dashboard/support",
    label: "Support",
    icon: <LifeBuoy className="w-4 h-4" />,
  },
  {
    href: "/dashboard/tutorials",
    label: "Tutorials",
    icon: <Book className="w-4 h-4" />,
  },
];

export function SidebarDashboard() {
  const pathname = usePathname();
  const handleLogout = async () => {
    await logout();
  };

  return (
    <SidebarContent>
      <SidebarMenu>
        {dashboardMenu.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.href)}
                className="w-full"
              >
                {item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <div className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/auth/login" passHref>
              <SidebarMenuButton onClick={handleLogout} className="w-full">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </SidebarContent>
  );
}
