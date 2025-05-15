"use client";

import type { Message } from "./ChatInterface";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    <div className={cn("flex items-start gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 self-start shadow bg-primary text-primary-foreground flex items-center justify-center">
          <Bot size={18} />
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[80%] p-3 px-4 rounded-lg shadow-sm text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground border"
        )}
      >
        {message.content === "Thinking..." ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-0"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-400"></div>
          </div>
        ) : (
          <div className="markdown-content prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-xl font-semibold mt-2 mb-1" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-semibold mt-2 mb-1" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-base font-semibold mt-1 mb-1" {...props} />,
                a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                img: ({node, ...props}) => <img className="max-w-xs md:max-w-sm lg:max-w-md rounded-md my-2 shadow-md" {...props} />,
                p: ({node, ...props}) => <p className="mb-0 last:mb-0" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {message.modelUsed && !isUser && message.content !== "Thinking..." && (
          <p className="text-xs text-muted-foreground mt-1.5 text-right">
            via {message.modelUsed}
          </p>
        )}
      </div>
      {isUser && (
         <Avatar className="h-8 w-8 self-start shadow bg-muted text-muted-foreground flex items-center justify-center">
            <User size={18} />
        </Avatar>
      )}
    </div>
  );
}
