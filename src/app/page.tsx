"use client";
import React, { useState } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import PlaygroundArea, { PlaygroundContentType } from '@/components/chat/PlaygroundArea';

export default function Home() {
  const [playgroundTitle, setPlaygroundTitle] = useState("Welcome to OmniAssist Playground");
  const [playgroundContent, setPlaygroundContent] = useState("Your AI generated code, images, or detailed text will appear here. Start by interacting with the chat on the left!");
  const [playgroundContentType, setPlaygroundContentType] = useState<PlaygroundContentType>('text');

  const handleContentGenerated = (content: string, type: PlaygroundContentType, title: string) => {
    setPlaygroundTitle(title);
    setPlaygroundContent(content);
    setPlaygroundContentType(type);
  };

  return (
    <div className="flex flex-1 overflow-hidden h-full"> {/* Changed to flex-1 and overflow-hidden */}
      {/* Left Panel: Chat Interface */}
      <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col h-full border-r bg-background overflow-hidden">
        <ChatInterface onContentGenerated={handleContentGenerated} />
      </div>

      {/* Right Panel: Playground Area */}
      <div className="hidden md:flex md:w-3/5 lg:w-2/3 flex-col h-full bg-card overflow-hidden">
        <PlaygroundArea
          title={playgroundTitle}
          content={playgroundContent}
          contentType={playgroundContentType}
        />
      </div>
    </div>
  );
}
