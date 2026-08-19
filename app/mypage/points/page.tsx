import Link from 'next/link';

export default function PointPage() {
  // 임시 거래내역 데이터 (나중에 백엔드 API와 연동)
  const transactions = [
    { id: 1, projectName: "프로젝트 이름", likes: "23,4k", date: "26.08.24", author: "아기사자", points: "450 Point" },
    { id: 2, projectName: "프로젝트 이름", likes: "23,4k", date: "26.08.24", author: "아기사자", points: "450 Point" },
    { id: 3, projectName: "프로젝트 이름", likes: "23,4k", date: "26.08.24", author: "아기사자", points: "450 Point" },
    { id: 4, projectName: "프로젝트 이름", likes: "23,4k", date: "26.08.24", author: "아기사자", points: "450 Point" },
  ];

  return (
    <main className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* 페이지 타이틀 */}
        <h1 className="text-3xl font-bold text-[#183a57]">포인트</h1>

        {/* 1. 포인트 충전 박스 */}
        <div className="bg-white rounded-2xl border border-[#d5e2eb] p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-[#183a57]">포인트 충전</h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="충전할 포인트를 입력해주세요" 
              className="flex-1 rounded-xl border border-[#d5e2eb] bg-[#f8f9fa] px-4 py-3 text-sm outline-none focus:border-[#317bb8]"
            />
            <button className="rounded-xl bg-[#4b96d1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3f81b7]">
              충전 하기
            </button>
          </div>
          <div className="flex gap-3">
            <button className="rounded-xl border border-[#d5e2eb] bg-white px-5 py-2 text-xs font-semibold text-[#65788a] shadow-sm hover:bg-gray-50">
              10 point
            </button>
            <button className="rounded-xl border border-[#d5e2eb] bg-white px-5 py-2 text-xs font-semibold text-[#65788a] shadow-sm hover:bg-gray-50">
              100 point
            </button>
            <button className="rounded-xl border border-[#d5e2eb] bg-white px-5 py-2 text-xs font-semibold text-[#65788a] shadow-sm hover:bg-gray-50">
              1000 point
            </button>
          </div>
        </div>

        {/* 2. 총 보유 포인트 & 사용 가능 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#183a57]">총 보유 포인트</h3>
            <div className="flex items-center justify-between rounded-2xl border border-[#d5e2eb] bg-white px-6 py-4 shadow-sm">
              <span className="text-xl font-bold text-[#183a57]">45,000</span>
              <span className="text-sm font-bold text-[#183a57]">Point</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#183a57]">사용 가능 포인트</h3>
            <div className="flex items-center justify-between rounded-2xl border border-[#d5e2eb] bg-white px-6 py-4 shadow-sm">
              <span className="text-xl font-bold text-[#183a57]">45,000</span>
              <span className="text-sm font-bold text-[#183a57]">Point</span>
            </div>
          </div>
        </div>

        {/* 3. 거래내역 섹션 */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#183a57]">거래내역</h2>
            <p className="text-xs text-[#65788a]">구매한 프로젝트 내역과 사용한 포인트를 확인할 수 있습니다.</p>
          </div>

          {/* 거래내역 리스트 */}
          <div className="space-y-4">
            {transactions.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white rounded-2xl border border-[#d5e2eb] p-6 shadow-sm">
                
                {/* 왼쪽 정보 */}
                <div className="flex items-center gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#e7f1f7] text-[#317bb8]">
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
                      <span>·</span>
                      <span>등록자 {item.author}</span>
                    </div>
                    <div>
                      <Link href="#" className="text-xs font-semibold text-[#183a57] hover:underline">
                        상세 페이지 →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 오른쪽 포인트 표시 */}
                <div className="text-base font-bold text-[#317bb8]">
                  {item.points}
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}