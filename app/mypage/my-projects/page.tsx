import Link from 'next/link';

export default function MyProjectsPage() {
  // 임시 데이터 (나중에 백엔드 API와 연동)
  const myProjects = [
    { 
      id: 1, 
      projectName: "프로젝트 이름", 
      likes: "23,4k", 
      date: "26.08.24", 
      tags: ["파트 태그", "파트 태그", "파트 태그", "파트 태그", "파트 태그", "파트 태그"],
      points: "450 Point" 
    },
    { 
      id: 2, 
      projectName: "프로젝트 이름", 
      likes: "23,4k", 
      date: "26.08.24", 
      tags: ["파트 태그", "파트 태그", "파트 태그", "파트 태그", "파트 태그", "파트 태그"],
      points: "450 Point" 
    },
    { 
      id: 3, 
      projectName: "프로젝트 이름", 
      likes: "23,4k", 
      date: "26.08.24", 
      tags: ["파트 태그", "파트 태그", "파트 태그", "파트 태그", "파트 태그", "파트 태그"],
      points: "450 Point" 
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 페이지 타이틀 및 설명 */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#183a57]">내가 올린 프로젝트</h1>
          <p className="text-xs text-[#65788a]">등록한 프로젝트의 공개 상태와 제안·지원 현황을 관리할 수 있습니다.</p>
        </div>

        {/* 테이블 헤더 (프로젝트, 태그, 상태) */}
        <div className="hidden md:grid grid-cols-[2fr_2fr_1fr] px-6 text-sm font-bold text-[#183a57]">
          <span>프로젝트</span>
          <span className="text-center">태그</span>
          <span className="text-center">상태</span>
        </div>

        {/* 프로젝트 리스트 카드 */}
        <div className="space-y-4">
          {myProjects.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr] items-center bg-white rounded-2xl border border-[#d5e2eb] p-6 shadow-sm gap-4">
              
              {/* 1. 프로젝트 기본 정보 */}
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#e7f1f7] text-[#317bb8]">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#317bb8]">{item.projectName}</h3>
                  <div className="flex items-center gap-3 text-xs text-[#65788a]">
                    <span>즐겨 찾기 {item.likes}</span>
                    <span>·</span>
                    <span>등록일 {item.date}</span>
                  </div>
                  <div>
                    <Link href="#" className="text-xs font-semibold text-[#183a57] hover:underline">
                      상세 페이지 →
                    </Link>
                  </div>
                </div>
              </div>

              {/* 2. 태그 영역 */}
              <div className="flex flex-wrap gap-1.5 justify-center max-w-xs mx-auto">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="rounded-full border border-[#d5e2eb] bg-[#f8f9fa] px-3 py-1 text-[11px] font-medium text-[#65788a]">
                    {tag}
                  </span>
                ))}
              </div>

              {/* 3. 포인트 및 판매 버튼 영역 */}
              <div className="flex items-center justify-between md:justify-end gap-4 bg-[#4b96d1]/10 md:bg-transparent p-4 md:p-0 rounded-xl">
                <span className="text-sm font-bold text-[#317bb8] md:hidden">포인트</span>
                <div className="flex items-center gap-4">
                  <span className="text-base font-bold text-[#317bb8]">{item.points}</span>
                  <button className="rounded-xl bg-[#4b96d1] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#3f81b7]">
                    프로젝트 판매
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}