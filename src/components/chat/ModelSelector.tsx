"use client";

import * as React from "react"; // Added this import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrainCircuit, Code2, Image as ImageIcon } from "lucide-react";

export interface ModelOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export const availableModels: ModelOption[] = [
  { value: "together-general", label: "Chat", icon: <BrainCircuit className="w-4 h-4 mr-2 text-muted-foreground" /> },
  { value: "together-code", label: "Code", icon: <Code2 className="w-4 h-4 mr-2 text-muted-foreground" /> },
  { value: "together-image", label: "Image", icon: <ImageIcon className="w-4 h-4 mr-2 text-muted-foreground" /> },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelValue: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({ selectedModel, onModelChange, disabled }: ModelSelectorProps) {
  return (
    <Select value={selectedModel} onValueChange={onModelChange} disabled={disabled}>
      <SelectTrigger 
        className="w-auto min-w-[110px] text-xs sm:text-sm h-9 bg-card border-0 shadow-none focus:ring-0 focus:ring-offset-0 data-[placeholder]:text-muted-foreground px-2 sm:px-3"
        aria-label="Select AI Mode"
      >
        <SelectValue placeholder="Select Mode" />
      </SelectTrigger>
      <SelectContent>
        {availableModels.map((model) => (
          <SelectItem key={model.value} value={model.value} className="text-xs sm:text-sm">
            <div className="flex items-center">
              {React.cloneElement(model.icon as React.ReactElement, { className: "w-4 h-4 mr-2 text-current" })}
              {model.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
