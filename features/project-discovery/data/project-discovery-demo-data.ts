import type {
  ProjectDiscoveryDemoResults,
  ProjectDiscoveryResultItem,
} from "@/features/project-discovery/types";

const demoProjects: readonly ProjectDiscoveryResultItem[] = [
  {
    type: "PROJECT",
    id: 9001,
    title: "캠퍼스 기회지도",
    description:
      "공모전, 장학, 대외활동 정보를 학생의 관심 분야와 참여 조건에 맞춰 추천하는 통합 탐색 서비스입니다.",
    category: "교육·정보 탐색",
    tags: ["대학생", "맞춤 추천", "정보 검색"],
    representativeImageUrl: null,
    images: [],
    detailPath: "/projects/9001",
    similarityScore: 0.92,
    informationCompletenessScore: 88,
    registrationPurpose: "ARCHIVE",
    eventName: "2025 대학생 서비스 해커톤",
    eventDate: "2025-11-15",
    resultLevel: "SUBMISSION_OUTPUT",
    activityStatus: "ENDED",
    assetCount: 4,
    assetCategories: ["기획 문서", "프로토타입", "사용자 조사"],
    awards: [{ title: "우수상", awardedAt: "2025-11-15" }],
    similarityReasons: [
      "사용자 조건을 해석해 관련 정보를 추천하는 구조",
      "흩어진 기회를 한 화면에서 비교하게 하는 목표",
    ],
    differences: [
      "공모전과 대외활동 탐색에 집중",
      "프로젝트 자산과 권리 비교는 제공하지 않음",
    ],
    validationSuggestions: [
      "추천 기준에 대한 사용자 신뢰 검증",
      "정보 최신성 유지 비용 확인",
    ],
  },
  {
    type: "PROJECT",
    id: 9002,
    title: "팀핏",
    description:
      "관심 주제, 역할, 일정과 협업 방식을 바탕으로 공모전 팀원을 연결하는 대학생 팀 빌딩 서비스입니다.",
    category: "협업·팀 빌딩",
    tags: ["팀원 매칭", "역할 추천", "공모전"],
    representativeImageUrl: null,
    images: [],
    detailPath: "/projects/9002",
    similarityScore: 0.84,
    informationCompletenessScore: 76,
    registrationPurpose: "TEAM_RECRUIT",
    eventName: "교내 창업 아이디어톤",
    eventDate: "2025-09-02",
    resultLevel: "INITIAL_OUTPUT",
    activityStatus: "PAUSED",
    assetCount: 3,
    assetCategories: ["발표 자료", "화면 설계", "설문 결과"],
    awards: [],
    similarityReasons: [
      "사용자의 조건을 구조화해 후보를 좁히는 방식",
      "대학생 프로젝트 참여 문제를 해결하는 대상 맥락",
    ],
    differences: [
      "프로젝트보다 팀원 모집 공고가 중심",
      "기존 출품작의 문제와 해결 방식은 비교하지 않음",
    ],
    validationSuggestions: [
      "역할 분류 체계의 실제 사용성 확인",
      "매칭 이후 지원 전환율 측정",
    ],
  },
  {
    type: "PROJECT",
    id: 9003,
    title: "아카이브 브리지",
    description:
      "종료된 캡스톤 프로젝트의 문서와 결과물을 정리하고, 다음 기수 학생이 참고할 수 있게 연결합니다.",
    category: "지식 아카이브",
    tags: ["프로젝트 기록", "캡스톤", "지식 공유"],
    representativeImageUrl: null,
    images: [],
    detailPath: "/projects/9003",
    similarityScore: 0.71,
    informationCompletenessScore: 81,
    registrationPurpose: "ZOMBIE",
    eventName: "2024 산학협력 캡스톤",
    eventDate: "2024-12-10",
    resultLevel: "APPLIED",
    activityStatus: "ENDED",
    assetCount: 6,
    assetCategories: ["결과 보고서", "발표 영상", "데이터"],
    awards: [],
    similarityReasons: [
      "기존 프로젝트 정보를 재사용 가능한 지식으로 정리",
      "유사 사례 탐색을 통해 반복 작업을 줄이는 목표",
    ],
    differences: [
      "학교 내부 캡스톤 자료에 범위가 제한됨",
      "AI 유사도보다 담당자의 분류 체계에 의존",
    ],
    validationSuggestions: [
      "공개 가능한 자료 범위와 권리 확인",
      "후속 프로젝트에서의 실제 재사용 여부 측정",
    ],
  },
];

export function getProjectDiscoveryDemoResults(
  query: string,
): ProjectDiscoveryDemoResults {
  return {
    query,
    analysis: {
      summary: `입력한 “${query}” 아이디어를 사용자 문제, 정보 탐색 방식과 핵심 기능 관점에서 비교했습니다. 상위 결과는 흩어진 정보를 모으고 사용자 조건에 맞춰 후보를 좁힌다는 점이 비슷합니다. 대상 사용자와 데이터 갱신 방식, 프로젝트 자산의 활용 범위는 서로 달라 추가 검증이 필요합니다.`,
      keywords: ["맞춤 추천", "정보 탐색", "대학생 프로젝트", "지식 재사용"],
      comparisonPoints: [
        "비슷한 문제를 다룬 프로젝트가 어떤 사용자와 상황을 기준으로 설계됐는지 확인해 보세요.",
        "설명과 태그뿐 아니라 실제 해결 방식과 보유 자산까지 함께 비교하면 반복된 접근을 빠르게 찾을 수 있습니다.",
        "유사도가 높은 결과부터 차이점을 읽으면 아이디어에서 새롭게 검증해야 할 범위가 선명해집니다.",
      ],
      validationPoints: [
        "같은 문제를 다뤄도 대상 사용자와 사용 시점이 다르면 필요한 기능과 데이터가 달라집니다.",
        "기존 결과물의 구현 범위와 중단 지점을 확인해 처음부터 다시 만들 필요가 있는지 판단해 보세요.",
        "공개 자산의 실제 활용 가능 여부와 권리 조건은 프로젝트 상세 정보에서 별도로 확인해야 합니다.",
      ],
      interpretationNote:
        "유사도는 아이디어의 우수성이나 성공 가능성을 평가하는 점수가 아닙니다. 문제 정의와 해결 방식이 닮은 정도를 비교하기 위한 참고값입니다.",
    },
    projects: demoProjects,
  };
}
