
"use client";

import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Copy, Eye, Code as CodeIcon, X } from 'lucide-react'; // Added Eye and CodeIcon
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export type PlaygroundContentType = 'text' | 'code' | 'image' | 'welcome';

interface PlaygroundAreaProps {
  title: string;
  content: string;
  contentType: PlaygroundContentType;
  codeLanguage: string | null;
}

export default function PlaygroundArea({ title, content, contentType, codeLanguage }: PlaygroundAreaProps) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');

  const canPreview = contentType === 'code' && 
                     codeLanguage && 
                     ['html', 'javascript', 'css'].includes(codeLanguage.toLowerCase());

  useEffect(() => {
    // Reset to code view when content or type changes, especially for new code
    setViewMode('code');
  }, [content, contentType, codeLanguage]);

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

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'code' ? 'preview' : 'code');
  };

  const getHtmlForPreview = () => {
    if (!canPreview || !content) return '';
    const lang = codeLanguage?.toLowerCase();

    if (lang === 'html') {
      return content;
    }
    if (lang === 'javascript') {
      return `
        <html>
          <head><title>JavaScript Preview</title></head>
          <body>
            <script>${content}</script>
            <p style="font-family: sans-serif; color: #555; padding: 10px;">Check console for JS output or DOM changes.</p>
          </body>
        </html>`;
    }
    if (lang === 'css') {
      return `
        <html>
          <head>
            <title>CSS Preview</title>
            <style>${content}</style>
          </head>
          <body style="font-family: sans-serif; padding: 20px;">
            <h1>Styled Heading</h1>
            <p>This paragraph is styled by the CSS you provided. You can add more HTML elements here to test different selectors.</p>
            <button class="bg-primary text-primary-foreground p-2 rounded">Styled Button (if classes apply)</button>
          </body>
        </html>`;
    }
    return '';
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Header */}
      <div className="p-3 px-4 border-b flex items-center justify-between bg-card h-14 shrink-0">
        <h2 className="text-sm font-medium text-foreground truncate">{title}</h2>
        <div className="flex items-center gap-1 sm:gap-2">
          {contentType === 'code' && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={handleCopyCode} title="Copy code">
              <Copy size={16} />
              <span className="sr-only">Copy code</span>
            </Button>
          )}
          {canPreview && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={toggleViewMode} title={viewMode === 'code' ? "Show Preview" : "Show Code"}>
              {viewMode === 'code' ? <Eye size={16} /> : <CodeIcon size={16} />}
              <span className="sr-only">{viewMode === 'code' ? "Show Preview" : "Show Code"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1 bg-background">
        <div className={cn("p-4 md:p-6 h-full", viewMode === 'preview' && canPreview && "flex")}>
          {contentType === 'code' ? (
            viewMode === 'preview' && canPreview ? (
              <iframe
                srcDoc={getHtmlForPreview()}
                title="Code Preview"
                className="w-full h-full border-0 rounded-md shadow-inner bg-white"
                sandbox="allow-scripts allow-same-origin" 
              />
            ) : (
              <pre className="bg-muted text-muted-foreground p-4 rounded-md overflow-auto text-sm whitespace-pre-wrap break-all h-full">
                <code>{content}</code>
              </pre>
            )
          ) : contentType === 'image' && content ? ( // Ensure content is not empty for image
            <div className="flex justify-center items-center">
              <img 
                src={content} 
                alt={title || "Generated image"} 
                className="max-w-full max-h-[70vh] rounded-md object-contain shadow-md"
              />
            </div>
          ) : ( 
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground markdown-content">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

