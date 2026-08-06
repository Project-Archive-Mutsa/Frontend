import { SearchData } from '../types/idea';

export const searchMockData: SearchData = {
  summaryText: "유사 프로젝트가 5건이 있습니다.",
  ideas: [
    {
      id: 1,
      image: "https://via.placeholder.com/150",
      projectName: "프로젝트 이름 A",
      keywords: "ai, 해커톤, 해외",
      description: "해당 프로젝트는 개인별 맞춤 운동이라는 점에서 유사함",
      type: "판매",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/150",
      projectName: "프로젝트 이름 B",
      keywords: "헬스, AI, 추천",
      description: "사용자 루틴 분석 방식이 유사함",
      type: "기부",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/150",
      projectName: "프로젝트 이름 C",
      keywords: "운동, 플랫폼, 글로벌",
      description: "운동 데이터 시각화 기능이 겹침",
      type: "판매",
    },
    {
      id: 4,
      image: "https://via.placeholder.com/150",
      projectName: "프로젝트 이름 D",
      keywords: "AI, 홈트레이닝",
      description: "실시간 자세 교정 모듈이 동일함",
      type: "판매",
    },
    {
      id: 5,
      image: "https://via.placeholder.com/150",
      projectName: "프로젝트 이름 E",
      keywords: "기부, 소셜, 운동",
      description: "소셜 연동 및 기부 시스템 구조가 유사함",
      type: "기부",
    },
  ],
};

export const fetchIdeaSearchData = async (): Promise<SearchData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(searchMockData);
    }, 300);
  });
};