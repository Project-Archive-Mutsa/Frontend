import type { PopularProject } from "@/mocks/popular-projects/types";

// 조회수와 좋아요 반응이 높은 프로젝트부터 정렬한 임시 데이터
export const popularProjects: readonly PopularProject[] = [
  {
    id: "popular-001",
    slug: "fit-rest-ai",
    name: "FitRest AI",
    summary: "운동 초보자의 통증과 감정을 분석해 짧은 회복 루틴을 제안합니다.",
    representativeImage: {
      src: "/globe.svg",
      alt: "FitRest AI 임시 대표 이미지",
    },
    category: "해커톤",
    techStack: ["Next.js", "FastAPI", "AI"],
    stats: {
      viewCount: 1248,
      likeCount: 216,
    },
  },
  {
    id: "popular-002",
    slug: "backup",
    name: "Backup",
    summary: "검증된 단기 근무자와 긴급 대체 인력이 필요한 매장을 연결합니다.",
    representativeImage: {
      src: "/window.svg",
      alt: "Backup 임시 대표 이미지",
    },
    category: "창업경진대회",
    techStack: ["React Native", "NestJS", "PostgreSQL"],
    stats: {
      viewCount: 1103,
      likeCount: 184,
    },
  },
  {
    id: "popular-003",
    slug: "maison-memory",
    name: "MAISON MEMORY",
    summary: "제품의 헤리티지와 관리·수선 이력을 디지털 오너십으로 연결합니다.",
    representativeImage: {
      src: "/vercel.svg",
      alt: "MAISON MEMORY 임시 대표 이미지",
    },
    category: "아이디어 공모전",
    stats: {
      viewCount: 986,
      likeCount: 171,
    },
  },
  {
    id: "popular-004",
    slug: "ai-virtual-fitting",
    name: "AI 가상 피팅",
    summary: "사용자의 체형을 분석하고 구매 전 의류의 핏을 가상으로 보여줍니다.",
    representativeImage: {
      src: "/file.svg",
      alt: "AI 가상 피팅 임시 대표 이미지",
    },
    category: "졸업전시",
    techStack: ["React", "Three.js", "Vision AI"],
    stats: {
      viewCount: 904,
      likeCount: 163,
    },
  },
];
