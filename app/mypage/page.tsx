import Link from 'next/link';

export default function MyPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      {/* 마이페이지 메인 컨텐츠 박스 */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#d5e2eb] p-10 shadow-sm text-center space-y-8">
        
        {/* 프로필 아이콘 및 기본 정보 */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e7f1f7] text-[#317bb8] shadow-inner">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#183a57]">이름</h2>
          
          {/* 아이디와 보유 포인트 나란히 정렬 */}
          <div className="flex items-center justify-center gap-4 text-sm text-[#65788a] font-medium">
            <span>아이디</span>
            <span className="text-[#d5e2eb]">|</span>
            <span>보유 포인트 <strong className="text-[#317bb8]">0 P</strong></span>
          </div>
        </div>

        {/* 상단 주요 액션 버튼 (쪽지함, 포인트/거래내역) */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Link 
            href="/mypage/messages" 
            className="flex items-center justify-center rounded-xl bg-[#317bb8] py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#256395]"
          >
            쪽지함
          </Link>
          <Link 
            href="/mypage/points" 
            className="flex items-center justify-center rounded-xl bg-[#317bb8] py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#256395]"
          >
            포인트 / 거래내역
          </Link>
        </div>

        {/* 하단 메뉴 이동 버튼들 */}
        <div className="flex flex-col gap-3 max-w-md mx-auto pt-4">
          <Link 
            href="/mypage/my-projects" 
            className="flex items-center justify-center w-full rounded-xl bg-[#4b96d1] py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3f81b7]"
          >
            내가올린 프로젝트
          </Link>
          <Link 
            href="/mypage/wishlist" 
            className="flex items-center justify-center w-full rounded-xl bg-[#4b96d1] py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3f81b7]"
          >
            관심 프로젝트
          </Link>
          <Link 
            href="/mypage/team-applications" 
            className="flex items-center justify-center w-full rounded-xl bg-[#4b96d1] py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3f81b7]"
          >
            팀원 신청 내역
          </Link>
        </div>

      </div>
    </main>
  );
}