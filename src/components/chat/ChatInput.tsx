"use client";

import type React from "react";
import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, Zap } from "lucide-react";
import ModelSelector, { availableModels } from "./ModelSelector";

interface ChatInputProps {
  onSendMessage: (message: string, selectedModel: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>(availableModels[0].value);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim(), selectedModel);
      setInputValue("");
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t bg-card shadow-sm rounded-t-lg">
      <div className="flex items-center gap-3">
        <Textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message or coding task..."
          className="flex-grow resize-none min-h-[60px] max-h-[200px] text-sm focus-visible:ring-1 focus-visible:ring-ring"
          rows={1}
          disabled={isLoading}
        />
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()} size="lg" className="h-auto py-3">
          <SendHorizonal size={20} />
          <span className="sr-only">Send</span>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Shift+Enter for new line. Current mode: {availableModels.find(m => m.value === selectedModel)?.label || 'Chat'}.
      </p>
    </div>
  );
}
