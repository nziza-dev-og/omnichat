"use client";

import type { Message } from "./ChatInterface"; // Assuming Message type is exported from ChatInterface
import MessageItem from "./MessageItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-grow h-[calc(100vh-280px)] mb-4 pr-4 -mr-4" ref={scrollAreaRef}>
      <div ref={viewportRef} className="h-full">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 my-4 py-3 px-2">
             <MessageItem message={{id: "loading", role: "assistant", content: "Thinking...", timestamp: new Date()}}/>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
