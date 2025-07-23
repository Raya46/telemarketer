"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const agents = [
  {
    id: "1",
    name: "Sales Agent 1",
    description: "An agent for initial sales inquiries.",
  },
  {
    id: "2",
    name: "Support Agent 1",
    description: "An agent for technical support.",
  },
  {
    id: "3",
    name: "Lead Generation Agent",
    description: "An agent for qualifying new leads.",
  },
];

export default function AgentsPage() {
  const router = useRouter();

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Agents</h1>
        <Button
          onClick={() => router.push("/dashboard/agents/create")}
          className="btn-primary"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Agent
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="flex flex-col items-center justify-center text-center transition-all border-2 border-dashed rounded-lg hover:border-primary">
          <CardHeader className="w-full">
            <CardTitle>Create New Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="icon"
              className="w-24 h-24 rounded-full"
              onClick={() => router.push("/dashboard/agents/create")}
            >
              <PlusIcon className="w-12 h-12" />
            </Button>
          </CardContent>
        </Card>
        {agents.map((agent) => (
          <Link href={`/dashboard/agents/${agent.id}`} key={agent.id}>
            <Card className="transition-all cursor-pointer hover:shadow-lg">
              <CardHeader>
                <CardTitle>{agent.name}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Click to view and configure
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
