
"use client";

import type { Message } from "./ChatInterface";
import MessageItem from "./MessageItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  playAudio: (audioDataUri: string) => void; // Added prop
}

export default function MessageList({ messages, isLoading, playAudio }: MessageListProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);


  return (
    <ScrollArea className="flex-1" viewportRef={scrollAreaRef}>
      <div ref={viewportRef} className="p-4 space-y-4 ">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} playAudio={playAudio} />
        ))}
        {isLoading && messages[messages.length -1]?.role === 'user' && (
          <div className="flex items-start gap-3">
             <MessageItem 
                message={{id: "loading", role: "assistant", content: "Thinking...", timestamp: new Date()}}
                playAudio={playAudio} // Pass dummy or handle appropriately
             />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

