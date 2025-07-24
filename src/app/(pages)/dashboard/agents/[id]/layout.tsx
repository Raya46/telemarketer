"use client";

const colors = {
  background: "#1C162C",
};

export default function AgentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div style={{ backgroundColor: colors.background }}>
      {children}
    </div>
  );
}
