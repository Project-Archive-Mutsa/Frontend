import Link from 'next/link';

export default function MessageListPage() {
  // 임시 쪽지 데이터 (나중에 백엔드 API와 연동)
  const messages = [
    { id: 1, projectName: "프로젝트 이름", senderId: "아이디", preview: "메시지 미리보기" },
    { id: 2, projectName: "프로젝트 이름", senderId: "아이디", preview: "메시지 미리보기" },
    { id: 3, projectName: "프로젝트 이름", senderId: "아이디", preview: "메시지 미리보기" },
    { id: 4, projectName: "프로젝트 이름", senderId: "아이디", preview: "메시지 미리보기" },
    { id: 5, projectName: "프로젝트 이름", senderId: "아이디", preview: "메시지 미리보기" },
  ];

  return (
    <main className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#d5e2eb] p-8 md:p-12 shadow-sm space-y-8">
        
        {/* 상단 타이틀 */}
        <h1 className="text-3xl font-bold text-[#183a57]">쪽지함</h1>

        {/* 쪽지 목록 리스트 */}
        <div className="divide-y divide-[#d5e2eb]">
          {messages.map((msg) => (
            <div key={msg.id} className="py-5 flex items-center justify-between first:pt-0 last:pb-0">
              
              {/* 왼쪽: 프로필 아이콘 + 정보 */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f1f7] text-[#317bb8]">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-[#317bb8] cursor-pointer hover:underline">
                      {msg.projectName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#65788a]">
                    <span className="font-semibold">{msg.senderId}</span>
                    <span>·</span>
                    <span className="text-gray-400">{msg.preview}</span>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 메뉴 아이콘 (햄버거 버튼) */}
              <button className="text-[#65788a] hover:text-[#183a57] p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}