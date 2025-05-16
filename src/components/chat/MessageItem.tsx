
"use client";

import React from "react"; // Added React import
import type { Message } from "./ChatInterface";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, User, Volume2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  playAudio: (audioDataUri: string) => void;
}

export default function MessageItem({ message, playAudio }: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-3 w-full", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 self-start shadow bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
          <Bot size={18} />
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[85%] p-3 px-4 rounded-lg shadow-sm text-sm",
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
                img: ({node, ...props}) => <img className="max-w-full h-auto rounded-md my-2 shadow-md" {...props} />,
                p: ({node, ...props}) => <p className="mb-0 last:mb-0" {...props} />,
                pre: ({node, ...props}) => <pre className="text-xs sm:text-sm md:text-base" {...props} />,
                code: ({node, inline, className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <div className="my-2 rounded-md overflow-hidden border bg-muted">
                      <div className="px-3 py-1 text-xs text-muted-foreground/70 border-b">
                        {match[1]}
                      </div>
                       <code className={cn(className, "block p-3 overflow-x-auto !bg-transparent !text-muted-foreground")} {...props}>
                        {children}
                      </code>
                    </div>
                  ) : (
                    <code className={cn(className, "!bg-muted/50 !text-muted-foreground px-1 py-0.5 rounded-sm")} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        <div className="flex items-center justify-between mt-1.5">
          {message.modelUsed && !isUser && message.content !== "Thinking..." && (
            <p className="text-xs text-muted-foreground/80">
              via {message.modelUsed}
            </p>
          )}
          {message.audioDataUri && !isUser && message.content !== "Thinking..." && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => playAudio(message.audioDataUri!)}
              aria-label="Play audio"
            >
              <Volume2 size={14} />
            </Button>
          )}
        </div>
      </div>
      {isUser && (
         <Avatar className="h-8 w-8 self-start shadow bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <User size={18} />
        </Avatar>
      )}
    </div>
  );
}
