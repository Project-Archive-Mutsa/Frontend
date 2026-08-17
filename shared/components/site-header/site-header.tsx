import AuthActions from "./auth-action/auth-actions";
import HeaderLogo from "./header-logo";
import { MainNavigation } from "./main-navigation";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 px-5 py-3 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-10">
        <HeaderLogo />
        <MainNavigation />
        <AuthActions />
      </div>
    </header>
  );
}
