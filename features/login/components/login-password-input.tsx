"use client";

import { useState } from "react";

interface PasswordInputProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function PasswordInput({
  value,
  onValueChange,
}: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div>
      <label
        className="text-brand mb-2 block text-sm font-bold"
        htmlFor="login-password"
      >
        비밀번호
      </label>
      <div className="relative">
        <input
          id="login-password"
          type={isPasswordVisible ? "text" : "password"}
          name="password"
          value={value}
          placeholder="비밀번호를 입력해주세요."
          autoComplete="current-password"
          className="focus:border-brand-accent focus:ring-brand-soft h-12 w-full rounded-lg border border-slate-300 bg-white px-4 pr-16 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2"
          onChange={(event) => {
            onValueChange(event.currentTarget.value);
          }}
        />
        <button
          type="button"
          aria-pressed={isPasswordVisible}
          aria-label={isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
          className="hover:text-brand absolute top-1/2 right-2 flex min-h-10 min-w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-accent"
          onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
        >
          {isPasswordVisible ? "숨기기" : "보기"}
        </button>
      </div>
    </div>
  );
}
