interface EmailInputProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function EmailInput({ value, onValueChange }: EmailInputProps) {
  return (
    <label className="block" htmlFor="login-email">
      <span className="text-brand mb-2 block text-sm font-bold">
        이메일
      </span>
      <input
        id="login-email"
        type="email"
        name="email"
        value={value}
        placeholder="이메일을 입력해주세요."
        autoComplete="email"
        className="focus:border-brand-accent focus:ring-brand-soft h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:ring-2"
        onChange={(event) => {
          onValueChange(event.currentTarget.value);
        }}
      />
    </label>
  );
}
