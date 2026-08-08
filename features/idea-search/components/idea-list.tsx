import IdeaItem from './idea-item';
import { getIdeaSearchData } from '../api/get-idea-search-data';

// 1. async Server Component로 선언
export default async function IdeaList() {
  // 2. 컴포넌트 내부에서 데이터 조회 (Data Fetching을 스스로 해결)
  const data = await getIdeaSearchData();

  // 3. 빈 데이터 처리
  if (!data.ideas || data.ideas.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-slate-200 text-center text-slate-500">
        검색된 유사 프로젝트가 없습니다.
      </div>
    );
  }

  // 4. 데이터 렌더링 (리스트 매핑 및 단일 아이템 렌더링)
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-slate-200">
      <div className="bg-slate-100 p-4 rounded-xl text-center font-semibold text-slate-800 text-base mb-6">
        {data.summaryText}
      </div>

      <div className="flex flex-col gap-4">
        {data.ideas.map((idea) => (
          <IdeaItem key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  );
}