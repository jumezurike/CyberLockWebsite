import React from 'react';
import { KnowledgeBase } from '../components/knowledge-base/knowledge-base';

export default function KnowledgeBasePage() {
  return (
    <div className="container mx-auto py-12">
      <KnowledgeBase 
        title="CyberLockX Knowledge Base" 
        description="Explore our comprehensive collection of cybersecurity resources, competitive advantages, and technology information."
      />
    </div>
  );
}