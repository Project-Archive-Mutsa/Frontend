interface EmailInputProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function EmailInput({ value, onValueChange }: EmailInputProps) {
  return (
    <label className="block" htmlFor="login-email">
      <span className="mb-2.5 block text-sm font-bold text-[#274f77]">
        이메일
      </span>
      <input
        id="login-email"
        type="email"
        name="email"
        value={value}
        placeholder="이메일을 입력해주세요."
        autoComplete="email"
        className="h-14 w-full rounded-xl border border-[#c7d6e2] bg-[#fbfdff] px-4 text-base text-[#163a5d] outline-none transition-colors placeholder:text-[#75899d] hover:border-[#a9bfd0] focus:border-[#397fba] focus:ring-4 focus:ring-[#579fd8]/14"
        onChange={(event) => {
          onValueChange(event.currentTarget.value);
        }}
      />
    </label>
  );
}
