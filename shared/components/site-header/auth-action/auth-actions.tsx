import LoginButton from "./components/login-button";
import RegisterButton from "./components/register-button";

export default function AuthActions() {
  return (
    <nav
      aria-label="회원 메뉴"
      className="ml-auto flex shrink-0 items-center gap-2"
    >
      <LoginButton />
      <RegisterButton />
    </nav>
  );
}
