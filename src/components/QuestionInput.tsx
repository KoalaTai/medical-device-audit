import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X } from '@phosphor-icons/react';
import { Question } from '../lib/types';

interface QuestionInputProps {
  question: Question;
  value: string | boolean | undefined;
  onChange: (value: string | boolean) => void;
}

export function QuestionInput({ question, value, onChange }: QuestionInputProps) {
  if (question.type === 'yesno') {
    return (
      <div className="flex gap-3">
        <Button
          variant={value === true ? "default" : "outline"}
          onClick={() => onChange(true)}
          className="flex-1 flex items-center justify-center gap-2 h-12"
        >
          <Check size={16} />
          Yes
        </Button>
        <Button
          variant={value === false ? "destructive" : "outline"}
          onClick={() => onChange(false)}
          className="flex-1 flex items-center justify-center gap-2 h-12"
        >
          <X size={16} />
          No
        </Button>
      </div>
    );
  }

  if (question.type === 'select' && question.options) {
    return (
      <Select
        value={value as string || ""}
        onValueChange={(newValue) => onChange(newValue)}
      >
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Select an option..." />
        </SelectTrigger>
        <SelectContent>
          {question.options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (question.type === 'text') {
    return (
      <Textarea
        value={value as string || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your response..."
        className="min-h-[100px] resize-none"
      />
    );
  }

  return null;
}