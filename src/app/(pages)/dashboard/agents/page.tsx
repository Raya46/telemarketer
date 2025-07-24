
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon, Bot } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAgentsForUser } from "@/app/(actions)/agents/actions";

// Palet warna yang sama dari halaman login
const colors = {
  background: "#1C162C",
  card: "#2A2342",
  primaryText: "#E0DDF1",
  secondaryText: "#A09CB9",
  accent: "#7F56D9",
  accentHover: "#6941C6",
  border: "#423966",
  dashedBorder: "#5A5178", // Warna yang sedikit lebih cerah untuk border putus-putus
};

export default async function AgentsPage() {
  const agents = await getAgentsForUser();

  return (
    <div
      className="min-h-screen p-4 sm:p-6"
      style={{ backgroundColor: colors.background }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: colors.primaryText }}
        >
          Your Agents
        </h1>
        <Button
          asChild
          className="font-semibold text-white transition-colors"
          style={{ backgroundColor: colors.accent }}
        >
          <Link href="/dashboard/agents/create">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Agent
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Link href="/dashboard/agents/create">
          <Card
            className="flex flex-col items-center justify-center h-full text-center transition-all border-2 border-dashed rounded-lg cursor-pointer"
            style={{
              backgroundColor: "transparent",
              borderColor: colors.dashedBorder,
            }}
          >
            <CardHeader className="w-full">
              <CardTitle style={{ color: colors.primaryText }}>
                Create New Agent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center w-24 h-24 rounded-full">
                <PlusIcon
                  className="w-12 h-12"
                  style={{ color: colors.secondaryText }}
                />
              </div>
            </CardContent>
          </Card>
        </Link>
        {agents.map((agent) => (
          <div key={agent.id} className="relative group">
            <Link href={`/dashboard/agents/${agent.id}`}>
              <Card
                className="flex flex-col h-full transition-all border-0 rounded-lg cursor-pointer hover:ring-2"
                style={{
                  backgroundColor: colors.card,
                }}
              >
                <CardHeader className="flex flex-row items-start gap-4">
                  <Avatar>
                    <AvatarImage
                      src={agent.avatar_url || undefined}
                      alt={agent.agent_name}
                    />
                    <AvatarFallback
                      style={{
                        backgroundColor: colors.border,
                        color: colors.primaryText,
                      }}
                    >
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle style={{ color: colors.primaryText }}>
                      {agent.agent_name}
                    </CardTitle>
                    <CardDescription
                      className="line-clamp-2"
                      style={{ color: colors.secondaryText }}
                    >
                      {agent.description || "No description provided."}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: colors.accent }}
                  >
                    View →
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}

        {agents.length === 0 && (
          <div
            className="p-6 text-center sm:col-span-full"
            style={{ color: colors.secondaryText }}
          >
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.primaryText }}
            >
              No Agents Found
            </h3>
            <p>Click on "Create New Agent" to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
