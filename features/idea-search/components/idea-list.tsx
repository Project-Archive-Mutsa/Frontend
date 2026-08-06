import React from 'react';
import IdeaItem from './idea-item';
import { Idea } from '../types/idea';

interface IdeaListProps {
  summaryText: string;
  ideas: Idea[];
}

export default function IdeaList({ summaryText, ideas }: IdeaListProps) {
  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', background: '#aaa', padding: '20px' }}>
      <div style={{ background: '#ddd', padding: '15px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '20px' }}>
        {summaryText}
      </div>

      <div>
        {ideas.map((idea) => (
          <IdeaItem key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  );
}