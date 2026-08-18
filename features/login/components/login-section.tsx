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
      <header>
        <h1 className="font-display text-brand text-3xl font-bold tracking-[-0.025em]">
          로그인
        </h1>
        <p className="mt-2 text-base leading-6 text-slate-600">
          프로젝트 검색과 등록을 계속하려면 계정 정보를 입력해 주세요.
        </p>
      </header>

      <div className="mt-6 space-y-4">
        <EmailInput
          value={values.email}
          onValueChange={(email) => updateField("email", email)}
        />

        <PasswordInput
          value={values.password}
          onValueChange={(password) => updateField("password", password)}
        />
      </div>

      <div className="mt-3 min-h-6">
        {error ? (
          <p
            role="alert"
            className="text-sm leading-6 font-medium text-red-700"
          >
            {error.message}
          </p>
        ) : null}
      </div>

      <div className="mt-3">
        <LoginButton isPending={isPending} />
      </div>

    </form>
  );
}
