import React from 'react';
import { Idea } from '../types/idea';

interface IdeaItemProps {
  idea: Idea;
}

export default function IdeaItem({ idea }: IdeaItemProps) {
  return (
    <div style={{ display: 'flex', border: '1px solid #ccc', padding: '15px', marginBottom: '10px', alignItems: 'center', background: '#888' }}>
      
      {/* 1. 이미지 대신 아이디어 사진용 회색 네모 박스 */}
      <div style={{ width: '100px', height: '100px', background: '#ddd', marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.9em' }}>
        아이디어 사진   
      </div>

      {/* 2. 텍스트 정보 영역 */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          <span>{idea.projectName}</span> &nbsp;&nbsp;
          <span style={{ fontSize: '0.9em', color: '#333' }}>겹치는 키워드 (ex. {idea.keywords})</span>
        </div>
        <p style={{ margin: 0, color: '#222' }}>
          {idea.description}
        </p>
      </div>

      {/* 3. 종류 (기부인지 판매인지) */}
      <div style={{ padding: '5px 15px', background: '#333', color: '#fff', borderRadius: '4px' }}>
        {idea.type}
      </div>
    </div>
  );
}