import Link from 'next/link';

export default function TeamApplicationsPage() {
  // 임시 팀원 신청 내역 데이터 (나중에 백엔드 API와 연동)
  const applications = [
    { id: 1, projectName: "프로젝트 이름", role: "UI·UX 디자이너", date: "2026.08.14", status: "검토중", statusColor: "text-gray-500" },
    { id: 2, projectName: "프로젝트 이름", role: "UI·UX 디자이너", date: "2026.08.14", status: "수락됨", statusColor: "text-[#22c55e]" },
    { id: 3, projectName: "프로젝트 이름", role: "UI·UX 디자이너", date: "2026.08.14", status: "마감됨", statusColor: "text-gray-900" },
    { id: 4, projectName: "프로젝트 이름", role: "UI·UX 디자이너", date: "2026.08.14", status: "검토중", statusColor: "text-gray-500" },
  ];

  return (
    <main className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 페이지 타이틀 */}
        <h1 className="text-3xl font-bold text-[#183a57]">팀원신청 내역</h1>

        {/* 테이블 헤더 */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] px-6 text-sm font-bold text-[#183a57]">
          <span>프로젝트</span>
          <span className="text-center">지원 역할</span>
          <span className="text-center">신청일</span>
          <span className="text-center">상태</span>
        </div>

        {/* 신청 내역 리스트 */}
        <div className="space-y-4">
          {applications.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] items-center bg-white rounded-2xl border border-[#d5e2eb] p-6 shadow-sm gap-4">
              
              {/* 1. 프로젝트 정보 */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#e7f1f7] text-[#317bb8]">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#317bb8]">{item.projectName}</h3>
                  <div>
                    <Link href="#" className="text-xs font-semibold text-[#183a57] hover:underline">
                      상세 페이지 →
                    </Link>
                  </div>
                </div>
              </div>

              {/* 2. 지원 역할 */}
              <div className="text-center text-sm font-semibold text-[#317bb8]">
                {item.role}
              </div>

              {/* 3. 신청일 */}
              <div className="text-center text-sm font-semibold text-[#183a57]">
                {item.date}
              </div>

              {/* 4. 상태 */}
              <div className={`text-center text-sm font-bold ${item.statusColor}`}>
                ● {item.status}
              </div>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}