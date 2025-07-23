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


export default async function AgentsPage() {

  const agents = await getAgentsForUser();


  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Agents</h1>
        <Button asChild className="btn-primary">
          <Link href="/dashboard/agents/create">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Agent
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Link href="/dashboard/agents/create">
          <Card className="flex flex-col items-center justify-center h-full text-center transition-all border-2 border-dashed rounded-lg hover:border-primary hover:bg-slate-50 cursor-pointer">
            <CardHeader className="w-full">
              <CardTitle>Create New Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-full">
                <PlusIcon className="w-12 h-12 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
        {agents.map((agent) => (
          // Bungkus dengan div agar Link dan Button bisa hidup berdampingan
          <div key={agent.id} className="relative group">
            <Link href={`/dashboard/agents/${agent.id}/configure`}>
              <Card className="flex flex-col h-full transition-all cursor-pointer hover:shadow-lg">
                <CardHeader className="flex flex-row items-start gap-4">
                  <Avatar>
                    <AvatarImage src={agent.avatar_url || undefined} alt={agent.agent_name} />
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle>{agent.agent_name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {agent.description || "No description provided."}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto">
                   <p className="text-sm text-blue-600 font-semibold">
                     View →
                   </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}

        {agents.length === 0 && (
           <div className="p-6 text-center text-gray-500 sm:col-span-full">
              {/* <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" /> */}
              <h3 className="text-lg font-semibold">No Agents Found</h3>
              <p>Click on "Create New Agent" to get started!</p>
           </div>
        )}
      </div>
    </div>
  );
}
