"use client";

import type * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrainCircuit, Code2, Image as ImageIcon } from "lucide-react"; // Added ImageIcon

export interface ModelOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export const availableModels: ModelOption[] = [
  { value: "together-general", label: "General Chat (Together AI)", icon: <BrainCircuit className="w-4 h-4 mr-2" /> },
  { value: "together-code", label: "Code Generation (Together AI)", icon: <Code2 className="w-4 h-4 mr-2" /> },
  { value: "together-image", label: "Image Generation (Together AI)", icon: <ImageIcon className="w-4 h-4 mr-2" /> },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelValue: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({ selectedModel, onModelChange, disabled }: ModelSelectorProps) {
  return (
    <Select value={selectedModel} onValueChange={onModelChange} disabled={disabled}>
      <SelectTrigger className="w-auto min-w-[260px] text-sm h-10"> {/* Increased min-width for longer label */}
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
