import LoadingSpinner from "@/shared/components/loading-spinner/loading-spinner";

interface LoginButtonProps {
  isPending: boolean;
}

export default function LoginButton({ isPending }: LoginButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending}
      aria-busy={isPending}
      className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl bg-[#174f87] px-5 text-base font-bold text-white shadow-[0_14px_30px_-18px_rgba(23,79,135,0.9)] transition-colors hover:bg-[#0f426f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f79b9] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? (
        <span className="[&>span]:!border-white [&>span]:!border-b-transparent">
          <LoadingSpinner size={20} />
        </span>
      ) : (
        "로그인"
      )}
    </button>
  );
}
