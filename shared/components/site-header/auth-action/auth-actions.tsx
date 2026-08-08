import LoginButton from "./components/login-button";
import RegisterButton from "./components/register-button";

export default function AuthActions() {
  return (
    <nav aria-label="회원 메뉴">
      <LoginButton />
      <RegisterButton />
    </nav>
  );
}
