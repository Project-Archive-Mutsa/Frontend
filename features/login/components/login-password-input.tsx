interface PasswordInputProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function PasswordInput({
  value,
  onValueChange,
}: PasswordInputProps) {
  return (
    <label className="block" htmlFor="login-password">
      <span className="mb-2.5 block text-sm font-bold text-[#274f77]">
        비밀번호
      </span>
      <span className="relative block">
        <input
          id="login-password"
          type="password"
          name="password"
          value={value}
          placeholder="비밀번호를 입력해주세요."
          autoComplete="current-password"
          className="h-14 w-full rounded-xl border border-[#c7d6e2] bg-[#fbfdff] px-4 pr-14 text-base text-[#163a5d] outline-none transition-colors placeholder:text-[#75899d] hover:border-[#a9bfd0] focus:border-[#397fba] focus:ring-4 focus:ring-[#579fd8]/14"
          onChange={(event) => {
            onValueChange(event.currentTarget.value);
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 flex size-6 -translate-y-1/2 items-center justify-center text-[#6d8296]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        </span>
      </span>
    </label>
  );
}
