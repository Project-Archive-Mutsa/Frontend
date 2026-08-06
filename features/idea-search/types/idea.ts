export interface Idea {
    id: number;
    image: string;
    projectName: string;
    keywords: string;
    description: string;
    type: '판매' | '기부';
  }
  
  export interface SearchData {
    summaryText: string;
    ideas: Idea[];
  }