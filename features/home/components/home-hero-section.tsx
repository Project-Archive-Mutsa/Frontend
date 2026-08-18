import MainAiSearchInput from "./main-ai-search-input";

const searchExamples = [
  "아이디어 중복 확인",
  "비슷한 수상작 탐색",
  "유사 프로젝트 비교",
];

export default function HomeHeroSection() {
  return (
    <section className="border-b border-[#dce8f4] bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-balance break-keep text-3xl leading-tight font-bold tracking-[-0.025em] text-[#102a43] sm:text-4xl lg:text-5xl">
            내가 만들려는 프로젝트, 이미 있었을까요?
          </h1>
          <p className="mx-auto mt-5 max-w-4xl text-sm leading-7 whitespace-nowrap text-[#5d738b] sm:text-base">
            만들려는 서비스나 기능을 검색하면
            <br />
            AI가 유사한 선행 프로젝트와 수상작을 찾아 공통점과 차이점을 비교해
            드립니다.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <MainAiSearchInput />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[#657b91]">
            <span className="whitespace-nowrap font-semibold text-[#3f5f7d]">
              검색 예시
            </span>
            <ul
              className="flex flex-wrap justify-center gap-x-4 gap-y-1"
              aria-label="검색 활용 예시"
            >
              {searchExamples.map((example) => (
                <li key={example} className="whitespace-nowrap">
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
