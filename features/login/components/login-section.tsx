"use client";

import useLoginForm from "../hooks/use-login-form";
import LoginButton from "./login-button";
import EmailInput from "./login-email-input";
import PasswordInput from "./login-password-input";

export default function LoginSection() {
  const { error, isPending, values, handleSubmit, updateField } =
    useLoginForm();

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div>
        <p className="text-xs font-bold tracking-[0.18em] text-[#3978b5] uppercase">
          Welcome back
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-[#123f70]">
          로그인
        </h1>
        <p className="mt-3 text-base leading-7 text-[#5f7386]">
          계정 정보를 입력해 아카이브를 계속 둘러보세요.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <EmailInput
          value={values.email}
          onValueChange={(email) => updateField("email", email)}
        />

        <PasswordInput
          value={values.password}
          onValueChange={(password) => updateField("password", password)}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 text-sm font-medium text-[#617589]">
        <span>로그인 유지</span>
        <span>비밀번호 찾기</span>
      </div>

      <div className="mt-4 min-h-6">
        {error ? (
          <p
            role="alert"
            className="text-sm leading-6 font-medium text-[#a83f3f]"
          >
            {error.message}
          </p>
        ) : null}
      </div>

      <div className="mt-4">
        <LoginButton isPending={isPending} />
      </div>
    </form>
  );
}
