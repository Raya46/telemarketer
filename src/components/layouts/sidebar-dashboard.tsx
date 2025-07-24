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

// Palet warna yang sama dari halaman sebelumnya
const colors = {
  background: "#1C162C",
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  accentHover: "#6941C6",
  activeBackground: "rgba(127, 86, 217, 0.1)", // Background lembut untuk item aktif
  border: "#423966",
};

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
    <SidebarContent
      style={{
        backgroundColor: colors.background,
        borderRight: `1px solid ${colors.border}`,
      }}
      className="flex flex-col h-full"
    >
      <SidebarMenu>
        {dashboardMenu.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref className="w-full">
                <SidebarMenuButton
                  isActive={isActive}
                  className="w-full transition-colors duration-200"
                  style={{
                    backgroundColor: isActive
                      ? colors.activeBackground
                      : "transparent",
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
      <div className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Menggunakan form untuk logout agar sesuai dengan Server Actions */}
            <form action={logout} className="w-full">
              <SidebarMenuButton
                type="submit"
                className="w-full transition-colors duration-200"
                style={{ color: colors.secondaryText }}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </SidebarContent>
  );
}
