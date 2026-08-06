'use client';

import React, { useEffect, useState } from 'react';
import { fetchIdeaSearchData } from '../api/idea-api';
import { SearchData } from '../types/idea';
import IdeaList from './idea-list';

export default function SearchPageView() {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchIdeaSearchData();
        setSearchData(data);
      } catch (error) {
        console.error("데이터 로딩 실패", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>;
  }

  if (!searchData) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <main style={{ padding: '20px', background: '#333', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', width: '400px', background: '#ccc', borderRadius: '4px', overflow: 'hidden' }}>
          <input type="text" placeholder="검색내용" readOnly style={{ flex: 1, padding: '10px', border: 'none', background: 'transparent' }} />
          <button style={{ padding: '10px 20px', background: '#666', color: '#fff', border: 'none' }}>AI</button>
        </div>
      </div>

      <IdeaList 
        summaryText={searchData.summaryText} 
        ideas={searchData.ideas} 
      />
    </main>
  );
}