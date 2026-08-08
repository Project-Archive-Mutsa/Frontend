import AiSearchInput from "./ai-search-input";
import AuthActions from "./auth-action/auth-actions";
import HeaderLogo from "./header-logo";
import { MainNavigation } from "./main-navigation";

export default function SiteHeader() {
  return (
    <header className="border border-b flex justify-between">
      <HeaderLogo />
      <AiSearchInput />
      <MainNavigation />
      <AuthActions />
    </header>
  );
}
