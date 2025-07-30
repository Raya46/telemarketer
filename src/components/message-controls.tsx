import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Transcriber from "@/components/ui/transcriber";
import { DataChannelMessage } from "@/hooks/use-webrtc";
import { Conversation } from "@/types/conversation";
import { Terminal } from "lucide-react";
import { useState } from "react";

function FilterControls({
  typeFilter,
  setTypeFilter,
  searchQuery,
  setSearchQuery,
  messageTypes,
  messages,
}: {
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  messageTypes: string[];
  messages: DataChannelMessage[];
}) {
  return (
    <div className="flex gap-4 mb-4">
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          {messageTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder={"search"}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />
      <Button variant="outline" onClick={() => console.log(messages)}>
        <Terminal />
        log
      </Button>
    </div>
  );
}

export function MessageControls({
  conversation,
  msgs,
}: {
  conversation: Conversation[];
  msgs: DataChannelMessage[];
}) {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (conversation.length === 0) return null;

  const messageTypes = ["all", ...new Set(msgs.map((msg) => msg.type))];

  const filteredMsgs = msgs.filter((msg) => {
    const matchesType = typeFilter === "all" || msg.type === typeFilter;
    const matchesSearch =
      searchQuery === "" ||
      JSON.stringify(msg).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* === BUTTON OPEN LOG === */}
      <Dialog>
        <DialogTrigger asChild>
          {/* <Button variant="outline" size="sm">
            <Terminal className="w-4 h-4 mr-2" />
            View Log
          </Button> */}
        </DialogTrigger>
        <DialogContent className="max-w-full p-4 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log</DialogTitle>
          </DialogHeader>

          <FilterControls
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            messageTypes={messageTypes}
            messages={filteredMsgs}
          />

          <ScrollArea className="h-[70vh] bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Content</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMsgs.map((msg, i) => (
                  <TableRow key={i}>
                    <TableCell>{msg.type}</TableCell>
                    <TableCell className="font-mono whitespace-pre-wrap break-words">
                      {JSON.stringify(msg, null, 2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* === BUBBLE CHAT === */}
      <Transcriber conversation={conversation} />
    </div>
  );
}
