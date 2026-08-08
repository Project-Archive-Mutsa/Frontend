export interface Idea {
    id: number;
    projectName: string;
    keywords: readonly string[];
    description: string;
    type: '판매' | '기부';
    imageUrl?: string; // 이미지가 있을 수도 있고 없을 수도 있음
  }
  
  export interface SearchData {
    summaryText: string;
    ideas: Idea[];
  }