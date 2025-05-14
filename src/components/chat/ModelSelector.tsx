"use client";

import type * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrainCircuit, Code2 } from "lucide-react";

export interface ModelOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export const availableModels: ModelOption[] = [
  { value: "general", label: "General Chat (OpenAI)", icon: <BrainCircuit className="w-4 h-4 mr-2" /> },
  { value: "openai-code", label: "Code Generation (OpenAI)", icon: <Code2 className="w-4 h-4 mr-2" /> },
  // { value: "deepinfra-code", label: "Code Generation (DeepInfra)", icon: <Code2 className="w-4 h-4 mr-2" /> }, // Removed DeepInfra
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelValue: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({ selectedModel, onModelChange, disabled }: ModelSelectorProps) {
  return (
    <Select value={selectedModel} onValueChange={onModelChange} disabled={disabled}>
      <SelectTrigger className="w-auto min-w-[240px] text-sm h-10"> {/* Increased min-width for longer label */}
        <SelectValue placeholder="Select Model/Mode" />
      </SelectTrigger>
      <SelectContent>
        {availableModels.map((model) => (
          <SelectItem key={model.value} value={model.value}>
            <div className="flex items-center">
              {model.icon}
              {model.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
