import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface KnowledgeItemProps {
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

export function KnowledgeItem({ title, content, defaultOpen = false }: KnowledgeItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center bg-white hover:bg-gray-50 border-b border-gray-100 transition-colors text-left"
      >
        <h3 className="text-lg font-medium">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          {typeof content === 'string' ? (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            content
          )}
        </div>
      )}
    </div>
  );
}