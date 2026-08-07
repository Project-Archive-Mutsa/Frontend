import React from 'react';
import IdeaItem from './idea-item';
import { Idea } from '../types/idea';

interface IdeaListProps {
  summaryText: string;
  ideas: Idea[];
}

export default function IdeaList({ summaryText, ideas }: IdeaListProps) {
  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '800px', 
      margin: '0 auto', 
      background: '#ffffff', 
      borderRadius: '16px', 
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)', 
      padding: '30px', 
      border: '1px solid #e2e8f0' 
    }}>
      {/* 데이터 목록: 검색 결과 요약 문장 배너 */}
      <div style={{ 
        background: '#f1f5f9', 
        padding: '16px 20px', 
        borderRadius: '10px', 
        textAlign: 'center', 
        fontWeight: '600', 
        fontSize: '1.05em', 
        color: '#1e293b', 
        marginBottom: '24px' 
      }}>
        {summaryText}
      </div>

      {/* 아이디어 리스트 매핑 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {ideas.map((idea) => (
          <IdeaItem key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  );
}