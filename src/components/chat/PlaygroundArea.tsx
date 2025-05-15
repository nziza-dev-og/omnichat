"use client";

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Copy, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type PlaygroundContentType = 'text' | 'code' | 'image' | 'welcome';

interface PlaygroundAreaProps {
  title: string;
  content: string;
  contentType: PlaygroundContentType;
}

export default function PlaygroundArea({ title, content, contentType }: PlaygroundAreaProps) {
  const { toast } = useToast();

  const handleCopyCode = () => {
    if (contentType === 'code') {
      navigator.clipboard.writeText(content)
        .then(() => {
          toast({ title: "Copied!", description: "Code copied to clipboard." });
        })
        .catch(err => {
          toast({ title: "Error", description: "Could not copy code.", variant: "destructive" });
          console.error('Failed to copy code: ', err);
        });
    }
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Header */}
      <div className="p-3 px-4 border-b flex items-center justify-between bg-card h-14">
        <h2 className="text-sm font-medium text-foreground truncate">{title}</h2>
        <div className="flex items-center gap-2">
          {contentType === 'code' && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={handleCopyCode}>
              <Copy size={16} />
              <span className="sr-only">Copy code</span>
            </Button>
          )}
          {/* Placeholder for close button if needed later 
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <X size={16} />
            <span className="sr-only">Close panel</span>
          </Button>
          */}
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1 bg-background"> {/* Changed to bg-background to contrast with header */}
        <div className="p-4 md:p-6">
          {contentType === 'code' ? (
            <pre className="bg-muted text-muted-foreground p-4 rounded-md overflow-x-auto text-sm whitespace-pre-wrap break-all">
              <code>{content}</code>
            </pre>
          ) : contentType === 'image' ? (
            <div className="flex justify-center items-center">
              <img 
                src={content} 
                alt={title || "Generated image"} 
                className="max-w-full max-h-[70vh] rounded-md object-contain shadow-md"
              />
            </div>
          ) : ( // 'text' or 'welcome'
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground markdown-content">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </ScrollArea>
      {/* Footer placeholder */}
      {/* 
      <div className="p-3 border-t text-xs text-muted-foreground bg-card h-10 flex items-center">
        Last edited: Just now
      </div>
      */}
    </div>
  );
}
