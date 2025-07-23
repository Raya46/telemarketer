export default function AgentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold">Agent Overview</h1>
      <p className="text-gray-500">Welcome to the page for agent {params.id}.</p>
      <p className="mt-4">Select a category from the sidebar to configure this agent.</p>
    </div>
  );
}