
"use client";
import React, { useState } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import PlaygroundArea, { PlaygroundContentType } from '@/components/chat/PlaygroundArea';
import { cn } from '@/lib/utils';

export default function Home() {
  const [playgroundTitle, setPlaygroundTitle] = useState("Code Playground");
  const [playgroundContent, setPlaygroundContent] = useState("Code generated by OmniAssist will appear here if the 'Code' model is used.");
  const [playgroundContentType, setPlaygroundContentType] = useState<PlaygroundContentType>('welcome');
  const [playgroundCodeLanguage, setPlaygroundCodeLanguage] = useState<string | null>(null);
  const [showPlayground, setShowPlayground] = useState(false);

  const handleContentGenerated = (content: string, type: PlaygroundContentType, title: string, language: string | null) => {
    if (type === 'code') {
      setPlaygroundTitle(title);
      setPlaygroundContent(content); 
      setPlaygroundContentType(type);
      setPlaygroundCodeLanguage(language);
      setShowPlayground(true);
    } else {
      setShowPlayground(false);
      setPlaygroundCodeLanguage(null);
      // Optionally, reset playground to initial state for non-code types
      // setPlaygroundTitle("Code Playground");
      // setPlaygroundContent("Code generated by OmniAssist will appear here if the 'Code' model is used.");
      // setPlaygroundContentType('welcome');
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Left Panel: Chat Interface */}
      <div className={cn(
        "flex flex-col h-full border-r bg-card overflow-hidden transition-all duration-300 ease-in-out",
        showPlayground ? "w-full md:w-2/5 lg:w-1/3" : "w-full"
      )}>
        <ChatInterface onContentGenerated={handleContentGenerated} />
      </div>

      {/* Right Panel: Playground Area - Conditionally Rendered */}
      {showPlayground && (
        <div className="hidden md:flex md:w-3/5 lg:w-2/3 flex-col h-full bg-background overflow-hidden transition-all duration-300 ease-in-out">
          <PlaygroundArea
            title={playgroundTitle}
            content={playgroundContent}
            contentType={playgroundContentType}
            codeLanguage={playgroundCodeLanguage}
          />
        </div>
      )}
    </div>
  );
}

