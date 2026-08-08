import { SearchData } from '@/mocks/idea-search/types';
import { searchMockData } from '@/mocks/idea-search/dummy-data';

export const getIdeaSearchData = async (): Promise<SearchData> => {
  // 나중에 실제 백엔드 연동 시 fetch나 axios 호출 코드로만 교체하면 됩니다.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(searchMockData);
    }, 500);
  });
};