import React from 'react';
import { Idea } from '../types/idea';

interface IdeaItemProps {
  idea: Idea;
}

export default function IdeaItem({ idea }: IdeaItemProps) {
  const isSale = idea.type === '판매';

  return (
    <div style={{ 
      display: 'flex', 
      border: '1px solid #e2e8f0', 
      borderRadius: '12px', 
      padding: '20px', 
      alignItems: 'center', 
      background: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    }}>
      {/* 아이디어 사진 영역 (회색 네모 박스) */}
      <div style={{ 
        width: '90px', 
        height: '90px', 
        background: '#f8fafc', 
        borderRadius: '8px', 
        marginRight: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: '#64748b', 
        fontSize: '0.8em',
        fontWeight: '500',
        flexShrink: 0,
        border: '1px dashed #cbd5e1'
      }}>
        아이디어 사진
      </div>

      {/* 텍스트 정보 영역 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontWeight: '700', fontSize: '1.05em', color: '#0f172a' }}>{idea.projectName}</span>
          <span style={{ fontSize: '0.8em', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            {idea.keywords}
          </span>
        </div>
        <p style={{ margin: 0, color: '#475569', fontSize: '0.92em', lineHeight: '1.4' }}>
          {idea.description}
        </p>
      </div>

      {/* 종류 배지 */}
      <div style={{ 
        padding: '6px 14px', 
        background: isSale ? '#3b82f6' : '#10b981', 
        color: '#fff', 
        borderRadius: '20px', 
        fontSize: '0.85em',
        fontWeight: '600',
        marginLeft: '16px',
        flexShrink: 0
      }}>
        {idea.type}
      </div>
    </div>
  );
}