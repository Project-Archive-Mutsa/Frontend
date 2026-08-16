import AiSearchInput from "./ai-search-input";
import AuthActions from "./auth-action/auth-actions";
import HeaderLogo from "./header-logo";
import { MainNavigation } from "./main-navigation";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#123f70]/95 text-white shadow-[0_8px_30px_-18px_rgba(4,31,58,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 px-5 py-3 sm:px-8 lg:flex-nowrap lg:px-10">
        <HeaderLogo />
        <AiSearchInput />
        <MainNavigation />
        <AuthActions />
      </div>
    </header>
  );
}
