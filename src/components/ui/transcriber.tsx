"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ThreeDotsWave from "./three-dots-wave";
import { Conversation } from "@/types/conversation";

/**
 * Avatar building blocks with Radix
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted bg-[#1C162C] text-white",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

function shouldDisplayMessage(msg: Conversation): boolean {
  const { role, text, status, isFinal } = msg;

  if (role === "assistant") {
    return true;
  } else {
    if (status === "speaking" || status === "processing") {
      return true;
    }

    if (isFinal && text.trim().length > 0) {
      return true;
    }

    return false;
  }
}

/**
 * Single conversation item
 */
/* ----------------------- BUBBLE ITEM ----------------------- */
function ConversationItem({ message }: { message: Conversation }) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 bg-white w-fit max-w-4/5 rounded-lg p-2 ${isUser ? "justify-end place-self-end" : ""}`}
    >
      {isAssistant && (
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`${
          isUser
            ? "bg-primary text-background"
            : "bg-secondary dark:text-foreground"
        } rounded-lg  max-w-xs`}
      >
        {message.status === "processing" ? (
          <ThreeDotsWave />
        ) : (
          <p>{message.text}</p>
        )}
        <div className="text-xs text-muted-foreground text-right">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}


interface TranscriberProps {
  conversation: Conversation[];
}

export default function Transcriber({ conversation }: TranscriberProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  const displayableMessages = React.useMemo(() => {
    return conversation.filter(shouldDisplayMessage);
  }, [conversation]);

  return (
    <div className="flex flex-col w-full h-auto mx-auto bg-background justify-start shadow-lg overflow-hidden dark:bg-background">
      {/* Header */}
      {/* <div className="bg-secondary px-4 py-3 flex items-center justify-between dark:bg-secondary">
        <div className="font-medium text-foreground dark:text-foreground">
          Live
        </div>
      </div> */}

      {/* Body */}
      <div
        ref={scrollRef}
        className="flex- h-auto overflow-y-auto space-y-3 z-50 scrollbar-thin scrollbar-thumb-primary "
      >
        <AnimatePresence>
          {displayableMessages.map((message) => (
            <ConversationItem key={message.id} message={message} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
