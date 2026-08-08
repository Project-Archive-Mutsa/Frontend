import type { RecentAwardProject } from "@/mocks/recent-award-projects/types";

// 최근 수상일이 최신인 프로젝트부터 정렬한 임시 데이터
export const recentAwardProjects: readonly RecentAwardProject[] = [
  {
    id: "recent-award-001",
    slug: "space-pop-ai",
    name: "SpacePop AI",
    summary: "소상공인의 유휴 시간과 단기 공실을 팝업 공간으로 연결합니다.",
    representativeImage: {
      src: "/window.svg",
      alt: "SpacePop AI 임시 대표 이미지",
    },
    category: "해커톤",
    techStack: ["Next.js", "FastAPI", "Vision AI", "PostgreSQL"],
    developmentPeriod: {
      startedAt: "2026-06-01",
      endedAt: "2026-07-20",
    },
    team: {
      size: 5,
      composition: "PM 1, 프론트엔드 1, 백엔드 2, AI 1",
    },
    award: {
      competitionName: "멋쟁이사자처럼 중앙 해커톤",
      title: "대상",
      awardedAt: "2026-07-20",
    },
    stats: {
      viewCount: 812,
      likeCount: 126,
    },
  },
  {
    id: "recent-award-002",
    slug: "fit-mirror",
    name: "Fit Mirror",
    summary: "체형 분석과 가상 시착으로 구매 전 옷의 핏을 확인합니다.",
    representativeImage: {
      src: "/globe.svg",
      alt: "Fit Mirror 임시 대표 이미지",
    },
    category: "졸업전시",
    techStack: ["React", "Three.js", "Vision AI"],
    developmentPeriod: {
      startedAt: "2026-03-02",
      endedAt: "2026-06-20",
    },
    team: {
      size: 2,
      composition: "디자인 1, 프론트엔드 1",
    },
    award: {
      competitionName: "예시디자인대학교 졸업전시",
      title: "관객상",
      awardedAt: "2026-07-02",
    },
    stats: {
      viewCount: 957,
      likeCount: 173,
    },
  },
  {
    id: "recent-award-003",
    slug: "major-gig",
    name: "MajorGig",
    summary: "대학생의 전공과 일정에 맞는 단기 프로젝트 경험을 연결합니다.",
    representativeImage: {
      src: "/file.svg",
      alt: "MajorGig 임시 대표 이미지",
    },
    category: "창업경진대회",
    techStack: ["React Native", "NestJS", "OCR", "PostgreSQL"],
    team: {
      size: 3,
      composition: "PM 1, 프론트엔드 1, 백엔드 1",
    },
    award: {
      competitionName: "대학생 창업경진대회",
      title: "최우수상",
      awardedAt: "2026-06-11",
    },
    stats: {
      viewCount: 645,
      likeCount: 89,
    },
  },
  {
    id: "recent-award-004",
    slug: "maison-memory",
    name: "MAISON MEMORY",
    summary: "럭셔리 제품의 기억과 관리·수선 이력을 디지털 패스포트로 연결합니다.",
    representativeImage: {
      src: "/vercel.svg",
      alt: "MAISON MEMORY 임시 대표 이미지",
    },
    category: "아이디어 공모전",
    award: {
      competitionName: "럭셔리 고객 경험 아이디어 공모전",
      title: "우수상",
      awardedAt: "2026-05-18",
    },
    stats: {
      viewCount: 592,
      likeCount: 104,
    },
  },
];
