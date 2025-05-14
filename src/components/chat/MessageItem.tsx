"use client";

import type { Message } from "./ChatInterface"; // Assuming Message type is exported from ChatInterface
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-3 my-4 py-3 px-2 rounded-lg", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 self-start shadow">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot size={18} />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[75%] p-3 rounded-lg shadow-md text-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card text-card-foreground rounded-bl-none border"
        )}
      >
        <div className="markdown-content prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            // Customize heading rendering if needed
            h1: ({node, ...props}) => <h1 className="text-xl font-semibold mt-2 mb-1" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-2 mb-1" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-base font-semibold mt-1 mb-1" {...props} />,
            // Ensure links open in new tabs
            a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />,
          }}>
            {message.content}
          </ReactMarkdown>
        </div>
        {message.modelUsed && !isUser && (
          <p className="text-xs text-muted-foreground mt-2 text-right">
            via {message.modelUsed}
          </p>
        )}
      </div>
      {isUser && (
         <Avatar className="h-8 w-8 self-start shadow">
          <AvatarFallback className="bg-accent text-accent-foreground">
            <User size={18} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
