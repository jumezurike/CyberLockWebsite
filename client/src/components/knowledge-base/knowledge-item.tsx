import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface KnowledgeItemProps {
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

export function KnowledgeItem({ title, content, defaultOpen = false }: KnowledgeItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className={`w-full flex justify-between items-center p-4 text-left ${
          isOpen ? 'bg-primary text-white font-medium' : 'bg-white hover:bg-gray-50'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${isOpen ? 'text-white' : 'text-gray-900'} text-lg`}>{title}</span>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180 text-white' : 'text-gray-500'}`}
        />
      </button>
      
      {isOpen && (
        <div className="p-4 bg-white border-t">
          {content}
        </div>
      )}
    </div>
  );
}