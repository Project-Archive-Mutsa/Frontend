import MainAiSearchInput from "./main-ai-search-input";

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
        </div>
      </div>
    </section>
  );
}
