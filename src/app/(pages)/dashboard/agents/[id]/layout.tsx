"use client";

const colors = {
  background: "#1C162C",
};

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ backgroundColor: colors.background }}>{children}</div>;
}
