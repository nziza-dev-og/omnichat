"use client";

import React, { useState, useEffect, useCallback } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useToast } from "@/hooks/use-toast";
import { handleContext } from "@/ai/flows/context-handling";
import type { HandleContextInput, HandleContextOutput } from "@/ai/flows/context-handling";
import { generateCode } from "@/ai/flows/code-generation";
import type { GenerateCodeInput, GenerateCodeOutput } from "@/ai/flows/code-generation";
import { availableModels } from "./ModelSelector";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  modelUsed?: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-bot-message",
      role: "assistant",
      content: "Hello! I am OmniAssist, powered by OpenAI. How can I help you with your coding tasks or other questions today?",
      timestamp: new Date(),
      modelUsed: "OmniAssist (OpenAI)"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string>("");
  const { toast } = useToast();

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...message, id: crypto.randomUUID(), timestamp: new Date() },
    ]);
  };

  const handleSendMessage = useCallback(
    async (userInput: string, selectedModelValue: string) => {
      addMessage({ role: "user", content: userInput });
      setIsLoading(true);

      const currentModelInfo = availableModels.find(m => m.value === selectedModelValue);
      const modelDisplayName = currentModelInfo?.label || selectedModelValue;

      try {
        if (selectedModelValue === "general") {
          const input: HandleContextInput = {
            message: userInput,
            conversationHistory: conversationHistory,
          };
          const result: HandleContextOutput = await handleContext(input);
          addMessage({ role: "assistant", content: result.response, modelUsed: modelDisplayName });
          setConversationHistory(result.updatedConversationHistory);
        } else if (selectedModelValue === "openai-code") {
          const input: GenerateCodeInput = {
            taskDescription: userInput,
            programmingLanguage: "python", // Defaulting to Python, can be enhanced later
            modelType: "OpenAI", // Explicitly set to OpenAI
          };
          const result: GenerateCodeOutput = await generateCode(input);
          let botResponse = result.generatedCode;
          if (result.explanation) {
            botResponse += `\n\n**Explanation:**\n${result.explanation}`;
          }
          addMessage({ role: "assistant", content: botResponse, modelUsed: modelDisplayName });
          // Update conversation history based on this interaction for context
          const newHistoryEntry = `User: ${userInput}\nAssistant (${modelDisplayName}): (Code Snippet Provided)\n${result.explanation || ''}`;
          setConversationHistory(prev => `${prev}\n${newHistoryEntry}`.trim());

        } else {
          // Fallback or error for unknown model (should not happen with updated ModelSelector)
          addMessage({ role: "assistant", content: "Sorry, the selected model mode is not configured correctly.", modelUsed: "System Error" });
        }
      } catch (error) {
        console.error("AI call failed:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        addMessage({ role: "assistant", content: `Sorry, I encountered an error: ${errorMessage}`, modelUsed: "System Error"});
        toast({
          title: "Error",
          description: `Failed to get response from AI: ${errorMessage}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [conversationHistory, toast] 
  );

  return (
    <div className="flex flex-col h-full bg-background rounded-lg shadow-xl overflow-hidden border">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
