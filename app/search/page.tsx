// app/search/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { fetchIdeaSearchData } from '@/features/idea-search/api/idea-api';
import { SearchData } from '@/features/idea-search/types/idea';
import IdeaList from '@/features/idea-search/components/idea-list';

export default function Page() {
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
    return <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>로딩 중...</div>;
  }

  if (!searchData) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>데이터가 없습니다.</div>;
  }

  return (
    <main style={{ padding: '40px 20px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <IdeaList 
        summaryText={searchData.summaryText} 
        ideas={searchData.ideas} 
      />
    </main>
  );
}