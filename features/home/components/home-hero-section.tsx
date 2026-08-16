import MainAiSearchInput from "./main-ai-search-input";

const searchExamples = [
  "아이디어 중복 확인",
  "비슷한 수상작 탐색",
  "유사 프로젝트 비교",
];

export default function HomeHeroSection() {
  return (
    <section className="relative border-b border-[#dce8f4] bg-white">
      <div
        aria-hidden="true"
        className="absolute -left-24 top-8 size-72 rounded-full bg-[#e5f2ff]/65 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-0 size-64 rounded-full bg-[#eef7ff] blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:px-10 lg:pb-28 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[#3978b5] uppercase sm:text-sm">
            AI Project Discovery
          </p>
          <h1 className="mt-4 text-3xl leading-tight font-bold tracking-[-0.045em] text-[#102a43] sm:text-4xl lg:text-5xl">
            내가 만들려는 프로젝트, 이미 있었을까요?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#5d738b] sm:text-base">
            만들려는 서비스나 기능을 검색하면 AI가 유사한 선행 프로젝트와
            수상작을 찾아 공통점과 차이점을 비교해 드립니다.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="mb-3 flex items-center justify-center gap-2 px-2 text-sm font-semibold text-[#214f7e]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#59a8e9] opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-[#2a78bb]" />
            </span>
            AI로 프로젝트 아카이브 탐색하기
          </div>
          <MainAiSearchInput />
          <ul
            className="mt-4 flex flex-wrap justify-center gap-2 px-1"
            aria-label="검색 활용 예시"
          >
            {searchExamples.map((example) => (
              <li
                key={example}
                className="rounded-full border border-[#d7e4f1] bg-[#f6faff] px-3 py-1.5 text-xs font-medium text-[#56718d]"
              >
                {example}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
