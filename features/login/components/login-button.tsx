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
      className="bg-brand hover:bg-brand-hover flex h-12 w-full cursor-pointer items-center justify-center rounded-lg px-5 text-base font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? (
        <LoadingSpinner size={20} />
      ) : (
        "로그인"
      )}
    </button>
  );
}
