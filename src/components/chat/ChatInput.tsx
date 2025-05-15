"use client";

import type React from "react";
import { useState, type ChangeEvent, type KeyboardEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import ModelSelector, { availableModels } from "./ModelSelector";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string, selectedModel: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>(availableModels[0].value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`; // Set to scroll height up to max
    }
  };
  
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);


  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim(), selectedModel);
      setInputValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // Reset height after send
      }
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-background border-t">
      <div className="flex items-end gap-2 bg-card p-2 rounded-lg border shadow-sm">
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-grow resize-none min-h-[40px] max-h-[200px] text-sm focus-visible:ring-0 focus-visible:ring-offset-0 border-0 shadow-none p-2.5 bg-transparent"
          rows={1}
          disabled={isLoading}
        />
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          disabled={isLoading}
        />
        <Button 
          onClick={handleSend} 
          disabled={isLoading || !inputValue.trim()} 
          size="icon" 
          className={cn(
            "h-10 w-10 shrink-0",
            isLoading || !inputValue.trim() ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          aria-label="Send message"
        >
          <SendHorizonal size={20} />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground/80 mt-2 text-center">
        Shift+Enter for new line. Mode: {availableModels.find(m => m.value === selectedModel)?.label || 'Chat'}.
      </p>
    </div>
  );
}
