import { getServerApiUrl } from "@/shared/api/server-api-url";

export default async function DetailPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;
  
    const res = await fetch(getServerApiUrl(`/api/contests/${id}`));
    const result = await res.json();
    const data = result?.data;
  
    if (!data) {
      return <div className="p-12 text-center text-gray-500">정보를 불러올 수 없습니다.</div>;
    }
  
    // 서브 이미지 목록 (데이터에 없다면 빈 배열 처리)
    const images = data.images || [];
    const representativeImage = data.representativeImageUrl || images[0]?.imageUrl || "";
    const subImages = images.slice(1, 4); // 최대 3개
  
    return (
      <main className="min-h-screen bg-[#f8f9fa] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* 1. 상단 타이틀 및 프로필 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
            {/* 좌측: 타이틀, 한줄소개, 태그 */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-[#183a57]">
                {data.projectName || data.contestName || "프로젝트 이름"}
              </h1>
              <p className="text-base text-[#65788a]">
                {data.description || "한줄 소개 또는 설명이 없습니다."}
              </p>
              {/* 태그 목록 */}
              <div className="flex flex-wrap gap-2">
                {(data.tags || []).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="rounded-full border border-[#d5e2eb] bg-white px-3 py-1 text-xs font-medium text-[#5f7283]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
  
            {/* 우측: 판매자/작성자 프로필 카드 */}
            <div className="rounded-2xl border border-[#d5e2eb] bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e7f1f7] text-[#317bb8]">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="mt-3 font-bold text-[#183a57]">
                {data.sellerName || data.host || "아이디"}
              </h3>
              <button className="mt-3 w-full rounded-lg bg-[#e7f1f7] py-2 text-xs font-semibold text-[#317bb8] transition-colors hover:bg-[#d5e2eb]">
                쪽지 보내기
              </button>
              <div className="mt-4 flex justify-around border-t border-[#f0f4f8] pt-4 text-xs text-[#6c7f90]">
                <div>
                  <p className="font-medium text-[#183a57]">등록일</p>
                  <p className="mt-1">{data.registeredDate || data.awardedDate || "26.08.24"}</p>
                </div>
                <div>
                  <p className="font-medium text-[#183a57]">조회/좋아요</p>
                  <p className="mt-1">{data.viewCount ?? 0}회</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* 2. 이미지 갤러리 섹션 (메인 1장 + 서브 3장 그리드) */}
<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
  <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-[#d5e2eb] bg-[#e7f1f7] bg-cover bg-center shadow-sm"
       style={{ backgroundImage: `url(${representativeImage})` }} />
  
  <div className="flex flex-col gap-4">
    {subImages.length > 0 ? (
      subImages.map((img: { imageUrl?: string }, idx: number) => (
        <div key={idx} className="flex-1 aspect-[16/9] overflow-hidden rounded-xl border border-[#d5e2eb] bg-[#e7f1f7] bg-cover bg-center"
             style={{ backgroundImage: `url(${img.imageUrl})` }} />
      ))
    ) : (
      <>
        <div className="flex-1 min-h-[90px] rounded-xl border border-dashed border-[#d5e2eb] bg-white flex items-center justify-center text-gray-400 text-xs">이미지 없음</div>
        <div className="flex-1 min-h-[90px] rounded-xl border border-dashed border-[#d5e2eb] bg-white flex items-center justify-center text-gray-400 text-xs">이미지 없음</div>
        <div className="flex-1 min-h-[90px] rounded-xl border border-dashed border-[#d5e2eb] bg-white flex items-center justify-center text-gray-400 text-xs">이미지 없음</div>
      </>
    )}
  </div>
</div>
  
          {/* 3. 정보 요약 바 (수상 이력, 개발 상태, 개발 기간 등) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#d5e2eb] bg-white p-4 flex items-center justify-between shadow-sm">
              <span className="text-sm font-semibold text-[#6c7f90]">수상 이력 / 카테고리</span>
              <span className="text-sm font-bold text-[#183a57]">{data.category || data.awardRank || "일반 프로젝트"}</span>
            </div>
            <div className="rounded-xl border border-[#d5e2eb] bg-white p-4 flex items-center justify-between shadow-sm">
              <span className="text-sm font-semibold text-[#6c7f90]">개발 기간</span>
              <span className="text-sm font-medium text-[#183a57]">
                {data.startDate && data.endDate ? `[ ${data.startDate} ] ~ [ ${data.endDate} ]` : "기간 정보 없음"}
              </span>
            </div>
          </div>
  
          {/* 4. 문서 및 소스코드 공개 상태 박스 */}
          <div className="rounded-2xl border border-[#d5e2eb] bg-white p-6 space-y-4 shadow-sm">
            {[
              { title: "기획서", desc: "페이지 소개 및 기획 문서" },
              { title: "소스코드", desc: "개발 소스 코드 및 저장소" },
              { title: "UI/UX 디자인", desc: "디자인 리소스 및 프로토타입" },
              { title: "설치 배포문서", desc: "서버 구축 및 실행 가이드" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-[#f0f4f8] pb-4 last:border-none last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#317bb8] text-[#317bb8]">
                    🔒
                  </div>
                  <div>
                    <h4 className="font-bold text-[#183a57]">{item.title}</h4>
                    <p className="text-xs text-[#6c7f90]">{item.desc}</p>
                  </div>
                </div>
                <button className="rounded-lg bg-[#317bb8] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#256395]">
                  무료 공개
                </button>
              </div>
            ))}
          </div>
  
          {/* 5. 프로젝트 상세 설명 박스 */}
          <div className="rounded-2xl border border-[#d5e2eb] bg-white p-8 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#183a57]">프로젝트 상세 설명</h3>
            <div className="min-h-[300px] rounded-xl border border-dashed border-[#d5e2eb] bg-[#f8f9fa] p-6 text-[#65788a] whitespace-pre-wrap leading-relaxed">
              {data.description || "등록된 상세 내용이 없습니다."}
            </div>
          </div>
  
          {/* 6. 첨부된 파일 및 연결 링크 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[#d5e2eb] bg-white p-6 space-y-4 shadow-sm">
              <h4 className="font-bold text-[#183a57]">첨부된 파일</h4>
              <div className="space-y-2 text-xs text-[#6c7f90]">
                <div className="flex justify-between items-center py-2 border-b border-[#f0f4f8]">
                  <span>[PDF] 프로젝트_발표자료.pdf</span>
                  <span className="text-[#317bb8] cursor-pointer font-semibold">다운로드</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>[ZIP] source-code.zip</span>
                  <span className="text-[#317bb8] cursor-pointer font-semibold">다운로드</span>
                </div>
              </div>
            </div>
  
            <div className="rounded-2xl border border-[#d5e2eb] bg-white p-6 space-y-4 shadow-sm">
              <h4 className="font-bold text-[#183a57]">연결 링크</h4>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg border border-[#d5e2eb] px-3 py-1.5 text-xs text-[#5f7283]">GitHub</span>
                <span className="rounded-lg border border-[#d5e2eb] px-3 py-1.5 text-xs text-[#5f7283]">YouTube</span>
                <span className="rounded-lg border border-[#d5e2eb] px-3 py-1.5 text-xs text-[#5f7283]">Figma</span>
              </div>
            </div>
          </div>
  
        </div>
      </main>
    );
  }
