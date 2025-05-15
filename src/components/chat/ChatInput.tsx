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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`; // Max 160px height (approx 4-5 lines)
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
    <div className="p-3 sm:p-4 border-t bg-background"> {/* Use bg-background matching chat panel */}
      <div className="flex items-end gap-2 bg-input p-2.5 rounded-lg border shadow-sm"> {/* Changed to bg-input */}
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message to OmniAssist..."
          className="flex-grow resize-none min-h-[40px] max-h-[160px] text-sm focus-visible:ring-0 focus-visible:ring-offset-0 border-0 shadow-none p-2 bg-transparent placeholder:text-muted-foreground/70"
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
            "h-9 w-9 shrink-0 rounded-md", // Adjusted size and rounding
            isLoading || !inputValue.trim() ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          aria-label="Send message"
        >
          <SendHorizonal size={18} /> {/* Adjusted icon size */}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground/60 mt-2 text-center">
        Shift+Enter for new line. Mode: {availableModels.find(m => m.value === selectedModel)?.label || 'Chat'}.
      </p>
    </div>
  );
}
