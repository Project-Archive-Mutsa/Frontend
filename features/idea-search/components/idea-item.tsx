import { Idea } from '@/mocks/idea-search/types';
import Image from 'next/image';

interface IdeaItemProps {
  idea: Idea;
}

export default function IdeaItem({ idea }: IdeaItemProps) {
  const isSale = idea.type === '판매';

  return (
    <div className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow gap-4">
      
      {/* 1. 프로젝트 정보 영역 (가장 왼쪽, 남은 공간 모두 차지) */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2.5 mb-1.5">
          <h3 className="font-bold text-slate-900 text-base truncate">{idea.projectName}</h3>
          
          {/* 키워드 배지들 */}
          <div className="flex gap-1 flex-wrap">
            {idea.keywords.map((keyword) => (
              <span key={keyword} className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <p className="m-0 text-slate-600 text-sm leading-relaxed line-clamp-2">
          {idea.description}
        </p>
      </div>

      {/* 2. 이미지와 배지를 함께 묶어주는 오른쪽 컨테이너 (오른쪽 끝에 고정) */}
      {/* items-center를 통해 이미지와 배지가 세로 중앙 정렬됩니다. gap-3로 둘 사이 간격을 줍니다. */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* 2-1. 썸네일 이미지 (있는 경우에만 표시) */}
        {idea.imageUrl && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
            <Image 
              src={idea.imageUrl} 
              alt={idea.projectName} 
              fill 
              className="object-cover"
            />
          </div>
        )}

        {/* 2-2. 타입(판매/기부) 배지 (이미지의 바로 오른쪽) */}
        <div className={`px-4 py-1.5 rounded-full text-xs font-semibold text-white ${isSale ? 'bg-blue-500' : 'bg-emerald-500'}`}>
          {idea.type}
        </div>
      </div>
    </div>
  );
}