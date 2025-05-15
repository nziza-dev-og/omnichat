"use client";

import React, { useState, useCallback } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useToast } from "@/hooks/use-toast";
import { handleContext } from "@/ai/flows/context-handling";
import type { HandleContextInput, HandleContextOutput } from "@/ai/flows/context-handling";
import { generateCode } from "@/ai/flows/code-generation";
import type { GenerateCodeInput, GenerateCodeOutput } from "@/ai/flows/code-generation";
import { generateImage } from "@/ai/flows/image-generation";
import type { GenerateImageInput, GenerateImageOutput } from "@/ai/flows/image-generation";
import { availableModels } from "./ModelSelector";
import type { PlaygroundContentType } from "./PlaygroundArea";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  modelUsed?: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onContentGenerated: (content: string, type: PlaygroundContentType, title: string) => void;
}

export default function ChatInterface({ onContentGenerated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-bot-message",
      role: "assistant",
      content: "Hello! I am OmniAssist. How can I help you with your coding tasks, image ideas, or other questions today?",
      timestamp: new Date(),
      modelUsed: "OmniAssist (Together AI)"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string>("");
  const { toast } = useToast();

  const addMessage = (message: Omit<Message, "id" | "timestamp"> & { id?: string }) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...message, id: message.id || crypto.randomUUID(), timestamp: new Date() },
    ]);
  };

  const handleSendMessage = useCallback(
    async (userInput: string, selectedModelValue: string) => {
      const userMessageId = crypto.randomUUID();
      addMessage({ id: userMessageId, role: "user", content: userInput });
      setIsLoading(true);

      const currentModelInfo = availableModels.find(m => m.value === selectedModelValue);
      const modelDisplayName = currentModelInfo?.label || selectedModelValue;
      const playgroundTitleBase = userInput.length > 30 ? userInput.substring(0, 27) + "..." : userInput;

      try {
        if (selectedModelValue === "together-general") {
          const input: HandleContextInput = {
            message: userInput,
            conversationHistory: conversationHistory,
          };
          const result: HandleContextOutput = await handleContext(input);
          addMessage({ role: "assistant", content: result.response, modelUsed: modelDisplayName });
          setConversationHistory(result.updatedConversationHistory);
          onContentGenerated(result.response, 'text', `Chat: ${playgroundTitleBase}`);

        } else if (selectedModelValue === "together-code") {
          const codeInput: GenerateCodeInput = {
            taskDescription: userInput,
            // Infer programming language from user input, or default
            programmingLanguage: userInput.toLowerCase().includes("javascript") ? "javascript" : 
                                 userInput.toLowerCase().includes("python") ? "python" :
                                 userInput.toLowerCase().includes("typescript") ? "typescript" :
                                 userInput.toLowerCase().includes("html") ? "html" :
                                 userInput.toLowerCase().includes("css") ? "css" :
                                 "code", // A generic default
          };
          const result: GenerateCodeOutput = await generateCode(codeInput);
          
          let botResponse = `\`\`\`${result.explanation ? codeInput.programmingLanguage : (codeInput.programmingLanguage || 'code')}\n${result.generatedCode}\n\`\`\``;
          if (result.explanation) {
            botResponse += `\n\n**Explanation:**\n${result.explanation}`;
          }
          addMessage({ role: "assistant", content: botResponse, modelUsed: modelDisplayName });
          
          const newHistoryEntry = `User: ${userInput}\nAssistant (${modelDisplayName}): (Code Snippet Provided)\n${result.explanation || ''}`;
          setConversationHistory(prev => `${prev}\n${newHistoryEntry}`.trim());
          onContentGenerated(result.generatedCode, 'code', `Code: ${playgroundTitleBase} (${codeInput.programmingLanguage})`);

        } else if (selectedModelValue === "together-image") {
          const imageInput: GenerateImageInput = {
            prompt: userInput,
          };
          const placeholderId = crypto.randomUUID();
          addMessage({ 
            id: placeholderId, 
            role: "assistant", 
            content: `Generating image for: "${userInput}"...`, 
            modelUsed: modelDisplayName,
            timestamp: new Date() 
          });

          const result: GenerateImageOutput = await generateImage(imageInput);
          
          const imageMarkdown = `![Generated image for prompt: ${result.promptUsed}](${result.b64Json})`;
          setMessages(prev => prev.map(m => 
            m.id === placeholderId
            ? { ...m, content: imageMarkdown } 
            : m
          ));
          
          const newHistoryEntry = `User: ${userInput}\nAssistant (${modelDisplayName}): (Image generated for prompt: "${result.promptUsed}")`;
          setConversationHistory(prev => `${prev}\n${newHistoryEntry}`.trim());
          onContentGenerated(result.b64Json, 'image', `Image: ${playgroundTitleBase}`);
        } else {
           const errorMessage = "Sorry, the selected model mode is not configured correctly.";
           addMessage({ role: "assistant", content: errorMessage, modelUsed: "System Error" });
           onContentGenerated(errorMessage, 'text', 'Error');
        }
      } catch (error) {
        console.error("AI call failed:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        
        const imagePlaceholder = messages.find(m => m.content.startsWith("Generating image for:") && m.role === "assistant");
        if (selectedModelValue === "together-image" && imagePlaceholder) {
            setMessages(prev => prev.map(m =>
                m.id === imagePlaceholder.id
                ? { ...m, content: `Sorry, I encountered an error generating the image: ${errorMessage}` }
                : m
            ));
             onContentGenerated(`Error generating image: ${errorMessage}`, 'text', 'Image Generation Error');
        } else {
            addMessage({ role: "assistant", content: `Sorry, I encountered an error: ${errorMessage}`, modelUsed: "System Error"});
            onContentGenerated(`Error: ${errorMessage}`, 'text', 'Processing Error');
        }
        toast({
          title: "Error",
          description: `Failed to get response from AI: ${errorMessage}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [conversationHistory, toast, onContentGenerated, messages] 
  );

  return (
    <div className="flex flex-col flex-grow bg-card overflow-hidden h-full">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
