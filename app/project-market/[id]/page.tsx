export default async function ProjectDetailPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;
  
    // 1. 배포 서버 주소 정확히 명시
    const API_BASE_URL = "https://project-archive-api-zf90.onrender.com";
    
    // 2. 데이터 가져오기
    const res = await fetch(`${API_BASE_URL}/api/projects/${id}`);
    const result = await res.json();
    
    // 데이터가 없으면 에러 방지용 null 체크
    const project = result?.data;
  
    if (!project) {
      return <div className="p-8 text-center">프로젝트 정보를 불러올 수 없습니다.</div>;
    }
  
    return (
      <div className="max-w-4xl mx-auto p-8">
        {/* 카테고리 및 상태 */}
        <div className="flex items-center gap-2 text-xs text-[#6c7f90]">
          <span className="rounded bg-[#e7f1f7] px-2 py-1 font-semibold text-[#183a57]">
            {project.category || "카테고리 없음"}
          </span>
          <span>판매자: {project.sellerName || "알 수 없음"}</span>
        </div>
  
        {/* 프로젝트 이름 */}
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#183a57]">
          {project.projectName || "제목 없음"}
        </h1>
  
        {/* 등록일 및 통계 */}
        <div className="mt-2 flex items-center gap-4 text-xs text-[#637688]">
          <time dateTime={project.registeredDate}>{project.registeredDate || "날짜 미정"}</time>
          <span>조회 {project.viewCount?.toLocaleString("ko-KR") ?? 0}</span>
          <span>좋아요 {project.likeCount?.toLocaleString("ko-KR") ?? 0}</span>
          <span>저장 {project.bookmarkCount?.toLocaleString("ko-KR") ?? 0}</span>
        </div>
  
        {/* 대표 이미지 */}
        {project.representativeImageUrl && (
          <div 
            className="mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-[#e7f1f7] bg-cover bg-center" 
            style={{ backgroundImage: `url(${project.representativeImageUrl})` }} 
          />
        )}
  
        {/* 설명 */}
        <p className="mt-6 text-base leading-7 text-[#65788a] whitespace-pre-wrap">
          {project.description || "설명이 없습니다."}
        </p>
  
        {/* 태그 목록 */}
        {project.tags && Array.isArray(project.tags) && project.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="프로젝트 태그">
            {project.tags.map((tag: string, index: number) => (
              <li
                key={index}
                className="rounded-md border border-[#d5e2eb] bg-white px-2.5 py-1 text-xs font-medium text-[#5f7283]"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
  
        {/* 가격 및 구매 영역 */}
        <div className="mt-8 flex items-center justify-between border-t border-[#d5e2eb] pt-6">
          <strong className="text-2xl font-bold text-[#214e70]">
            {project.price?.toLocaleString("ko-KR") ?? 0}원
          </strong>
        </div>
      </div>
    );
  }
